import { Engine } from '@babylonjs/core/Engines/engine.js'
import { Scene } from '@babylonjs/core/scene.js'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { GameScene } from '../GameScene.js'
import { AxesViewer } from '@babylonjs/core/Debug/axesViewer'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

// Used only for the scene createDefaultEnvironment
import '@babylonjs/core/Helpers/sceneHelpers'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { EnvironmentHelper, Nullable } from '@babylonjs/core'

export class Scene001 extends GameScene {
  private scene: Nullable<Scene> = null
  private envHelper: Nullable<EnvironmentHelper> = null

  constructor(engine: Engine) {
    super(engine)
  }

  get floorMesh(): Nullable<Mesh> {
    return this.envHelper?.ground as Nullable<Mesh>
  }

  get babylonScene(): Nullable<Scene> {
    return this.scene
  }

  init() {
    const scene = new Scene(this.engine)

    this.envHelper = scene.createDefaultEnvironment({
      skyboxSize: 30,
      groundColor: new Color3(0.5, 0.5, 0.5),
    })

    // Add axes viewer with 1 unit lengths
    new AxesViewer(scene, 1)

    // Add a camera for the 2D viewer
    const camera = new ArcRotateCamera('Camera', -(Math.PI / 4) * 3, Math.PI / 4, 10, new Vector3(0, 0, 0), scene)
    camera.attachControl(true)

    // Add a simple light
    const light = new HemisphericLight('light1', new Vector3(0, 2, 0), scene)
    light.intensity = 0.7

    const sphereD = 1.0
    const sphereR = sphereD / 2.0

    // Add three 1 unit spheres, X(R), Y(G), Z(B)
    const sphere = MeshBuilder.CreateSphere('xSphere', { segments: 16, diameter: sphereD }, scene)
    sphere.position.x = sphereD + sphereR
    sphere.position.y = sphereR
    sphere.position.z = 0
    const rMat = new StandardMaterial('matR', scene)
    rMat.diffuseColor = new Color3(1.0, 0, 0)
    sphere.material = rMat

    const sphere3 = sphere.clone('ySphere', null)
    sphere3.position.x = 0
    sphere3.position.y = sphereD + sphereR
    sphere3.position.z = 0
    const gMat = new StandardMaterial('matB', scene)
    gMat.diffuseColor = new Color3(0, 1.0, 0)
    sphere3.material = gMat

    const sphere2 = sphere.clone('zSphere')
    sphere2.position.x = 0
    sphere2.position.y = sphereR
    sphere2.position.z = sphereD + sphereR
    const bMat = new StandardMaterial('matG', scene)
    bMat.diffuseColor = new Color3(0, 0, 1.0)
    sphere2.material = bMat

    this.scene = scene
  }
}
