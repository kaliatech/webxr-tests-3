import { GuiPanel } from './GuiPanel'
import * as GUI from '@babylonjs/gui/2D'
import { LogicalScene } from '../../LogicalScene'

export class MessagePanel extends GuiPanel {
  constructor(logicalScene: LogicalScene, name: string, protected msg: string) {
    super(logicalScene, name)
  }

  async init(): Promise<void> {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(this.guiPanel) as GUI.AdvancedDynamicTexture
    this.guiPanelAssetContainer.textures.push(advancedTexture)

    const gridCont = new GUI.Grid()

    const header = new GUI.TextBlock()
    header.text = 'Header Text'
    header.height = '100px'
    header.color = 'white'
    //header.textHorizontalAlignment = GUI.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = '50'
    gridCont.addControl(header)

    advancedTexture.addControl(gridCont)

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
    super.load()
  }

  unload(): void {
    super.unload()
  }

  dispose(): void {
    this.dispose()
  }
}
