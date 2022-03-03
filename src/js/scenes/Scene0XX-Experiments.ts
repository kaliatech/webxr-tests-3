import { Color3 } from '@babylonjs/core/Maths/math.color'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { Scalar } from '@babylonjs/core/Maths/math.scalar'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

import { LogicalScene } from '../LogicalScene.js'
import { AppManager } from '../AppManager'
import { Texture } from '@babylonjs/core/Materials/Textures/texture'

import { createTree } from '../external/TreeGenerator'

export class Scene0XXExperiments extends LogicalScene {
  private treeMat?: StandardMaterial

  constructor(appManager: AppManager) {
    super(appManager)

    // Add a simple light
    const light = new HemisphericLight('lightA', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
    this.sceneAssetContainer.lights.push(light)

    this._initTree()

    this.sceneAssetContainer.removeAllFromScene()
  }

  _initTree() {
    //leaf material
    this.treeMat = new StandardMaterial('green', this.scene)
    this.treeMat.diffuseColor = new Color3(0, 1, 0)
    this.treeMat.emissiveColor = new Color3(0.1, 0.2, 0)

    //trunk and branch material
    const bark = new StandardMaterial('bark', this.scene)
    bark.emissiveTexture = new Texture(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bark_texture_wood.jpg/800px-Bark_texture_wood.jpg',
      this.scene,
    )
    bark.diffuseTexture = new Texture(
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bark_texture_wood.jpg/800px-Bark_texture_wood.jpg',
      this.scene,
    )
    // bark.diffuseTexture.uScale = 2.0;//Repeat 5 times on the Vertical Axes
    // bark.diffuseTexture.vScale = 2.0;//Repeat 5 times on the Horizontal Axes

    //Tree parameters
    const trunk_height = 8
    const trunk_taper = 0.6
    const trunk_slices = 5
    const boughs = 2 // 1 or 2
    const forks = 4
    const fork_angle = Math.PI / 4
    const fork_ratio = 2 / (1 + Math.sqrt(5)) //PHI the golden ratio
    const branch_angle = Math.PI / 3
    const bow_freq = 2
    const bow_height = 3.5
    const branches = 10
    const leaves_on_branch = 5
    const leaf_wh_ratio = 0.5

    const tree = createTree(
      trunk_height,
      trunk_taper,
      trunk_slices,
      bark,
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
    tree.position.y = -trunk_height / 2
    tree.position.z = 0
  }

  beforeRender(): void {
    super.beforeRender()

    const startX = 0.1
    const endX = 1.0

    if (!this.treeMat) {
      return
    }

    const timeGMs = 10000
    const dG = (this.elapsedTime % timeGMs) / timeGMs
    if (dG < 0.5) {
      this.treeMat.diffuseColor.g = Scalar.Lerp(startX, endX, dG)
    } else {
      this.treeMat.diffuseColor.g = Scalar.Lerp(endX, startX, dG)
    }

    const timeBMs = 7500
    const dB = (this.elapsedTime % timeBMs) / timeBMs
    if (dB < 0.5) {
      this.treeMat.diffuseColor.b = Scalar.Lerp(startX, endX, dB)
    } else {
      this.treeMat.diffuseColor.b = Scalar.Lerp(endX, startX, dB)
    }

    const timeRMs = 9000
    const dR = (this.elapsedTime % timeRMs) / timeRMs
    if (dR < 0.5) {
      this.treeMat.diffuseColor.r = Scalar.Lerp(startX, endX, dR)
    } else {
      this.treeMat.diffuseColor.r = Scalar.Lerp(endX, startX, dR)
    }
  }
}
