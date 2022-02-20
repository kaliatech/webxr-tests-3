
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { DefaultCollisionCoordinator } from '@babylonjs/core/Collisions/collisionCoordinator'
import { Engine } from '@babylonjs/core/Engines/engine.js'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Scene } from '@babylonjs/core/scene.js'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { DeviceSourceManager, HighlightLayer, PointerEventTypes, PointerInfo } from '@babylonjs/core'

import * as GUI from '@babylonjs/gui'

import '@babylonjs/core/Materials/Textures/Loaders'

import { GameScene } from '../GameScene.js'
import * as ColorMaterials from '../materials/ColorMaterials'


// Temporary:
import "@babylonjs/core/Debug/debugLayer"; // Augments the scene with the debug methods
import "@babylonjs/inspector"; // Injects a local ES6 version of the inspector to prevent automatically relying on the none compatible version

export class Scene002 extends GameScene {
  scene: Scene

  private envHelper: EnvironmentHelper | undefined

  private beforeRenderHandle = this.beforeRender.bind(this)

  private lastFpsLogTime = 0

  private elapsedTime = 0
  private mesh: Mesh | null = null

  private highlightLayer: HighlightLayer | undefined
  private highlightedGuiPanel: Mesh | undefined

  constructor(engine: Engine) {
    super(engine)
    this.scene = new Scene(engine)
    new DefaultCollisionCoordinator()
    const dm = new DeviceSourceManager(engine)
    this.init(this.scene)
  }

  get floorMesh(): Mesh | null | undefined {
    return this.envHelper?.ground
  }

  private init(scene: Scene) {
    // Add a camera for the 2D viewer
    const camera = new ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 3, 7, new Vector3(0, 1, 0), scene)
    // camera.lowerBetaLimit = -Math.PI / 2 + 0.1
    // camera.upperBetaLimit = Math.PI / 2 + -0.1
    camera.upperRadiusLimit = 20
    camera.panningDistanceLimit = 20
    camera.checkCollisions = true // prevent rotating through floor, redundant with the beta limits though
    camera.collisionRadius = new Vector3(1.5, 1.5, 1.5) // arbitrary for now
    camera.wheelPrecision = 25.0
    camera.attachControl(true)

    // Add a simple light
    const light = new HemisphericLight('light1', new Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    const sphereD = 1.0

    // Add three 1 unit spheres, X(R), Y(G), Z(B)
    const sphere = MeshBuilder.CreateSphere('xSphere', { segments: 32, diameter: sphereD }, scene)
    sphere.position.x = sphereD * -2
    sphere.position.y = sphereD
    sphere.material = ColorMaterials.red(scene)
    sphere.checkCollisions = true
    sphere.enablePointerMoveEvents = true

    this.mesh = sphere

    const sphere3 = sphere.clone('ySphere', null)
    sphere3.id = sphere3.name
    sphere3.position.x = 0
    sphere3.position.y = sphereD
    sphere3.material = ColorMaterials.green(scene)

    const sphere2 = sphere.clone('zSphere')
    sphere2.id = sphere2.name
    sphere2.position.x = sphereD * 2
    sphere2.position.y = sphereD
    sphere2.material = ColorMaterials.blue(scene)

    //const axesWidget = new AxesWidget(scene)
    //scene.addMesh(axesWidget.mesh)
    //scene.addTransformNode(axesWidget.mesh)

    this.envHelper = new EnvironmentHelper(
      {
        skyboxSize: 20,
        skyboxColor: new Color3(0, 0, 0),
        groundColor: new Color3(0.1, 0.1, 0.3),
        enableGroundMirror: true,
        createSkybox: true,
        groundSize: 20,
        groundMirrorSizeRatio: 0.5,
        groundOpacity: 1.0,
        groundMirrorBlurKernel: 32,
        //groundTexture: grndImg
      },
      scene,
    )

    const bgrndSkybox = scene.getMeshById('BackgroundSkybox')
    if (bgrndSkybox) {
      bgrndSkybox.isPickable = false
      bgrndSkybox.enablePointerMoveEvents = false
    }

    const bgrndPlane = scene.getMeshById('BackgroundPlane')
    if (bgrndPlane) {
      bgrndPlane.isPickable = false
      bgrndPlane.enablePointerMoveEvents = false
    }

    //console.log('envHelper', this.envHelper)
    if (this.floorMesh) this.floorMesh.checkCollisions = true

    this.scene = scene
    this.scene.debugLayer.show({embedMode:true})
    this._setupPick(scene)


    this.highlightLayer = new HighlightLayer('hl1', scene)

    scene.registerBeforeRender(this.beforeRenderHandle)
  }

  _createGui2D(scene: Scene, parent:Mesh, headerTxt: string): Mesh {
    const plane = MeshBuilder.CreatePlane('plane', { size: 4 }, scene)
    plane.parent = parent

    plane.isPickable = false
    plane.position = new Vector3(0, 2.0, -0.1)

    // https://forum.babylonjs.com/t/not-really-sure-how-to-use-billboardmode-use-position-properly/12477/4
    plane.rotation.y = Math.PI;
    plane.bakeCurrentTransformIntoVertices()
    plane.billboardMode = Mesh.BILLBOARDMODE_Y | Mesh.BILLBOARDMODE_USE_POSITION

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane) as GUI.AdvancedDynamicTexture

    // if (advancedTexture.layer) advancedTexture.layer.layerMask = 2;

    const panel = new GUI.StackPanel()
    panel.isHighlighted = false
    //panel.isHitTestVisible = false
    const header = new GUI.TextBlock()
    header.text = 'headerTxt'
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

  _setupGui3D(scene: Scene) {
    const guiManager = new GUI.GUI3DManager(scene)
    guiManager.useRealisticScaling = true
    const panel = new GUI.StackPanel3D()
    guiManager.addControl(panel)

    const button = new GUI.Button3D('click me')
    panel.addControl(button)
  }

  _setupPick(scene: Scene) {
    scene.onPointerObservable.add((pointerInfo) => {
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

  private highlightedMesh: AbstractMesh | undefined

  _highlight(pointerInfo: PointerInfo) {
    const pickResult = pointerInfo.pickInfo
    if (!pickResult?.hit) {
      if (this.highlightedMesh) {
        this.highlightLayer?.removeMesh(this.highlightedMesh as Mesh)
        this.highlightedGuiPanel.dispose()
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
      this.highlightedGuiPanel = this._createGui2D(this.scene, pickResult.pickedMesh, "Hover " + pickResult.pickedMesh.name)
      this.highlightLayer?.addExcludedMesh(this.highlightedGuiPanel)

    }
  }

  _pick(pointerInfo: PointerInfo) {
    const pickResult = pointerInfo.pickInfo
    if (pickResult?.hit && pickResult?.pickedMesh) {
      pickResult.pickedMesh.position.y += 0.25
      pickResult.pickedMesh.scaling = new Vector3(1.1, 1.1, 1.1)
    }
  }

  // destroy() {
  //   this.scene?.unregisterBeforeRender(this.beforeRenderHandle)
  // }

  beforeRender() {
    // console.log(this.scene)
    // console.log(this.scene?.getEngine())
    // console.log(this.scene?.getEngine().getDeltaTime())

    // TODO: TS way to do this
    if (!this.scene) {
      return
    }
    if (!this.scene.getEngine()) {
      return
    }

    const engine = this.scene.getEngine()
    const deltaMs = engine.getDeltaTime()
    this.elapsedTime += deltaMs

    if (this.elapsedTime - this.lastFpsLogTime > 5000) {
      console.log(engine.getFps().toFixed() + ' fps')
      this.lastFpsLogTime = this.elapsedTime
    }

    const startX = 0
    const endX = 5
    const timeMs = 5000
  }
}
