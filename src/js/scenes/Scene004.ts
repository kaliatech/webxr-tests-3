import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { HighlightLayer } from '@babylonjs/core/Layers/highlightLayer'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Nullable } from '@babylonjs/core/types'
import { Observer } from '@babylonjs/core/Misc/observable'
import { PointerEventTypes, PointerInfo } from '@babylonjs/core/Events/pointerEvents'
import { Scene } from '@babylonjs/core/scene.js'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { VideoDome } from '@babylonjs/core/Helpers/videoDome'

// This adds ~500k (100k gzipped) to build
//import * as GUI from '@babylonjs/gui'

// This adds about ~300k
import * as GUI from '@babylonjs/gui/2D'

import { LogicalScene } from '../3d/LogicalScene.js'
import * as ColorMaterials from '../3d/materials/ColorMaterials'

// Temporary:
// import '@babylonjs/core/Debug/debugLayer' // Augments the scene with the debug methods
// import '@babylonjs/inspector'

export class Scene004 extends LogicalScene {
  private highlightLayer: HighlightLayer | undefined
  private highlightedGuiPanel: Mesh | undefined
  private highlightedMesh: AbstractMesh | undefined

  private pointerObv: Nullable<Observer<PointerInfo>> = null

  private createVideoDome() {
    //const url = "https://yoda.blob.core.windows.net/videos/uptale360.mp4"
    //const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/uptale360.mp4"
    //const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/hughhou/Insta360Titan-7680_60fps_H265_100Mbps_360.mp4"

    const videoDomeOpts = {
      resolution: 32,
      clickToPlay: true,
      autoPlay: false,
    }

    const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/hughhou/output_zcam_180_3d.mp4"
    const videoDome = new VideoDome("videoDome", url, videoDomeOpts, this.scene);
    videoDome.videoMode = VideoDome.MODE_SIDEBYSIDE;
    videoDome.halfDome = true

    // const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/kandaovr/Dance_6k6k30_3dv.mp4"
    // const videoDome = new VideoDome("videoDome", url, videoDomeOpts, this.scene);
    // videoDome.videoMode = VideoDome.MODE_TOPBOTTOM;

  }


  constructor(scene: Scene) {
    super(scene)

    //TODO: Needed?
    //new DefaultCollisionCoordinator().init(scene)

    //TODO: Needed?
    //const dm = new DeviceSourceManager(scene.getEngine())

    // // Add a camera for the 2D viewer
    // const camera = new ArcRotateCamera('Camerab', -Math.PI / 2, Math.PI / 3, 7, new Vector3(0, 1, 0), scene)
    // // camera.lowerBetaLimit = -Math.PI / 2 + 0.1
    // // camera.upperBetaLimit = Math.PI / 2 + -0.1
    // camera.upperRadiusLimit = 20
    // camera.panningDistanceLimit = 20
    // camera.checkCollisions = true // prevent rotating through floor, redundant with the beta limits though
    // camera.collisionRadius = new Vector3(1.5, 1.5, 1.5) // arbitrary for now
    // camera.wheelPrecision = 25.0
    // camera.attachControl(true)

    // Add a simple light
    const light = new HemisphericLight('light1b', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7
    this.assetContainer.lights.push(light)

    const sphereD = 1.0

    // Add three 1 unit spheres, X(R), Y(G), Z(B)
    const sphere = MeshBuilder.CreateSphere('xSphere', { segments: 32, diameter: sphereD }, scene)
    sphere.position.x = sphereD * -2
    sphere.position.y = sphereD * 2
    sphere.material = ColorMaterials.red(scene)
    sphere.checkCollisions = true
    sphere.enablePointerMoveEvents = true
    this.assetContainer.meshes.push(sphere)
    this.mirroredMeshes.push(sphere)

    const sphere3 = sphere.clone('ySphere', null)
    sphere3.id = sphere3.name
    sphere3.position.x = 0
    sphere3.position.y = sphereD
    sphere3.material = ColorMaterials.green(scene)
    this.assetContainer.meshes.push(sphere3)
    this.mirroredMeshes.push(sphere3)

    const sphere2 = sphere.clone('zSphere')
    sphere2.id = sphere2.name
    sphere2.position.x = sphereD * 2
    sphere2.position.y = sphereD
    sphere2.material = ColorMaterials.blue(scene)
    this.assetContainer.meshes.push(sphere2)
    this.mirroredMeshes.push(sphere2)

    this.createVideoDome()

    //this.scene.debugLayer.show({embedMode:true})

    this.highlightLayer = new HighlightLayer('hl1', scene)

    this.assetContainer.removeAllFromScene()
  }

  _createGui2D(scene: Scene, parent: Mesh, headerTxt: string): Mesh {
    const plane = MeshBuilder.CreatePlane('plane', { size: 4 }, scene)
    this.assetContainer.meshes.push(plane)

    plane.isPickable = false

    // https://forum.babylonjs.com/t/not-really-sure-how-to-use-billboardmode-use-position-properly/12477/4
    plane.rotation.y = Math.PI
    plane.bakeCurrentTransformIntoVertices()
    plane.billboardMode = Mesh.BILLBOARDMODE_Y | Mesh.BILLBOARDMODE_USE_POSITION

    plane.parent = parent
    // plane.position.x = -1.1
    plane.position.y = 1.25
    plane.position.z = -1.25

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane) as GUI.AdvancedDynamicTexture
    this.assetContainer.textures.push(advancedTexture)

    // if (advancedTexture.layer) advancedTexture.layer.layerMask = 2;

    const panel = new GUI.StackPanel()
    panel.isHighlighted = false
    //panel.isHitTestVisible = false
    const header = new GUI.TextBlock()
    header.text = headerTxt
    header.height = '100px'
    header.color = 'white'
    //header.textHorizontalAlignment = GUI.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = '50'
    panel.addControl(header)
    advancedTexture.addControl(panel)

    const keyboard = new GUI.VirtualKeyboard()
    keyboard.addKeysRow([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '\u2190',
    ])
    panel.addControl(keyboard)

    return plane
  }

  // _setupGui3D(scene: Scene) {
  //   const guiManager = new GUI.GUI3DManager(scene)
  //   guiManager.useRealisticScaling = true
  //   const panel = new GUI.StackPanel3D()
  //   guiManager.addControl(panel)
  //
  //   const button = new GUI.Button3D('click me')
  //   panel.addControl(button)
  // }

  _setupPick(scene: Scene) {
    this.pointerObv = scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case PointerEventTypes.POINTERMOVE: {
          this._highlight(pointerInfo)
        }
      }
      const pickInfo = pointerInfo.pickInfo
      if (pickInfo?.hit) {
        switch (pointerInfo.type) {
          case PointerEventTypes.POINTERDOWN: {
            //console.log('pointerDown', pickInfo.pickedMesh?.id)
            this._pick(pointerInfo)

            break
          }
        }
      }
    })
  }

  load() {
    super.load()

    const bgrndSkybox = this.scene.getMeshById('BackgroundSkybox')
    if (bgrndSkybox) {
      bgrndSkybox.isPickable = false
      bgrndSkybox.enablePointerMoveEvents = false
    }

    const bgrndPlane = this.scene.getMeshById('BackgroundPlane')
    if (bgrndPlane) {
      bgrndPlane.isPickable = false
      bgrndPlane.enablePointerMoveEvents = false
    }

    //console.log('envHelper', this.envHelper)
    //if (this.floorMesh) this.floorMesh.checkCollisions = true

    this._setupPick(this.scene)
  }

  unload() {
    if (this.pointerObv) {
      //this.scene.onPointerObservable.clear()
      this.scene.onPointerObservable.remove(this.pointerObv)
    }

    // if (this.highlightLayer) {
    //   this.highlightLayer.dispose()
    //   this.highlightLayer = undefined
    // }

    // if (this.highlightedGuiPanel) {
    //   this.highlightedGuiPanel.dispose()
    //   this.highlightedGuiPanel = undefined
    // }
    //
    // if (this.highlightedMesh) {
    //   this.highlightedMesh.dispose()
    //   this.highlightedMesh = undefined
    // }

    super.unload()
  }

  _highlight(pointerInfo: PointerInfo) {
    const pickResult = pointerInfo.pickInfo
    if (!pickResult?.hit) {
      if (this.highlightedMesh) {
        //Highlighted meshes become the parent of mesh they are highlighting, so
        //we remove instead
        this.highlightLayer?.removeMesh(this.highlightedMesh as Mesh)
        this.highlightedGuiPanel?.dispose()
        this.highlightedMesh.position.y = 1.0
        this.highlightedMesh = undefined
      }
    } else if (pickResult?.pickedMesh && this.highlightedMesh && this.highlightedMesh !== pickResult?.pickedMesh) {
      this.highlightLayer?.removeMesh(this.highlightedMesh as Mesh)
      this.highlightedGuiPanel?.dispose()
      this.highlightedMesh.position.y = 1.0
      this.highlightedMesh = undefined
    }

    if (pickResult?.pickedMesh && !this.highlightedMesh) {
      this.highlightLayer?.addMesh(pickResult.pickedMesh as Mesh, Color3.White())
      this.highlightedMesh = pickResult.pickedMesh
      this.highlightedGuiPanel = this._createGui2D(
        this.scene,
        pickResult.pickedMesh as Mesh,
        pickResult.pickedMesh.name,
      )
      this.highlightLayer?.addExcludedMesh(this.highlightedGuiPanel)
    }
  }

  _pick(pointerInfo: PointerInfo) {
    const pickResult = pointerInfo.pickInfo
    if (pickResult?.hit && pickResult?.pickedMesh) {
      pickResult.pickedMesh.position.y += 0.25
      //pickResult.pickedMesh.scaling = new Vector3(3, 1.1, 1.1)
    }
  }
}
