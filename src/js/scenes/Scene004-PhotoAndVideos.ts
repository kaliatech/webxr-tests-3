import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { PhotoDome } from '@babylonjs/core/Helpers/photoDome'
import { VideoDome } from '@babylonjs/core/Helpers/videoDome'

// This adds ~500k (100k gzipped) to build
//import * as GUI from '@babylonjs/gui'
// This adds about ~300k
//import * as GUI from '@babylonjs/gui/2D'
import { LogicalScene } from '../LogicalScene.js'
import * as ColorMaterials from '../3d/materials/ColorMaterials'
import { AxesWidget } from '../3d/objects/AxesWidget'

import { AppManager } from '../AppManager'
import { MediaSelectorGui } from './scene004/MediaSelectorGui'
import { Control } from '@babylonjs/gui/2D/controls/control'

import { MediaItem, mediaItems } from './scene004/MediaData'
//import { VideoDome2 } from '../3d/VideoDome2'
import { TextureDome } from '@babylonjs/core/Helpers/textureDome'
import { VideoDome2 } from '../3d/VideoDome2'

export class Scene004PhotoAndVideos extends LogicalScene {
  private videoDome?: VideoDome
  private photoDome?: PhotoDome
  private activeMediaIdx = -1

  private selectorGui: MediaSelectorGui
  private mediaItems = mediaItems

  constructor(appManager: AppManager) {
    super(appManager, false)

    // Add a simple light
    const light = new HemisphericLight('light1b', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
    this.sceneAssetContainer.lights.push(light)

    const sphereD = 1

    // Add 1 unit sphere at origin
    const sphere = MeshBuilder.CreateSphere('originSphere', { segments: 32, diameter: sphereD }, this.scene)
    sphere.position.x = 0
    sphere.position.y = 0
    sphere.position.z = 0
    sphere.material = ColorMaterials.red(this.scene)
    sphere.checkCollisions = true
    this.sceneAssetContainer.meshes.push(sphere)

    // Add 2 unit axes widget at origin
    const axesWidget = new AxesWidget(this.scene, 'axesWidget', 1)
    this.sceneAssetContainer.transformNodes.push(axesWidget.root)
    this.sceneAssetContainer.meshes.push(...axesWidget.root.getChildMeshes(false))

    //this.createVideoDome()
    //this.createPhotoDome()

    this.selectorGui = new MediaSelectorGui(
      this,
      'Scene004MediaSelectorGui',
      this.mediaItems,
      this.onMediaSelect.bind(this),
    )
    //this.sceneAssetContainer.transformNodes.push(this.selectorGui)
    //this.selectorGui.getChildMeshes().forEach(mesh => this.sceneAssetContainer.meshes.push(mesh))

    // this.selectorGui.init().then(() => {
    //   this.selectorGui.load()
    // })
    //this.sceneAssetContainer.removeAllFromScene()
  }

  private onMediaSelect(btn: Control) {
    this._play(btn.metadata.idx)
  }

  _play(mediaIdx: number): void {
    if (mediaIdx === this.activeMediaIdx) {
      return
    }

    if (this.videoDome) {
      this.videoDome.dispose(false, true)
      this.videoDome = undefined
    }

    if (this.photoDome) {
      this.photoDome.dispose(false, true)
      this.photoDome = undefined
    }

    this.activeMediaIdx = mediaIdx
    const mediaItem = this.mediaItems[mediaIdx]
    if (!mediaItem) {
      return
    }

    if (mediaItem.type === 'photo') {
      this.createPhotoDome(mediaItem)
    } else {
      this.createVideoDome(mediaItem)
    }
  }

  private createPhotoDome(mediaItem: MediaItem) {
    this.photoDome = new PhotoDome('photoDome', mediaItem.url.toString(), {
      resolution: 32,
      clickToPlay: false,
      autoPlay: true,
      halfDomeMode: mediaItem.halfDome || false,
      // useDirectMapping: false
    }, this.scene)
    // this.photoDome.fovMultiplier = 2.5
    this.photoDome.imageMode = mediaItem.imageMode || TextureDome.MODE_MONOSCOPIC

    // this.sceneAssetContainer.transformNodes.push(this.photoDome)
    // this.sceneAssetContainer.meshes.push(...this.photoDome.getChildMeshes())
  }


  private createVideoDome(mediaItem: MediaItem) {
    this.videoDome = new VideoDome2('videoDome', mediaItem.url.toString(), {
      resolution: 32,
      clickToPlay: false,
      autoPlay: true,
      halfDomeMode: mediaItem.halfDome || false,
      // useDirectMapping: false
    }, this.scene)
    this.videoDome.videoMode = mediaItem.videoMode || VideoDome.MODE_MONOSCOPIC

    // this.videoDome.videoTexture.video.addEventListener('canplay', () => {
    //   this.videoDome?.videoTexture.video.play()
    // })
    // setTimeout(() => {
    //   this.videoDome?.videoTexture.video.play()
    // }, 1000)

    // this.videoDome.onLoadObservable.add(() => {
    //   this.videoDome?.videoTexture?.video.play()
    // })

    //this.videoDome.fovMultiplier = 0.8

    // this.sceneAssetContainer.transformNodes.push(this.videoDome)
    // this.sceneAssetContainer.meshes.push(...this.videoDome.getChildMeshes()) // TODO: required?

    //const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/kandaovr/Dance_6k6k30_3dv.mp4"
    // const videoDome = new VideoDome("videoDome", url, videoDomeOpts, this.scene);
    // videoDome.videoMode = VideoDome.MODE_TOPBOTTOM;
  }

  unload() {
    this._play(-1)
    super.unload()
  }

  dispose() {
    this.photoDome?.dispose(false, true)
    this.videoDome?.dispose(false, true)
    super.dispose()
  }
}
