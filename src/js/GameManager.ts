import { Engine } from '@babylonjs/core/Engines/engine'
import { XRSystem } from 'webxr'
import { Scene001 } from './scene001/Scene001'

// Required for loading controller models from WebXR registry
import '@babylonjs/loaders/glTF'

// Without this next import, error message when loading controller models:
//  "Build of NodeMaterial failed" error when loading controller model"
//  "Uncaught (in promise) Build of NodeMaterial failed: input rgba from block FragmentOutput[FragmentOutputBlock] is not connected and is not optional."
import '@babylonjs/core/Materials/Node/Blocks'

import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience'
import { GameScene } from './GameScene'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { Scene002 } from './scene001/Scene002'

export class GameManager {
  canvas: HTMLCanvasElement

  babylonEngine: Engine
  xrSystem: XRSystem

  private onResizeHandle = this.onResize.bind(this)

  constructor(canvas: HTMLCanvasElement, xrSystem: XRSystem, window?: Window) {
    this.canvas = canvas
    this.xrSystem = xrSystem

    window?.addEventListener('resize', this.onResizeHandle)
    this.babylonEngine = new Engine(this.canvas, true, { stencil: true })
  }

  loadScene001() {
    const gameScene = new Scene001(this.babylonEngine)
    this.init(gameScene)
  }

  loadScene002() {
    const gameScene = new Scene002(this.babylonEngine)
    this.init(gameScene)
  }

  init(gameScene: GameScene) {
    // Setup default WebXR experience
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    this.initWebXr(gameScene).then(() => {
      // An initial resize seems to be required with the current canvas setup. Not sure why.
      this.babylonEngine.resize()

      this.babylonEngine.runRenderLoop(() => {
        gameScene.scene.render()
      })
    })
  }

  private async initWebXr(gameScene: GameScene): Promise<WebXRDefaultExperience> {
    const floorMeshes: Mesh[] = []
    if (gameScene.floorMesh) {
      floorMeshes.push(gameScene.floorMesh)
    }
    if (!gameScene.scene) {
      throw new Error('Scene is required')
    }
    return WebXRDefaultExperience.CreateAsync(gameScene.scene, {
      floorMeshes,
      optionalFeatures: true,
    })
  }

  onResize() {
    console.log('onResize')
    this.babylonEngine.resize(true)
  }

  destroy(window?: Window) {
    window?.removeEventListener('resize', this.onResizeHandle)
    this.babylonEngine.dispose()
  }
}
