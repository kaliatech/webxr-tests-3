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

// This adds ~500k (100k gzipped) to build
//import * as GUI from '@babylonjs/gui'
// This adds about ~300k
import * as GUI from '@babylonjs/gui/2D'

import { LogicalScene } from '../LogicalScene.js'
import * as ColorMaterials from '../3d/materials/ColorMaterials'
import { AppManager } from '../AppManager'

export class Scene002PickingAndHighlights extends LogicalScene {
  private highlightLayer: HighlightLayer | undefined
  private highlightedGuiPanel: Mesh | undefined
  private highlightedMesh: AbstractMesh | undefined

  private pointerObv: Nullable<Observer<PointerInfo>> = null

  constructor(appManager: AppManager) {
    super(appManager)

    // Add a simple light
    const light = new HemisphericLight('light1b', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
    this.sceneAssetContainer.lights.push(light)

    const sphereD = 1.0

    // Add three 1 unit spheres, X(R), Y(G), Z(B)
    const sphere = MeshBuilder.CreateSphere('xSphere', { segments: 32, diameter: sphereD }, this.scene)
    sphere.position.x = sphereD * -2
    sphere.position.y = sphereD
    sphere.material = ColorMaterials.red(this.scene)
    sphere.checkCollisions = true
    sphere.enablePointerMoveEvents = true
    this.sceneAssetContainer.meshes.push(sphere)
    this.mirroredMeshes.push(sphere)

    const sphere3 = sphere.clone('ySphere', null)
    sphere3.id = sphere3.name
    sphere3.position.x = 0
    sphere3.position.y = sphereD
    sphere3.material = ColorMaterials.green(this.scene)
    this.sceneAssetContainer.meshes.push(sphere3)
    this.mirroredMeshes.push(sphere3)

    const sphere2 = sphere.clone('zSphere')
    sphere2.id = sphere2.name
    sphere2.position.x = sphereD * 2
    sphere2.position.y = sphereD
    sphere2.material = ColorMaterials.blue(this.scene)
    this.sceneAssetContainer.meshes.push(sphere2)
    this.mirroredMeshes.push(sphere2)
  }

  _createGui2D(scene: Scene, parent: Mesh, headerTxt: string): Mesh {
    const plane = MeshBuilder.CreatePlane('plane', { size: 4 }, scene)
    this.sceneAssetContainer.meshes.push(plane)

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
    this.sceneAssetContainer.textures.push(advancedTexture)

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

    //console.log('envHelper', this.envHelper)
    //if (this.floorMesh) this.floorMesh.checkCollisions = true

    this.highlightLayer = new HighlightLayer('hl1', this.scene)

    this._setupPick(this.scene)
  }

  unload() {
    if (this.pointerObv) {
      //this.scene.onPointerObservable.clear()
      this.scene.onPointerObservable.remove(this.pointerObv)
    }

    if (this.highlightLayer) {
      this.highlightLayer.dispose() // TODO: I think need to be careful with dispose. Maybe remove highlighted meshes?
      this.highlightLayer = undefined
    }

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
      if (this.sceneAssetContainer.meshes.indexOf(pickResult.pickedMesh) === -1) {
        return
      }

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
    if (
      pickResult?.hit &&
      pickResult?.pickedMesh &&
      this.sceneAssetContainer.meshes.indexOf(pickResult.pickedMesh) !== -1
    ) {
      pickResult.pickedMesh.position.y += 0.25
      //pickResult.pickedMesh.scaling = new Vector3(3, 1.1, 1.1)
    }
  }

  // beforeRender(): void {
  //   super.beforeRender()
  // }
}
