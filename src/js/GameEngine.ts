import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene.js'
import { XRSystem } from 'webxr'
import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience'
import { WebXRFeatureName } from '@babylonjs/core/XR/webXRFeaturesManager'

import { GameScene } from './GameScene'
import { initDefaultCamera } from './scene-shared/DefaultCamera'


// Side Effect Imports for Babylon.js
// Import any side effects at the game engine level that _might_ be needed by scenes.
// ----------------------

// Required for loading controller models from WebXR registry
import '@babylonjs/loaders/glTF'

// Without this next import, error message when loading controller models:
//  "Build of NodeMaterial failed" error when loading controller model"
//  "Uncaught (in promise) Build of NodeMaterial failed: input rgba from block FragmentOutput[FragmentOutputBlock] is not connected and is not optional."
import '@babylonjs/core/Materials/Node/Blocks'

// Side effects required by various scenes
import '@babylonjs/core/Materials/Textures/Loaders'

import '@babylonjs/core/Layers/effectLayerSceneComponent'

// ----------------------

export class GameEngine {
  canvas: HTMLCanvasElement

  babylonEngine: Engine
  scene: Scene
  xrSystem: XRSystem

  protected defaultCamera: ArcRotateCamera | undefined

  private onResizeHandle = this.onResize.bind(this)

  private webXrDefaultExp: WebXRDefaultExperience | undefined
  private activeGameScene: GameScene | undefined

  constructor(canvas: HTMLCanvasElement, xrSystem: XRSystem, window?: Window) {
    this.canvas = canvas
    this.xrSystem = xrSystem

    this.babylonEngine = new Engine(this.canvas, true, { stencil: true })
    this.scene = new Scene(this.babylonEngine)
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
      this._startRenderLoop()
      this.webXrDefaultExp = webXrDefaultExp
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
  loadScene(gameScene: GameScene) {
    // Disable teleportation feature to clear any floor meshes
    if (this.webXrDefaultExp) {
      const featuresManager = this.webXrDefaultExp.baseExperience.featuresManager
      featuresManager.disableFeature(WebXRFeatureName.TELEPORTATION)
    }

    // Unload any currently active scene
    if (this.activeGameScene) {
      this.activeGameScene.unload()
    }

    // Load new scene
    this.activeGameScene = gameScene
    this.activeGameScene.load()

    // Re-enable teleportation with new floor meshes (if any)
    if (this.webXrDefaultExp) {
      const featuresManager = this.webXrDefaultExp.baseExperience.featuresManager
      featuresManager.enableFeature(WebXRFeatureName.TELEPORTATION, 'stable', {
        xrInput: this.webXrDefaultExp.input,
        floorMeshes: this.activeGameScene.floorMeshes,
      })
    }
  }

  /**
   * For testing purposes.
   * @param gameScene
   */
  unloadScene(gameScene: GameScene) {
    if (this.webXrDefaultExp) {
      const featuresManager = this.webXrDefaultExp.baseExperience.featuresManager
      featuresManager.disableFeature(WebXRFeatureName.TELEPORTATION)
    }

    if (this.activeGameScene) {
      this.activeGameScene.unload()
    }
    // console.log('postUnload', this.scene)
  }

  dispose(window?: Window) {
    this.activeGameScene?.dispose()
    window?.removeEventListener('resize', this.onResizeHandle)
    this.babylonEngine.dispose()
  }
}
