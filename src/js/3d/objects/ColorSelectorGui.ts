import { IDisposable, Scene } from '@babylonjs/core/scene'
import { AssetContainer } from '@babylonjs/core/assetContainer'
import * as GUI from '@babylonjs/gui/2D'

import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Mesh } from '@babylonjs/core/Meshes/mesh'

class ColorSelectorGui {

  protected loadRequested = false
  protected disposed = false

  private guiPanel:Mesh
  private assetContainer:AssetContainer

  constructor(private scene:Scene) {


    this.assetContainer = new AssetContainer(scene)

    this.guiPanel = MeshBuilder.CreatePlane('plane', { size: 0.4 }, scene)
    this.guiPanel.rotation.y = Math.PI
    this.guiPanel.bakeCurrentTransformIntoVertices()
    this.assetContainer.meshes.push(this.guiPanel)

    this.init()
  }

  async init(): Promise<void> {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(this.guiPanel) as GUI.AdvancedDynamicTexture

    // Load a GUI from the snippet server (testing purposes only)
    await advancedTexture.parseFromSnippetAsync('#MMWSUI#5')

    //advancedTexture.attachToMesh(plane)
    this.assetContainer.textures.push(advancedTexture)

    if(this.loadRequested) {
      this.load()
    }
    else {
      this.unload()
    }
  }

  load():void {
    this.loadRequested = true
    this.assetContainer.addAllToScene()
  }

  unload():void {
    this.loadRequested = false
    this.assetContainer.removeAllFromScene()

  }

  dispose(): void {
    this.unload()
    this.assetContainer.dispose()
    this.guiPanel?.dispose()
  }

}
