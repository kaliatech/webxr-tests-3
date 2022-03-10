import { GuiPanel } from '../../3d/objects/GuiPanel'
import * as GUI from '@babylonjs/gui/2D'
import { Control } from '@babylonjs/gui/2D'

import { LogicalScene } from '../../LogicalScene'
import { FollowBehavior } from '@babylonjs/core/Behaviors/Meshes/followBehavior'
import { MediaItem } from './MediaData'

export class MediaSelectorGui extends GuiPanel {
  private followBehavior: FollowBehavior

  constructor(
    logicalScene: LogicalScene,
    name: string,
    protected mediaItems: MediaItem[],
    onClick: (btn: Control) => void,
  ) {
    super(logicalScene, name, 3.75, 1.4)

    this.guiPanel.position.z = logicalScene.appManager.camera.position.z + 3

    this.followBehavior = new FollowBehavior()
    this.followBehavior.lerpTime = 500

    this.followBehavior.ignoreCameraPitchAndRoll = true
    this.followBehavior.maxViewHorizontalDegrees = 0
    this.followBehavior.pitchOffset = 0
    this.followBehavior.defaultDistance = 3
    this.followBehavior.maximumDistance = 4
    this.followBehavior.orientToCameraDeadzoneDegrees = 0

    this._init(onClick)
  }

  _onSceneLoaded() {
    super._onSceneLoaded()
    this.followBehavior.attach(this.guiPanel)
  }

  _onSceneUnloading() {
    super._onSceneUnloading()
    this.followBehavior.detach()
  }

  private _init(onClick: (btn: Control) => void): void {
    const pxWidth = this.width * 1024
    const pxHeight = this.height * 1024

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(
      this.guiPanel,
      pxWidth,
      pxHeight,
    ) as GUI.AdvancedDynamicTexture
    this.guiPanelAssetContainer.textures.push(advancedTexture)

    const gridCont = new GUI.Grid()
    gridCont.addColumnDefinition(1)
    this.mediaItems.forEach(() => {
      gridCont.addRowDefinition(0.5)
    })

    // gridCont.background = "white"
    // gridCont.alpha = 0.6

    //https://www.babylonjs-playground.com/#XCPP9Y#829

    // this._addBtn(gridCont, pxHeight, 'photo1', 'Photo 1 (360° Mono)', 0, 0)
    // this._addBtn(gridCont, pxHeight, 'video1', 'Video 1 (360° Mono)', 1, 0)
    // this._addBtn(gridCont, pxHeight, 'video2', 'Video 2 (180° Stereo)', 2, 0)
    //
    this.mediaItems.forEach((mediaItem, idx) => {
      this._addBtn(gridCont, pxHeight, mediaItem.id, mediaItem.title, idx, 0, onClick)
    })

    advancedTexture.addControl(gridCont)
  }

  private _addBtn(
    cont: GUI.Grid,
    pxHeight: number,
    name: string,
    txt: string,
    row: number,
    col: number,
    onClick: (btn: Control) => void,
  ) {
    // const btnBg = new GUI.Rectangle()
    // btnBg.width = this.width
    // btnBg.background = 'rgba(255,255,255,0.7)'
    // btnBg.cornerRadius = 40
    // cont.addControl(btnBg, row, col)

    const btn = new GUI.Button(name)
    btn.metadata = {idx:row}
    //const btn = GUI.Button.CreateSimpleButton("SimpleBtn", txt)
    btn.width = 1
    console.log(this.width)
    // //rect.height =
    btn.background = ''
    btn.background = 'rgba(255,255,255,1)'
    btn.color = '#333333'
    btn.thickness = 4
    //btn.alpha = 0.7
    btn.cornerRadius = 20
    //btn.isHighlighted = true
    //btn.highlightLineWidth=20
    btn.paddingTop = '10px'
    cont.addControl(btn, row, col)

    const fontSize = pxHeight / 8 + 'px'
    const btnTxt = new GUI.TextBlock()
    btnTxt.text = txt
    //header.height = txtHeight
    //btnTxt.color = '#333333'
    btnTxt.color = 'black'
    btnTxt.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT
    btnTxt.paddingLeft = pxHeight / 10 // TODO
    btnTxt.fontSize = fontSize
    btn.addControl(btnTxt)

    btn.onPointerClickObservable.add(() => onClick(btn))
  }
}
