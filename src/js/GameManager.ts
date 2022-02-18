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

export class GameManager {
  canvas: HTMLCanvasElement
  xrSystem: XRSystem
  babylonEngine: Maybe<Engine>

  private onResizeHandle = this.onResize.bind(this)

  constructor(canvas: HTMLCanvasElement, xrSystem: XRSystem) {
    this.canvas = canvas
    this.xrSystem = xrSystem
  }

  init(window?: Window) {
    window?.addEventListener('resize', this.onResizeHandle)

    this.babylonEngine = new Engine(this.canvas, true)

    const scene001 = this.initScene(this.babylonEngine)

    // Setup default WebXR experience
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    this.initWebXr(scene001).then(() => {
      // An initial resize seems to be required with the current canvas setup. Not sure why.
      this.babylonEngine?.resize()

      // Run render loop to render future frames.
      this.babylonEngine?.runRenderLoop(() => {
        scene001.scene?.render()
      })
    })
  }

  private initScene(babylonEngine: Engine): GameScene {
    const scene001 = new Scene001(babylonEngine)
    return scene001
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
    this.babylonEngine?.resize(true)
  }

  destroy(window?: Window) {
    this.babylonEngine?.dispose()
    window?.removeEventListener('resize', this.onResizeHandle)
  }
}
