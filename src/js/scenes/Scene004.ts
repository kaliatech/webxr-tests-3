import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Scene } from '@babylonjs/core/scene.js'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { VideoDome } from '@babylonjs/core/Helpers/videoDome'

// This adds ~500k (100k gzipped) to build
//import * as GUI from '@babylonjs/gui'
// This adds about ~300k

import { LogicalScene } from '../LogicalScene.js'
import * as ColorMaterials from '../3d/materials/ColorMaterials'
import { EventBus } from 'ts-bus'
import { ControllerTrackingMenu } from '../3d/objects/ControllerTrackingMenu'
import { Controllers } from '../../types'
import { AxesWidget } from '../3d/objects/AxesWidget'

export class Scene004 extends LogicalScene {
  private leftMenu?: ControllerTrackingMenu

  private createVideoDome() {
    //const url = "https://yoda.blob.core.windows.net/videos/uptale360.mp4"
    //const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/uptale360.mp4"
    //const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/hughhou/Insta360Titan-7680_60fps_H265_100Mbps_360.mp4"

    const videoDomeOpts = {
      resolution: 32,
      clickToPlay: true,
      autoPlay: false,
    }

    const url = 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/hughhou/output_zcam_180_3d.mp4'
    const videoDome = new VideoDome('videoDome', url, videoDomeOpts, this.scene)
    videoDome.videoMode = VideoDome.MODE_SIDEBYSIDE
    videoDome.halfDome = true

    // const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/kandaovr/Dance_6k6k30_3dv.mp4"
    // const videoDome = new VideoDome("videoDome", url, videoDomeOpts, this.scene);
    // videoDome.videoMode = VideoDome.MODE_TOPBOTTOM;
  }

  constructor(scene: Scene, appBus: EventBus) {
    super(scene, appBus)

    // Add a simple light
    const light = new HemisphericLight('light1b', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7
    this.assetContainer.lights.push(light)

    const sphereD = 1.0

    // Add 1 unit sphere at origin
    const sphere = MeshBuilder.CreateSphere('originSphere', { segments: 32, diameter: sphereD }, scene)
    sphere.position.x = 1
    sphere.position.y = 0
    sphere.position.z = 1
    sphere.material = ColorMaterials.red(scene)
    sphere.checkCollisions = true
    this.assetContainer.meshes.push(sphere)

    // Add 2 unit axes widget at origin
    const axesWidget = new AxesWidget(scene, 'axesWidget', 1)
    this.assetContainer.transformNodes.push(axesWidget.root)
    this.assetContainer.meshes.push(...axesWidget.root.getChildMeshes(false))

    this.createVideoDome()
    this.assetContainer.removeAllFromScene()
  }

  load() {
    super.load()
  }

  unload() {
    if (this.leftMenu) {
      this.leftMenu.dispose()
    }

    super.unload()
  }

  onControllersChange(controllers: Controllers) {
    super.onControllersChange(controllers)

    if (controllers.leftController) {
      this.leftMenu = new ControllerTrackingMenu(this.scene, controllers.leftController)
    } else {
      //TODO: seems dispose will also dispose child materials?
      this.leftMenu?.dispose()
    }
  }
}
