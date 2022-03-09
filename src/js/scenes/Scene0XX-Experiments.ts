import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Scalar } from '@babylonjs/core/Maths/math.scalar'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

import { LogicalScene } from '../LogicalScene.js'
import { AppManager } from '../AppManager'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'

import { createTree } from '../external/TreeGenerator'
import { Tools } from '@babylonjs/core/Misc/tools'

export class Scene0XXExperiments extends LogicalScene {
  private readonly treeMat: StandardMaterial
  private readonly barkMat: StandardMaterial

  constructor(appManager: AppManager) {
    super(appManager)

    // Add a simple light
    const light = new HemisphericLight('lightA', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
    this.sceneAssetContainer.lights.push(light)

    if (this.scene.activeCamera instanceof ArcRotateCamera) {
      const arcCam = this.scene.activeCamera as ArcRotateCamera
      arcCam.position = new Vector3(0, 5, -20)
      arcCam.target = new Vector3(0, 4, 0)
    }

    //leaf material
    this.treeMat = new StandardMaterial('green', this.scene)
    this.treeMat.diffuseColor = new Color3(0, 1, 0)
    this.treeMat.emissiveColor = new Color3(0.1, 0.2, 0)

    //bark material
    this.barkMat = new StandardMaterial('bark', this.scene)
    this.barkMat.emissiveTexture = new Texture(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bark_texture_wood.jpg/800px-Bark_texture_wood.jpg',
      this.scene,
    )
    this.barkMat.diffuseTexture = new Texture(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bark_texture_wood.jpg/800px-Bark_texture_wood.jpg',
      this.scene,
    )
    // bark.diffuseTexture.uScale = 2.0;//Repeat 5 times on the Vertical Axes
    // bark.diffuseTexture.vScale = 2.0;//Repeat 5 times on the Horizontal Axes

    this._initTree(10, 100, Tools.ToRadians(45), new Vector3(0, 0, 0))
    //this._initTree(10, 2, Tools.ToRadians(25), new Vector3(5,0,5))

    // setInterval(() => {
    //   this.tree?.dispose()
    //   this._initTree()
    // }, 2000)
  }

  _initTree(trunk_height: number, branches: number, fork_angle: number, pos: Vector3) {
    //Tree parameters
    //const trunk_height = 10
    const trunk_taper = 0.525
    const trunk_slices = 5
    const boughs = 2 // 1 or 2
    const forks = 4
    //const fork_angle = Math.PI / 4
    const fork_ratio = 2.1 / (1 + Math.sqrt(5))
    const branch_angle = Tools.ToRadians(45)
    const bow_freq = 2
    const bow_height = 1.2
    //const branches = 10
    const leaves_on_branch = 4
    const leaf_wh_ratio = 0.475

    const tree1 = createTree(
      trunk_height,
      trunk_taper,
      trunk_slices,
      this.barkMat,
      boughs,
      forks,
      fork_angle,
      fork_ratio,
      branches,
      branch_angle,
      bow_freq,
      bow_height,
      leaves_on_branch,
      leaf_wh_ratio,
      this.treeMat,
      this.scene,
    )

    const fudge = 0.25 //TODO: Research why this is needed
    tree1.scaling = new Vector3(0.5, 0.5, 0.5)
    tree1.position.y = -tree1.getBoundingInfo().boundingBox.maximum.y / 2 + fudge
    tree1.position.z = pos.z
    tree1.position.x = pos.x
  }

  beforeRender(): void {
    super.beforeRender()

    const startX = 0.1
    const endX = 1.5

    if (!this.treeMat) {
      return
    }

    const timeGMs = 7004
    const dG = (this.elapsedTime % timeGMs) / timeGMs
    if (dG < 0.5) {
      this.treeMat.diffuseColor.g = Scalar.Lerp(startX, endX, dG)
    } else {
      this.treeMat.diffuseColor.g = Scalar.Lerp(endX, startX, dG)
    }
    this.treeMat.emissiveColor.g = this.treeMat.diffuseColor.toLinearSpace().g

    const timeBMs = 6753
    const dB = (this.elapsedTime % timeBMs) / timeBMs
    if (dB < 0.5) {
      this.treeMat.diffuseColor.b = Scalar.Lerp(startX, endX, dB)
    } else {
      this.treeMat.diffuseColor.b = Scalar.Lerp(endX, startX, dB)
    }
    this.treeMat.emissiveColor.b = this.treeMat.diffuseColor.toLinearSpace().b

    const timeRMs = 3700
    const dR = (this.elapsedTime % timeRMs) / timeRMs
    if (dR < 0.5) {
      this.treeMat.diffuseColor.r = Scalar.Lerp(startX, endX, dR)
    } else {
      this.treeMat.diffuseColor.r = Scalar.Lerp(endX, startX, dR)
    }
    this.treeMat.emissiveColor.r = this.treeMat.diffuseColor.toLinearSpace().r
  }
}
