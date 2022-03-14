import { GuiPanel } from '../../3d/objects/GuiPanel'
import * as GUI from '@babylonjs/gui/2D'
import { Control } from '@babylonjs/gui/2D'

import { LogicalScene } from '../../LogicalScene'
import { FollowBehavior } from '@babylonjs/core/Behaviors/Meshes/followBehavior'
import { MediaItem } from './MediaData'
import { ControllersChangedEvent } from '../../AppManagerEvents'
import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController'
import { Nullable } from '@babylonjs/core/types'
import { Observer } from '@babylonjs/core/Misc/observable'
import { WebXRControllerComponent } from '@babylonjs/core/XR/motionController/webXRControllerComponent'
import { KeyboardEventTypes, KeyboardInfo } from '@babylonjs/core/Events/keyboardEvents'

export class MediaSelectorGui extends GuiPanel {
  private followBehavior: FollowBehavior

  private keyboardObv: Nullable<Observer<KeyboardInfo>> = null
  private rightControllerObv: Nullable<Observer<WebXRControllerComponent>> = null
  private leftControllerObv: Nullable<Observer<WebXRControllerComponent>> = null

  constructor(
    logicalScene: LogicalScene,
    name: string,
    protected mediaItems: MediaItem[],
    onClick: (btn: Control) => void,
  ) {
    super(logicalScene, name, 1.4, 1)

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

    // gridCont.background = "white"
    // gridCont.alpha = 0.6
    //https://www.babylonjs-playground.com/#XCPP9Y#829

    const gridCont = new GUI.Grid()
    gridCont.addColumnDefinition(1)
    this.mediaItems.forEach(() => {
      gridCont.addRowDefinition(0.5)
    })

    this.mediaItems.forEach((mediaItem, idx) => {
      this._addBtn(gridCont, pxHeight, mediaItem.id, mediaItem.title, idx, 0, onClick)
    })

    gridCont.addRowDefinition(0.5)
    this._addBtn(
      gridCont,
      pxHeight,
      'close-btn',
      'Close Menu (Press A or X to reopen)',
      this.mediaItems.length,
      0,
      () => {
        this.setEnabled(false)
        //this._onSceneUnloading()
      },
    )

    const appManager = this.logicalScene.appManager
    this.appBusSubs.push(
      appManager.appBus.subscribe(ControllersChangedEvent, (event) => {
        this._onControllersChange(event.payload.leftController, event.payload.rightController)
      }),
    )
    this._onControllersChange(appManager.leftController, appManager.rightController)

    this.keyboardObv = this.logicalScene.scene.onKeyboardObservable.add((kbInfo) => {
      switch (kbInfo.type) {
        case KeyboardEventTypes.KEYDOWN:
          if (
            kbInfo.event.key == 'a' ||
            kbInfo.event.key == 'x' ||
            kbInfo.event.key == 'X' ||
            kbInfo.event.key == 'A'
          ) {
            this._toggleActive()
          }
          break
      }
    })

    advancedTexture.addControl(gridCont)
  }

  _onControllersChange(
    leftController?: WebXRAbstractMotionController,
    rightController?: WebXRAbstractMotionController,
  ): void {
    if (leftController && !this.leftControllerObv) {
      //console.log('left', leftController.getComponentIds())
      const btn = leftController.getComponent('x-button')
      //console.log('x-button', btn)
      this.leftControllerObv = btn.onButtonStateChangedObservable.add(() => {
        if (btn.pressed) {
          this._toggleActive()
        }
      })
    } else if (!leftController && this.leftControllerObv) {
      this.leftControllerObv.unregisterOnNextCall = true
      this.leftControllerObv = null
    }

    if (rightController && !this.rightControllerObv) {
      const btn = rightController.getComponent('a-button')
      this.rightControllerObv = btn.onButtonStateChangedObservable.add(() => {
        if (btn.pressed) {
          this._toggleActive()
        }
      })
    } else if (!rightController && this.rightControllerObv) {
      this.rightControllerObv.unregisterOnNextCall = true
      this.rightControllerObv = null
    }
  }

  _toggleActive() {
    this.setEnabled(!this.isEnabled())
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
    btn.metadata = { idx: row }
    //const btn = GUI.Button.CreateSimpleButton("SimpleBtn", txt)
    btn.width = 1
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

    const fontSize = pxHeight / 16 + 'px'
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
