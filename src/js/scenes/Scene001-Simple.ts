import { Color3 } from '@babylonjs/core/Maths/math.color'

import { AxesViewer } from '@babylonjs/core/Debug/axesViewer'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Scalar } from '@babylonjs/core/Maths/math.scalar'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

import * as ColorMaterials from '../3d/materials/ColorMaterials'

import { LogicalScene } from '../LogicalScene.js'
import { AxesWidget } from '../3d/objects/AxesWidget'
import { AppManager } from '../AppManager'

export class Scene001Simple extends LogicalScene {
  private xSphere: Mesh | null = null
  private axesViewer1: AxesViewer | undefined
  private axesViewer2: AxesViewer | undefined

  constructor(appManager: AppManager) {
    super(appManager)

    // Add a simple light
    const light = new HemisphericLight('lightA', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
    this.sceneAssetContainer.lights.push(light)

    const sphereD = 1.0
    const sphereR = sphereD / 2.0

    // Add three 1 unit spheres, X(R), Y(G), Z(B)
    this.xSphere = MeshBuilder.CreateSphere('xSphere', { segments: 16, diameter: sphereD }, this.scene)
    this.xSphere.position.x = sphereD + sphereR
    this.xSphere.position.y = sphereR
    this.xSphere.position.z = 0
    this.xSphere.material = ColorMaterials.red(this.scene)
    this.xSphere.checkCollisions = true
    this.mirroredMeshes.push(this.xSphere)
    this.sceneAssetContainer.meshes.push(this.xSphere)

    const sphere3 = this.xSphere.clone('ySphere', null)
    const axesWidget = new AxesWidget(this.scene, 'ySphereAxisWidget', 1)
    axesWidget.root.parent = sphere3
    this.sceneAssetContainer.transformNodes.push(axesWidget.root)
    this.sceneAssetContainer.meshes.push(...axesWidget.root.getChildMeshes(false))

    sphere3.position.x = 0
    sphere3.position.y = sphereD + sphereR
    sphere3.position.z = 0
    const gMat = new StandardMaterial('matB', this.scene)
    gMat.alpha = 0.7
    gMat.diffuseColor = new Color3(0, 1.0, 0)
    this.mirroredMeshes.push(sphere3)
    sphere3.material = gMat
    this.sceneAssetContainer.meshes.push(sphere3)

    const sphere2 = this.xSphere.clone('zSphere')
    sphere2.position.x = 0
    sphere2.position.y = sphereR
    sphere2.position.z = sphereD + sphereR
    const bMat = new StandardMaterial('matG', this.scene)
    bMat.diffuseColor = new Color3(0, 0, 1.0)
    this.mirroredMeshes.push(sphere2)
    sphere2.material = bMat
    this.sceneAssetContainer.meshes.push(sphere2)

    // const aR = new AxesViewer(scene, 1, 0)
    // aR.xAxis.parent = sphere
    // aR.yAxis.parent = sphere
    // aR.zAxis.parent = sphere
    // this.guiAssetContainer.transformNodes.push(aR.xAxis, aR.yAxis, aR.zAxis)

    // if (initEnvHelper) {
    //   this.envHelper = initDefaultEnvHelper(scene)
    //   //appendKeepAssets(scene, this.envHelper, this.guiAssetContainer)
    // }

    // This would work and not require that we keep track of everything manually,
    // but then either requires:
    //   (1) - we init all scenes before the WebXR experience is initialized, or
    //   (2) - we build up a KeepAssets of all the things the WebXR experience creates, the default camera, etc.
    //this.guiAssetContainer.moveAllFromScene()
    //this.sceneAssetContainer.removeAllFromScene()
  }

  load() {
    //this.envHelper.updateOptions(getDefaultEnvHelperOpts())
    super.load()

    // AxesViewer on the origin
    this.axesViewer1 = new AxesViewer(this.scene, 1, 0)

    // AxesViewer on the animated sphere
    this.axesViewer2 = new AxesViewer(this.scene, 1, 0)
    this.axesViewer2.xAxis.parent = this.xSphere
    this.axesViewer2.yAxis.parent = this.xSphere
    this.axesViewer2.zAxis.parent = this.xSphere
  }

  unload() {
    this.axesViewer1?.dispose()
    this.axesViewer2?.dispose()
    super.unload()
  }

  beforeRender(): void {
    super.beforeRender()

    const startX = 0
    const endX = 5
    const timeMs = 5000

    if (this.xSphere) {
      const dP = (this.elapsedTime % timeMs) / timeMs
      let x
      if (dP < 0.5) {
        x = Scalar.Lerp(startX, endX, dP)
      } else {
        x = Scalar.Lerp(endX, startX, dP)
      }
      this.xSphere.position.x = x
    }
  }
}
