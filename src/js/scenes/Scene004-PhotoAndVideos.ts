import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { VideoDome } from '@babylonjs/core/Helpers/videoDome'

// This adds ~500k (100k gzipped) to build
//import * as GUI from '@babylonjs/gui'
// This adds about ~300k
//import * as GUI from '@babylonjs/gui/2D'

import { LogicalScene } from '../LogicalScene.js'
import * as ColorMaterials from '../3d/materials/ColorMaterials'
import { ControllerTrackingMenu } from '../3d/objects/ControllerTrackingMenu'
import { AxesWidget } from '../3d/objects/AxesWidget'

import { AppManager } from '../AppManager'
import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController'

export class Scene004PhotoAndVideos extends LogicalScene {
  private leftMenu?: ControllerTrackingMenu
  private videoDome?: VideoDome

  constructor(appManager: AppManager) {
    super(appManager, false)

    // Add a simple light
    const light = new HemisphericLight('light1b', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
    this.sceneAssetContainer.lights.push(light)

    const sphereD = 1.0

    // Add 1 unit sphere at origin
    const sphere = MeshBuilder.CreateSphere('originSphere', { segments: 32, diameter: sphereD }, this.scene)
    sphere.position.x = 1
    sphere.position.y = 0
    sphere.position.z = 1
    sphere.material = ColorMaterials.red(this.scene)
    sphere.checkCollisions = true
    this.sceneAssetContainer.meshes.push(sphere)

    // Add 2 unit axes widget at origin
    const axesWidget = new AxesWidget(this.scene, 'axesWidget', 1)
    this.sceneAssetContainer.transformNodes.push(axesWidget.root)
    this.sceneAssetContainer.meshes.push(...axesWidget.root.getChildMeshes(false))

    this.createVideoDome()
    this.sceneAssetContainer.removeAllFromScene()
  }

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
    this.videoDome = new VideoDome('videoDome', url, videoDomeOpts, this.scene)
    this.videoDome.videoMode = VideoDome.MODE_SIDEBYSIDE
    this.videoDome.halfDome = true
    this.sceneAssetContainer.transformNodes.push(this.videoDome)
    this.sceneAssetContainer.meshes.push(...this.videoDome.getChildMeshes())

    //const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/kandaovr/Dance_6k6k30_3dv.mp4"
    // const videoDome = new VideoDome("videoDome", url, videoDomeOpts, this.scene);
    // videoDome.videoMode = VideoDome.MODE_TOPBOTTOM;
  }

  load() {
    super.load()
    this.videoDome?.videoTexture?.video.play()
  }

  unload() {
    super.unload()

    this.videoDome?.videoTexture?.video.pause()
  }

  /**
   * Always called at end of this.scene load, and at beginning of this.scene unload (with undefined param).

   */
  onControllersChange(
    leftController?: WebXRAbstractMotionController,
    rightController?: WebXRAbstractMotionController,
  ): void {
    super.onControllersChange(leftController, rightController)
    if (leftController) {
      if (!this.leftMenu) {
        this.leftMenu = new ControllerTrackingMenu(this.scene)
      }
      this.leftMenu.load(leftController)
    } else {
      this.leftMenu?.unload()
    }
  }

  dispose() {
    this.leftMenu?.dispose()
    this.videoDome?.dispose()
    super.dispose()
  }
}
