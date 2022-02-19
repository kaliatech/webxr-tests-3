import { Engine } from '@babylonjs/core/Engines/engine.js'
import { Scene } from '@babylonjs/core/scene.js'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper'

import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'

import { DefaultCollisionCoordinator } from '@babylonjs/core/Collisions/collisionCoordinator'

import '@babylonjs/core/Materials/Textures/Loaders'
import * as ColorMaterials from '../materials/ColorMaterials'
import { GameScene } from '../GameScene.js'
import { AbstractMesh, HighlightLayer, PointerEventTypes, PointerInfo } from '@babylonjs/core'

export class Scene002 extends GameScene {
  scene: Scene

  private envHelper: EnvironmentHelper | undefined

  private beforeRenderHandle = this.beforeRender.bind(this)

  private lastFpsLogTime = 0

  private elapsedTime = 0
  private mesh: Mesh | null = null

  private highlightLayer: HighlightLayer | undefined

  constructor(engine: Engine) {
    super(engine)
    this.scene = new Scene(engine)
    new DefaultCollisionCoordinator()
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

    this.highlightLayer = new HighlightLayer('hl1', scene)

    this.scene = scene

    this._setupPick(scene)

    scene.registerBeforeRender(this.beforeRenderHandle)
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
        this.highlightedMesh.position.y = 1.0
        this.highlightedMesh = undefined
      }
    }
    else if (pickResult?.pickedMesh && this.highlightedMesh && this.highlightedMesh !== pickResult?.pickedMesh) {
      this.highlightLayer?.removeMesh(this.highlightedMesh as Mesh)
      this.highlightedMesh.position.y = 1.0
      this.highlightedMesh = undefined
    }

    if (pickResult?.pickedMesh && !this.highlightedMesh) {
      this.highlightLayer?.addMesh(pickResult.pickedMesh as Mesh, Color3.White())
      this.highlightedMesh = pickResult.pickedMesh
    }
  }

  _pick(pointerInfo: PointerInfo) {
    const pickResult = pointerInfo.pickInfo
    if (pickResult?.hit && pickResult?.pickedMesh) {
      pickResult.pickedMesh.position.y += 0.25
      pickResult.pickedMesh.scaling = new Vector3(1.1,1.1,1.1)
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
