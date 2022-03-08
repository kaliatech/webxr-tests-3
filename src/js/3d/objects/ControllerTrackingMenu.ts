import { Scene } from '@babylonjs/core/scene'
import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import * as GUI from '@babylonjs/gui/2D'
import { Tools } from '@babylonjs/core/Misc/tools'
import { GuiPanel } from './GuiPanel'
import { LogicalScene } from '../../LogicalScene'
import { ControllersChangedEvent } from '../../AppManagerEvents'

export class ControllerTrackingMenu extends GuiPanel {
  constructor(logicalScene: LogicalScene, name: string, protected msg: string) {
    super(logicalScene, name, 0.3, 0.3)
    // this.sphere = MeshBuilder.CreateSphere('xSphere', { segments: 32, diameter: 0.2 }, scene)
    // this.sphere.id = this.sphere.name
    // // sphere2.position.x = sphereD * 2
    // // sphere2.position.y = sphereD
    // this.sphere.position.z = -0.231
    // this.sphere.material = ColorMaterials.blue(scene)
    // //this.guiAssetContainer.meshes.push(sphere2)
    // //this.mirroredMeshes.push(sphere2)
    // this.sphere.parent = controller.rootMesh

    const appManager = logicalScene.appManager

    //TODO: Potential timing issue due to the async (prob not needed after removing the remote snippet load)
    this.initGui(logicalScene.scene, this.guiPanel).then(() => {
      this._onControllersChange(appManager.leftController, appManager.rightController)
    })

    this.appBusSubs.push(
      appManager.appBus.subscribe(ControllersChangedEvent, (event) => {
        this._onControllersChange(event.payload.leftController, event.payload.rightController)
      }),
    )
  }

  _onSceneLoaded() {
    super._onSceneLoaded()
  }

  _onSceneUnloading() {
    this._onControllersChange()
    super._onSceneUnloading()
  }

  _onControllersChange(
    leftController?: WebXRAbstractMotionController,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rightController?: WebXRAbstractMotionController,
  ): void {
    if (!leftController) {
      this.setParent(null)
      if (this.guiPanelAssetContainerLoaded) {
        this.guiPanelAssetContainer.removeAllFromScene()
        this.guiPanelAssetContainerLoaded = false
      }
      return
    }

    // if (this.scene.activeCamera)
    //   this.guiRoot.lookAt(this.scene.activeCamera.position)

    if (!this.guiPanelAssetContainerLoaded) {
      this.guiPanelAssetContainer.addAllToScene()
      this.guiPanelAssetContainerLoaded = true
    }

    this.parent = leftController.rootMesh
    //this.setParent(leftController.rootMesh)

    this.rotation.x = Tools.ToRadians(-35)

    this.position.x = -0.01
    this.position.z = -0.1
    this.position.y = 0.175
  }

  private async initGui(scene: Scene, plane: Mesh) {
    plane.rotation.y = Math.PI
    plane.bakeCurrentTransformIntoVertices()

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane) as GUI.AdvancedDynamicTexture
    await advancedTexture.parseFromSnippetAsync('#MMWSUI#5')
    //advancedTexture.attachToMesh(plane)
    this.guiPanelAssetContainer.textures.push(advancedTexture)
  }
}
