import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

// This adds ~500k (100k gzipped) to build
//import * as GUI from '@babylonjs/gui'
// This adds about ~300k
//import * as GUI from '@babylonjs/gui/2D'
import { LogicalScene } from '../LogicalScene.js'

import { AppManager } from '../AppManager'
//import { VideoDome2 } from '../3d/VideoDome2'
import { WebXRFeatureName } from '@babylonjs/core/XR/webXRFeaturesManager'
import { WebXRLayers } from '@babylonjs/core/XR/features/WebXRLayers'
import { WebXRStateChangedEvent } from '../AppManagerEvents'
import { WebXRState } from '@babylonjs/core/XR/webXRTypes'

export class Scene007WebXrLayers extends LogicalScene {
  protected appBusSubs: { (): void }[] = []

  constructor(appManager: AppManager) {
    super(appManager, true)

    // Add a simple light
    const light = new HemisphericLight('light1b', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
    this.sceneAssetContainer.lights.push(light)

    this._init()
  }

  _init() {
    // WebXR Layers only work in WebXR session.

    // Will maybe need to look at polyfill:
    //https://github.com/immersive-web/webxr-layers-polyfill

    this.appBusSubs.push(
      this.appManager.appBus.subscribe(WebXRStateChangedEvent, (event) => {
        this._onWebXrStateChange(event.payload.state)
      }),
    )
  }

  unload() {
    super.unload()
  }

  dispose() {
    super.dispose()
  }

  private _onWebXrStateChange(state:WebXRState) {

    if (state != WebXRState.IN_XR) {
      return
    }

    const baseExp = this.appManager?.webXrDefaultExp?.baseExperience
    if (!baseExp) {
      console.error('There is no WebXR base experience.')
      return
    }


    const xrLayers = baseExp.featuresManager.getEnabledFeature(WebXRFeatureName.LAYERS) as WebXRLayers

    // eslint-disable-next-line
    xrLayers._xrWebGLBinding.createEquirectLayer()
    console.log('attached', xrLayers.attached)

    const layerWrapper = xrLayers.createProjectionLayer(
      {
        textureType: 'texture', //  Default  "texture";  Other option is "texture-array"
        colorFormat: WebGL2RenderingContext.RGBA, //  Default 0x1908, RGBA
        depthFormat: WebGL2RenderingContext.DEPTH_COMPONENT, //  Default 0x1902, DEPTH_COMPONENT
        scaleFactor: 1.0,
      },
      false,
    )
    //const rttProvider = layerWrapper.createRTTProvider(baseExp.sessionManager)
    baseExp.sessionManager.

    console.log('layerWrapper', layerWrapper)
    console.log('layer', layerWrapper.layer)


    const xrLayerWrapper = xrLayers.createXRWebGLLayer({
      antialias: true,
      depth: false,
      stencil: false,
      alpha: false,
      multiview: false,
      framebufferScaleFactor: 1.0
    })
    xrLayers.addXRSessionLayer(xrLayerWrapper)

  }
}
