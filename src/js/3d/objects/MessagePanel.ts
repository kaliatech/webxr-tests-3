import { GuiPanel } from './GuiPanel'
import * as GUI from '@babylonjs/gui/2D'
import { LogicalScene } from '../../LogicalScene'
import { white } from '../materials/ColorMaterials'
import { Color3 } from '@babylonjs/core/Maths/math.color'

export class MessagePanel extends GuiPanel {
  constructor(logicalScene: LogicalScene, name: string, protected msg: string) {
    super(logicalScene, name)
  }

  async init(): Promise<void> {
    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(this.guiPanel, 1024, 512) as GUI.AdvancedDynamicTexture
    this.guiPanelAssetContainer.textures.push(advancedTexture)

    const gridCont = new GUI.Grid()
    // gridCont.background = "white"
    // gridCont.alpha = 0.6

    //https://www.babylonjs-playground.com/#XCPP9Y#829

    const rect = new GUI.Rectangle();
    rect.width = 1;
    rect.height = 0.5;
    rect.background = "white";
    rect.color = '#333333'
    rect.thickness = 4
    rect.alpha = 0.7;
    rect.cornerRadius = 40
    gridCont.addControl(rect)

    const header = new GUI.TextBlock()
    header.text = 'Header Text'
    header.height = '200px'
    header.color = '#333333'
    //header.textHorizontalAlignment = GUI.HORIZONTAL_ALIGNMENT_CENTER;
    header.fontSize = '150'
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
