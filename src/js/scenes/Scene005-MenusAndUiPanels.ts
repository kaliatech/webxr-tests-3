import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'

import { LogicalScene } from '../LogicalScene.js'
import * as ColorMaterials from '../3d/materials/ColorMaterials'
import { AxesWidget } from '../3d/objects/AxesWidget'

import { AppManager } from '../AppManager'
import { ControllerTrackingMenu } from '../3d/objects/ControllerTrackingMenu'
import { InputTestGui } from './scene005/InputTestGui'

export class Scene005 extends LogicalScene {
  constructor(appManager: AppManager) {
    super(appManager)

    // Add a simple light
    const light = new HemisphericLight('light1b', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
    this.sceneAssetContainer.lights.push(light)

    const sphereD = 1.0

    // Add 1 unit sphere at origin
    const sphere = MeshBuilder.CreateSphere('originSphere', { segments: 32, diameter: sphereD }, this.scene)
    sphere.position.x = 1
    sphere.position.y = 1
    sphere.position.z = 1
    sphere.material = ColorMaterials.blue(this.scene)
    sphere.checkCollisions = true
    this.sceneAssetContainer.meshes.push(sphere)

    // Add 2 unit axes widget at origin
    const axesWidget = new AxesWidget(this.scene, 'axesWidget', 1)
    this.sceneAssetContainer.transformNodes.push(axesWidget.root)
    this.sceneAssetContainer.meshes.push(...axesWidget.root.getChildMeshes(false))

    this.initLargeDialogPanel()

    new ControllerTrackingMenu(this, "ControllerTrackingMenu", "Test")
  }

  initLargeDialogPanel() {
    new InputTestGui(this, 'Test005-Message-Panel', 'This is a test.')
  }
}
