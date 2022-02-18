import { Engine } from '@babylonjs/core/Engines/engine.js'
import { Scene } from '@babylonjs/core/scene.js'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper'

import { AxesViewer } from '@babylonjs/core/Debug/axesViewer'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Scalar } from '@babylonjs/core/Maths/math.scalar'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

import { DefaultCollisionCoordinator } from '@babylonjs/core/Collisions/collisionCoordinator'

import '@babylonjs/core/Materials/Textures/Loaders'
import * as ColorMaterials from '../materials/ColorMaterials'
import { GameScene } from '../GameScene.js'

export class Scene001 extends GameScene {
  scene: Scene

  private envHelper: EnvironmentHelper | undefined

  private beforeRenderHandle = this.beforeRender.bind(this)

  private lastFpsLogTime = 0

  private elapsedTime = 0
  private mesh: Mesh | null = null

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
    // Add axes viewer with 1 unit lengths
    new AxesViewer(scene, 1, 0)

    // Add a camera for the 2D viewer
    const camera = new ArcRotateCamera('Camera', -(Math.PI / 4) * 2.77, Math.PI / 3, 7, new Vector3(0, 1, 0), scene)
    camera.lowerBetaLimit = -Math.PI / 2 + 0.1
    camera.upperBetaLimit = Math.PI / 2 + -0.1
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
    const sphereR = sphereD / 2.0

    // Add three 1 unit spheres, X(R), Y(G), Z(B)
    const sphere = MeshBuilder.CreateSphere('xSphere', { segments: 16, diameter: sphereD }, scene)
    sphere.position.x = sphereD + sphereR
    sphere.position.y = sphereR
    sphere.position.z = 0
    sphere.material = ColorMaterials.red(scene)
    sphere.checkCollisions = true
    this.mesh = sphere

    const sphere3 = sphere.clone('ySphere', null)
    sphere3.position.x = 0
    sphere3.position.y = sphereD + sphereR
    sphere3.position.z = 0
    const gMat = new StandardMaterial('matB', scene)
    gMat.diffuseColor = new Color3(0, 1.0, 0)
    sphere3.checkCollisions = true
    sphere3.material = gMat

    const sphere2 = sphere.clone('zSphere')
    sphere2.position.x = 0
    sphere2.position.y = sphereR
    sphere2.position.z = sphereD + sphereR
    const bMat = new StandardMaterial('matG', scene)
    bMat.diffuseColor = new Color3(0, 0, 1.0)
    sphere2.material = bMat

    const aR = new AxesViewer(scene, 1, 0)
    aR.xAxis.parent = sphere
    aR.yAxis.parent = sphere
    aR.zAxis.parent = sphere

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
    //console.log('envHelper', this.envHelper)
    if (this.floorMesh) this.floorMesh.checkCollisions = true

    this.scene = scene

    scene.registerBeforeRender(this.beforeRenderHandle)
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

    if (this.mesh) {
      const dP = (this.elapsedTime % timeMs) / timeMs
      let x
      if (dP < 0.5) {
        x = Scalar.Lerp(startX, endX, dP)
      } else {
        x = Scalar.Lerp(endX, startX, dP)
      }
      this.mesh.position.x = x
    }
  }
}
