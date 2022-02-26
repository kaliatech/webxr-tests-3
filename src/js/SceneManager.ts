import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene.js'
import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience'
import { WebXRFeatureName } from '@babylonjs/core/XR/webXRFeaturesManager'
import { Nullable } from '@babylonjs/core/types'
import { Observable, Observer } from '@babylonjs/core/Misc/observable'
import { WebXRInputSource } from '@babylonjs/core/XR/webXRInputSource'
import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController'

import { LogicalScene } from './LogicalScene'
import { initDefaultCamera } from './3d/default-camera'

import type { XRSystem } from 'webxr'

// Side Effect Imports for Babylon.js
// Import any side effects at the game engine level that _might_ be needed by scenes.
// ----------------------
// Required for loading controller models from WebXR registry
import '@babylonjs/loaders/glTF'

// Without this next import, error message when loading controller models:
//  "Build of NodeMaterial failed" error when loading controller model"
//  "Uncaught (in promise) Build of NodeMaterial failed: input rgba from block FragmentOutput[FragmentOutputBlock] is not connected and is not optional."
import '@babylonjs/core/Materials/Node/Blocks'

// Miscellaneous side effects required by various scenes
import '@babylonjs/core/Materials/Textures/Loaders'
import '@babylonjs/core/Layers/effectLayerSceneComponent'

// Imports required for debug/inspector
// import '@babylonjs/core/Legacy/legacy'
// import '@babylonjs/core/Debug/debugLayer'
// import '@babylonjs/inspector'
//
import type { Controllers } from '../types'
import { EventBus } from 'ts-bus'
import { controllersChanged } from './AppBusEvents'

// Imports required for WebXRLayers and Multiview
// Experimental and currently problematic.
//import '@babylonjs/core/XR/features/WebXRLayers'
//import '@babylonjs/core/Engines/Extensions/engine.multiview'

// ----------------------

export class SceneManager {
  babylonEngine: Engine
  scene: Scene
  public controllerChangeObservable = new Observable<Controllers>()
  protected defaultCamera: ArcRotateCamera | undefined
  private onResizeHandle = this.onResize.bind(this)

  private webXrDefaultExp: WebXRDefaultExperience | undefined
  //private activeGameScene: LogicalScene | undefined

  private onControllerAddedObv: Nullable<Observer<WebXRInputSource>> = null
  private onControllerRemovedObv: Nullable<Observer<WebXRInputSource>> = null
  private leftInputSource: WebXRInputSource | undefined
  private leftController: WebXRAbstractMotionController | undefined
  private rightInputSource: WebXRInputSource | undefined
  private rightController: WebXRAbstractMotionController | undefined

  private controllers?: Controllers

  private logicalScenes: LogicalScene[] = []

  constructor(
    private canvas: HTMLCanvasElement,
    private xrSystem: XRSystem,
    private appBus: EventBus,
    private window?: Window,
  ) {
    this.babylonEngine = new Engine(this.canvas, true, { stencil: true })
    this.scene = new Scene(this.babylonEngine)

    // Debug/Inspector
    // this.scene.debugLayer.show({
    //   embedMode: true,
    //   overlay: true,
    // })

    this.defaultCamera = initDefaultCamera(this.scene)

    window?.addEventListener('resize', this.onResizeHandle)
  }

  onResize() {
    this.babylonEngine.resize(true)
  }

  initWebXr(): Promise<WebXRDefaultExperience> {
    return WebXRDefaultExperience.CreateAsync(this.scene, {
      optionalFeatures: true,
    }).then((webXrDefaultExp) => {
      // Enable WebXRLayers and Multiview
      // webXrDefaultExp.baseExperience.featuresManager.enableFeature(
      //   WebXRFeatureName.LAYERS,
      //   'latest',
      //   { preferMultiviewOnInit: true },
      //   true,
      //   false,
      // )
      this.webXrDefaultExp = webXrDefaultExp

      this._setupControllers(webXrDefaultExp)

      this._startRenderLoop()
      return webXrDefaultExp
    })
  }

  _startRenderLoop() {
    this.babylonEngine.resize()
    this.babylonEngine.runRenderLoop(() => {
      this.scene.render()
    })
  }

  /**
   * TODO: eventually could add a transition here
   * @param gameScene
   */
  loadScene(gameScene: LogicalScene) {
    // Disable teleportation feature to clear any floor meshes
    if (this.webXrDefaultExp) {
      const featuresManager = this.webXrDefaultExp.baseExperience.featuresManager
      featuresManager.disableFeature(WebXRFeatureName.TELEPORTATION)
    }

    // Load new scene
    gameScene.load(this.controllers)
    this.logicalScenes.push(gameScene)

    // Re-enable teleportation with new floor meshes (if any)
    if (this.webXrDefaultExp) {
      const featuresManager = this.webXrDefaultExp.baseExperience.featuresManager
      featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, 'stable', {
        xrInput: this.webXrDefaultExp.input,
        floorMeshes: gameScene.floorMeshes,
      })
    }
  }

  /**
   * Generally, no reason to explicitly unload a scene. Simply calling loadScene will unload any currently active scene.
   * @param gameScene
   */
  unloadScene(gameScene: LogicalScene) {
    if (this.webXrDefaultExp) {
      const featuresManager = this.webXrDefaultExp.baseExperience.featuresManager
      featuresManager.disableFeature(WebXRFeatureName.TELEPORTATION)
    }
    gameScene.unload()

    const index = this.logicalScenes.indexOf(gameScene)
    if (index > -1) {
      this.logicalScenes.splice(index, 1)
    }
  }

  dispose(window?: Window) {
    this.logicalScenes.forEach((logicalScene) => {
      logicalScene.dispose()
    })
    this.logicalScenes = []

    if (this.webXrDefaultExp) {
      this.webXrDefaultExp.input.onControllerAddedObservable.remove(this.onControllerAddedObv)
      this.webXrDefaultExp.input.onControllerRemovedObservable.remove(this.onControllerRemovedObv)
    }
    this.controllerChangeObservable.clear()
    window?.removeEventListener('resize', this.onResizeHandle)
    this.babylonEngine.dispose()
  }

  private _setupControllers(webXrDefaultExp: WebXRDefaultExperience) {
    this.onControllerAddedObv = webXrDefaultExp.input.onControllerAddedObservable.add(
      (controller: WebXRInputSource) => {
        // hands are also controllers, TBD if they get meshes?
        const isHand = controller.inputSource.hand
        if (isHand) return

        controller.onMotionControllerInitObservable.add((motionController: WebXRAbstractMotionController) => {
          const isLeft = motionController.handedness === 'left'
          controller.onMeshLoadedObservable.add(() => {
            if (isLeft) {
              this.leftInputSource = controller
              this.leftController = motionController
            } else {
              this.rightInputSource = controller
              this.rightController = motionController
            }
            this.controllers = { leftController: this.leftController, rightController: this.rightController }
            this.appBus.publish(controllersChanged({ controllers: this.controllers }))
          })
        })
      },
    )

    this.onControllerRemovedObv = webXrDefaultExp.input.onControllerRemovedObservable.add(
      (controller: WebXRInputSource) => {
        if (controller === this.leftInputSource) {
          this.leftInputSource = undefined
          this.leftController = undefined
        } else if (controller === this.rightInputSource) {
          this.rightInputSource = undefined
          this.rightController = undefined
        } else {
          // eslint-disable-next-line no-console
          console.error('Unxpected input source removal.')
        }
        this.controllers = { leftController: this.leftController, rightController: this.rightController }
        this.appBus.publish(controllersChanged({ controllers: this.controllers }))
      },
    )
  }
}
