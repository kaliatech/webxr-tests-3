import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Scene } from '@babylonjs/core/scene.js'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { VideoDome } from '@babylonjs/core/Helpers/videoDome'

// This adds ~500k (100k gzipped) to build
//import * as GUI from '@babylonjs/gui'
// This adds about ~300k
//import * as GUI from '@babylonjs/gui/2D'

import { LogicalScene } from '../LogicalScene.js'
import * as ColorMaterials from '../3d/materials/ColorMaterials'
import { EventBus } from 'ts-bus'
import { ControllerTrackingMenu } from '../3d/objects/ControllerTrackingMenu'
import { Controllers } from '../../types'
import { AxesWidget } from '../3d/objects/AxesWidget'

import { DefaultCollisionCoordinator } from '@babylonjs/core/Collisions/collisionCoordinator'

export class Scene004 extends LogicalScene {
  private leftMenu?: ControllerTrackingMenu
  private videoDome?: VideoDome

  constructor(scene: Scene, appBus: EventBus) {
    super(scene, appBus)

    //TODO: Research how this works, if it needs disposed, etc
    new DefaultCollisionCoordinator().init(this.scene)

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
    this.assetContainer.transformNodes.push(this.videoDome)
    this.assetContainer.meshes.push(...this.videoDome.getChildMeshes())

    //const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/kandaovr/Dance_6k6k30_3dv.mp4"
    // const videoDome = new VideoDome("videoDome", url, videoDomeOpts, this.scene);
    // videoDome.videoMode = VideoDome.MODE_TOPBOTTOM;
  }

  load() {
    super.load()
  }

  unload() {
    super.unload()
  }

  /**
   * Always called at end of scene load, and at beginning of scene unload (with undefined param).
   *
   * @param controllers
   */
  onControllersChange(controllers?: Controllers): void  {
    super.onControllersChange(controllers)
    if (controllers?.leftController) {
      if (!this.leftMenu) {
        this.leftMenu = new ControllerTrackingMenu(this.scene)
      }
      this.leftMenu.load(controllers.leftController)
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
