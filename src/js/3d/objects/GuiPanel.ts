import { AssetContainer } from '@babylonjs/core/assetContainer'

import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { LogicalScene } from '../../LogicalScene'

export abstract class GuiPanel extends TransformNode {
  protected loadRequested = false
  protected disposed = false

  protected guiPanel: Mesh
  protected guiPanelAssetContainer: AssetContainer

  protected constructor(
    protected logicalScene: LogicalScene,
    name = 'gui-panel',
    protected height = 0.4,
    protected width = 0.4,
  ) {
    super(name, logicalScene.scene, false)
    this.guiPanelAssetContainer = new AssetContainer(logicalScene.scene)

    this.guiPanel = MeshBuilder.CreatePlane('gui-pane', { height: height, width: width }, logicalScene.scene)
    //this.guiPanel.rotation.y = Math.PI
    //this.guiPanel.bakeCurrentTransformIntoVertices()
    this.guiPanel.position.y = 1.25
    this.guiPanel.position.z = -1.25
    this.guiPanel.setPositionWithLocalVector(logicalScene.appManager.camera.getFrontPosition(0.25))
    //this.guiPanel.lookAt(this.scene.getEngine().getC)

    this.guiPanelAssetContainer.meshes.push(this.guiPanel)
  }

  async init(): Promise<void> {
    this.postInit()
  }

  protected postInit(): void {
    if (this.loadRequested) {
      this.load()
    } else {
      this.unload()
    }
  }

  load(): void {
    this.loadRequested = true
    this.guiPanelAssetContainer.addAllToScene()
  }

  unload(): void {
    this.loadRequested = false
    this.guiPanelAssetContainer.removeAllFromScene()
  }

  dispose(): void {
    this.unload()
    this.guiPanelAssetContainer.dispose()
    this.guiPanel?.dispose()
  }
}
