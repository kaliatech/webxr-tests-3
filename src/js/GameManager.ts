import { Engine } from '@babylonjs/core/Engines/engine'
import { Nullable } from '@babylonjs/core'
import { XRSystem } from 'webxr'
import { Scene001 } from "./scene001/Scene001";

// Required for loading controller models from WebXR registry
import '@babylonjs/loaders/glTF'

// Without this next import, error message when loading controller models:
//  "Build of NodeMaterial failed" error when loading controller model"
//  "Uncaught (in promise) Build of NodeMaterial failed: input rgba from block FragmentOutput[FragmentOutputBlock] is not connected and is not optional."
import '@babylonjs/core/Materials/Node/Blocks'

import { WebXRDefaultExperience } from "@babylonjs/core/XR/webXRDefaultExperience";

export class GameManager {
  canvas: HTMLCanvasElement
  xrSystem: XRSystem

  babylonEngine: Nullable<Engine> = null

  onResizeHandle = this.onResize.bind(this)

  constructor(canvas: HTMLCanvasElement, xrSystem: XRSystem) {
    this.canvas = canvas
    this.xrSystem = xrSystem
  }

  init(window?: Window) {

    if (window) {
      window.addEventListener('resize', this.onResizeHandle)
    }

    const antiAlias = true
    this.babylonEngine = new Engine(this.canvas, antiAlias)

    const scene001 = new Scene001(this.babylonEngine)
    scene001.init()

    // Setup default WebXR experience
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    WebXRDefaultExperience.CreateAsync(scene001.babylonScene!, {
      floorMeshes: [
        scene001.floorMesh!
      ],
      optionalFeatures: true,
    }).then(() => {
      // An initial resize seems to be required with the current canvas setup. Not sure why. Subsequent window
      // resizes are handled by event handler.
      this.babylonEngine?.resize()

      // Run render loop to render future frames.
      this.babylonEngine?.runRenderLoop(function () {
        scene001.babylonScene?.render()
      })
    })
  }

  onResize(evt: Event) {
    this.babylonEngine?.resize(true)
  }

  onDestroy(window?: Window) {
    window?.removeEventListener('resize', this.onResizeHandle)
  }
}
