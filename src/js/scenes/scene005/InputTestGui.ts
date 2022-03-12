import { GuiPanel } from '../../3d/objects/GuiPanel'
import * as GUI from '@babylonjs/gui/2D'
import { LogicalScene } from '../../LogicalScene'
import { FollowBehavior } from '@babylonjs/core/Behaviors/Meshes/followBehavior'

export class InputTestGui extends GuiPanel {
  private followBehavior: FollowBehavior

  constructor(logicalScene: LogicalScene, name: string, protected msg: string) {
    super(logicalScene, name, 1, 1)

    this.followBehavior = new FollowBehavior()
    this.followBehavior.lerpTime = 250
    this.followBehavior.ignoreCameraPitchAndRoll = true
    this.followBehavior.pitchOffset = 0
    this.followBehavior.defaultDistance = 2
    this.followBehavior.maximumDistance = 4
    this.followBehavior.orientToCameraDeadzoneDegrees = 30

    this._init()
  }

  _onSceneLoaded() {
    super._onSceneLoaded()
    this.followBehavior.attach(this.guiPanel)
  }

  _onSceneUnloading() {
    super._onSceneUnloading()
    this.followBehavior.detach()
  }

  private _init(): void {
    const pxWidth = this.width * 1024
    const pxHeight = this.height * 1024

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(
      this.guiPanel,
      pxWidth,
      pxHeight,
    ) as GUI.AdvancedDynamicTexture
    this.guiPanelAssetContainer.textures.push(advancedTexture)

    const rect = new GUI.Rectangle()
    rect.width = 1
    rect.height = 1
    rect.background = 'white'
    rect.color = '#333333'
    rect.thickness = 4
    rect.alpha = 0.7
    rect.cornerRadius = 40
    advancedTexture.addControl(rect)

    const gridCont = new GUI.Grid()
    gridCont.addColumnDefinition(1)
    gridCont.paddingLeft = '5%'
    gridCont.paddingRight = '5%'
    //gridCont.adaptHeightToChildren = true

    //https://www.babylonjs-playground.com/#XCPP9Y#829

    const header = new GUI.TextBlock()
    header.text = 'Input Test'
    header.height = '200px'
    header.width = 1
    header.color = 'black'
    header.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    header.fontSize = '150'
    gridCont.addRowDefinition(200, true)
    gridCont.addControl(header, 0, 0)

    const input = new GUI.InputText()
    input.height = '200px'
    input.color = 'white'
    input.fontSize = '150'
    input.thickness = 5
    input.width = 1
    input.text = ''
    gridCont.addRowDefinition(200, true)
    gridCont.addControl(input, 1, 0)

    //const kb = GUI.VirtualKeyboard.CreateDefaultLayout("test-input-keyboard")
    const kb = new GUI.VirtualKeyboard('test-input-keyboard')
    kb.fontSize = '65'
    kb.defaultButtonWidth = '75px'
    kb.defaultButtonHeight = '75px'
    // kb.defaultButtonPaddingLeft = "15px"
    // kb.defaultButtonPaddingRight = "15px"
    // kb.defaultButtonPaddingTop = "15px"
    // kb.defaultButtonPaddingBottom = "15px"
    kb.addKeysRow([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '0',
      '\u2190',
    ])
    kb.addKeysRow([
      'q',
      'w',
      'e',
      'r',
      't',
      'y',
      'u',
      'i',
      'o',
      'p',
    ])
    kb.addKeysRow([
      'a',
      's',
      'd',
      'f',
      'g',
      'h',
      'j',
      'k',
      'l',
      ';',
      "'",
      '\u21B5',
    ])
    kb.addKeysRow([
      '\u21E7',
      'z',
      'x',
      'c',
      'v',
      'b',
      'n',
      'm',
      ',',
      '.',
      '/',
    ])
    kb.addKeysRow(
      [
        ' ',
      ],
      [
        { width: '512px' },
      ],
    )
    kb.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    kb.connect(input)
    gridCont.addRowDefinition(400, true)
    gridCont.addControl(kb, 2, 0)
    //advancedTexture.addControl(kb)

    advancedTexture.addControl(gridCont)
  }
}
