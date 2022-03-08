import { AssetContainer } from '@babylonjs/core/assetContainer'

import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { LogicalScene } from '../../LogicalScene'
import {
  LogicalSceneDisposingEvent,
  LogicalSceneLoadedEvent,
  LogicalSceneUnloadingEvent,
} from '../../LogicalSceneEvents'

export abstract class GuiPanel extends TransformNode {
  protected appBusSubs: { (): void }[] = []
  protected sceneBusSubs: { (): void }[] = []

  protected guiPanel: Mesh
  protected guiPanelAssetContainer: AssetContainer
  protected guiPanelAssetContainerLoaded = true

  protected constructor(
    protected logicalScene: LogicalScene,
    name = 'gui-panel',
    protected width = 1,
    protected height = 0.5,
  ) {
    super(name, logicalScene.scene, false)

    this.guiPanelAssetContainer = new AssetContainer(logicalScene.scene)
    this.guiPanelAssetContainer.transformNodes.push(this)

    this.guiPanel = MeshBuilder.CreatePlane('gui-pane', { width: width, height: height }, logicalScene.scene)
    this.guiPanel.parent = this
    this.guiPanelAssetContainer.meshes.push(this.guiPanel)
    // this.guiPanelAssetContainer.meshes.push(...this.guiPanel.getChildMeshes())
    //this.getChildMeshes().forEach(mesh => this.guiPanelAssetContainer.meshes.push(mesh))

    //this.guiPanel.rotation.y = Math.PI
    //this.guiPanel.bakeCurrentTransformIntoVertices()
    //console.log('camera', logicalScene.appManager.camera)
    // this.guiPanel.position.x = logicalScene.appManager.camera.position.x
    // this.guiPanel.position.y = logicalScene.appManager.camera.position.y
    // this.guiPanel.position.z = logicalScene.appManager.camera.position.z + 1
    // this.guiPanel.setAbsolutePosition(logicalScene.appManager.camera.getFrontPosition(1.5))
    // this.guiPanel.lookAt(logicalScene.appManager.camera.position)
    // this.guiPanel.rotate(Vector3.Up(), Tools.ToRadians(180))

    // Not required because follow camera uses scene.activeCamera by default. Might be important if
    // we need to support simultaneous XR and inline UIs though. ...though watching XR state is then probably better.
    // private cameraUnsub: { (): void }
    // this.cameraUnsub = logicalScene.appManager.appBus.subscribe(CameraChangedEvent, (evt) => {
    //   this.followBehavior.followedCamera = evt.payload.camera
    // })
    this.sceneBusSubs.push(
      this.logicalScene.sceneBus.subscribe(LogicalSceneLoadedEvent, () => {
        this._onSceneLoaded()
      }),
    )
    this.sceneBusSubs.push(
      this.logicalScene.sceneBus.subscribe(LogicalSceneUnloadingEvent, () => {
        this._onSceneUnloading()
      }),
    )
    this.sceneBusSubs.push(
      this.logicalScene.sceneBus.subscribe(LogicalSceneDisposingEvent, () => {
        this._onSceneDisposing()
      }),
    )

    //this.guiPanelAssetContainer.removeAllFromScene()
  }

  _onSceneLoaded() {
    if (!this.guiPanelAssetContainerLoaded) {
      this.guiPanelAssetContainer.addAllToScene()
      this.guiPanelAssetContainerLoaded = true
    }
  }

  _onSceneUnloading() {
    if (this.guiPanelAssetContainerLoaded) {
      this.guiPanelAssetContainer.removeAllFromScene()
      this.guiPanelAssetContainerLoaded = false
    }
  }

  _onSceneDisposing() {
    this.guiPanelAssetContainer.dispose()
    this.guiPanel?.dispose()
    this.sceneBusSubs.forEach((unsub) => unsub())
    this.appBusSubs.forEach((unsub) => unsub())
  }
}
