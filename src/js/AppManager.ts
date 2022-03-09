import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { DefaultCollisionCoordinator } from '@babylonjs/core/Collisions/collisionCoordinator'
import { Color4 } from '@babylonjs/core/Maths/math.color'
import { Engine } from '@babylonjs/core/Engines/engine'
import { EventBus } from 'ts-bus'
import { Scene } from '@babylonjs/core/scene.js'
import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience'
import { WebXRFeatureName } from '@babylonjs/core/XR/webXRFeaturesManager'
import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera'
import { Nullable } from '@babylonjs/core/types'
import { Observer } from '@babylonjs/core/Misc/observable'
import { WebXRInputSource } from '@babylonjs/core/XR/webXRInputSource'
import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController'
import { WebXRState } from '@babylonjs/core/XR/webXRTypes'

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

import { ControllersChangedEvent } from './AppManagerEvents'

// Imports required for WebXRLayers and Multiview
// Experimental and currently problematic.
//import '@babylonjs/core/XR/features/WebXRLayers'
//import '@babylonjs/core/Engines/Extensions/engine.multiview'

// ----------------------

export class AppManager {
  babylonEngine: Engine
  scene: Scene

  public appBus: EventBus = new EventBus()

  private onResizeHandle = this.onResize.bind(this)
  private collisionCoord:DefaultCollisionCoordinator

  protected defaultCamera: ArcRotateCamera

  private webXrDefaultExp: WebXRDefaultExperience | undefined

  private onControllerAddedObv: Nullable<Observer<WebXRInputSource>> = null
  private onControllerRemovedObv: Nullable<Observer<WebXRInputSource>> = null
  private leftInputSource: WebXRInputSource | undefined
  public leftController: WebXRAbstractMotionController | undefined
  private rightInputSource: WebXRInputSource | undefined
  public rightController: WebXRAbstractMotionController | undefined

  private logicalScenes: LogicalScene[] = []

  constructor(private canvas: HTMLCanvasElement, private xrSystem: XRSystem, private window?: Window) {
    this.babylonEngine = new Engine(this.canvas, true, { stencil: true })
    this.scene = new Scene(this.babylonEngine)
    this.scene.clearColor = new Color4(0,0,0,1)

    //TODO: Research how this works, if it is expensive when not used, etc.
    this.collisionCoord = new DefaultCollisionCoordinator()
    this.collisionCoord.init(this.scene)

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

      //TODO: Probably will need to add this to appBus
      // webXrDefaultExp.baseExperience.onStateChangedObservable.add((state:WebXRState) => {
      // })

      this._setupControllers(webXrDefaultExp)

      this._startRenderLoop()
      return webXrDefaultExp
    })
  }

  get camera(): TargetCamera {
    if (this.webXrDefaultExp?.baseExperience?.camera && this.webXrDefaultExp.baseExperience.state == WebXRState.IN_XR) {
      //https://doc.babylonjs.com/divingDeeper/webXR/webXRCamera#current-users-height
      //const userHeight = xrCamera.realWorldHeight;
      return this.webXrDefaultExp.baseExperience.camera
    } else {
      return this.defaultCamera
    }
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
    gameScene.load()
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

  async dispose(window?: Window) {
    this.logicalScenes.forEach((logicalScene) => {
      logicalScene.dispose()
    })
    this.logicalScenes = []

    if (this.webXrDefaultExp) {
      this.webXrDefaultExp.input.onControllerAddedObservable.remove(this.onControllerAddedObv)
      this.webXrDefaultExp.input.onControllerRemovedObservable.remove(this.onControllerRemovedObv)
    }

    if (this.leftInputSource) {
      this.leftInputSource.onMotionControllerInitObservable.clear()
      this.leftInputSource.onMeshLoadedObservable.clear()
    }
    if (this.rightInputSource) {
      this.rightInputSource.onMotionControllerInitObservable.clear()
      this.rightInputSource.onMeshLoadedObservable.clear()
    }
    window?.removeEventListener('resize', this.onResizeHandle)

    // Must exit XR before calling dispose on engine, else errors
    if (this.webXrDefaultExp) {
      await this.webXrDefaultExp.baseExperience.exitXRAsync()
    }

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
            this.appBus.publish(
              ControllersChangedEvent({ leftController: this.leftController, rightController: this.rightController }),
            )
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
        this.appBus.publish(
          ControllersChangedEvent({ leftController: this.leftController, rightController: this.rightController }),
        )
      },
    )
  }
}
