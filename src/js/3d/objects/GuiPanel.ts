import { AssetContainer } from '@babylonjs/core/assetContainer'

import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { LogicalScene } from '../../LogicalScene'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Tools } from '@babylonjs/core/Misc/tools'

import { white } from '../materials/ColorMaterials'

export abstract class GuiPanel extends TransformNode {
  protected loadRequested = false
  protected disposed = false

  protected guiPanel: Mesh
  protected guiPanelAssetContainer: AssetContainer

  protected constructor(
    protected logicalScene: LogicalScene,
    name = 'gui-panel',
    protected height = .5,
    protected width = 1,
  ) {
    super(name, logicalScene.scene, false)
    this.guiPanelAssetContainer = new AssetContainer(logicalScene.scene)

    this.guiPanel = MeshBuilder.CreatePlane('gui-pane', { height: height, width: width,  }, logicalScene.scene)

    //this.guiPanel.rotation.y = Math.PI
    //this.guiPanel.bakeCurrentTransformIntoVertices()
    //console.log('camera', logicalScene.appManager.camera)
    this.guiPanel.position.x = logicalScene.appManager.camera.position.x
    this.guiPanel.position.y = logicalScene.appManager.camera.position.y
    this.guiPanel.position.z = logicalScene.appManager.camera.position.z + 1
    this.guiPanel.setAbsolutePosition(logicalScene.appManager.camera.getFrontPosition(1.5))
    this.guiPanel.lookAt(logicalScene.appManager.camera.position)
    this.guiPanel.rotate(Vector3.Up(), Tools.ToRadians(180))

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
