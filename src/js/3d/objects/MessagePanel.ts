import { GuiPanel } from './GuiPanel'
import * as GUI from '@babylonjs/gui/2D'
import { LogicalScene } from '../../LogicalScene'
import { white } from '../materials/ColorMaterials'
import { FollowBehavior } from '@babylonjs/core'
import { CameraChangedEvent } from '../../AppManagerEvents'

export class MessagePanel extends GuiPanel {

  private followBehavior: FollowBehavior
  private cameraUnsub: { (): void }

  constructor(logicalScene: LogicalScene, name: string, protected msg: string) {
    super(logicalScene, name)

    this.followBehavior = new FollowBehavior()
    this.followBehavior.lerpTime = 250
    this.followBehavior.ignoreCameraPitchAndRoll = true
    this.followBehavior.pitchOffset = 0
    this.followBehavior.defaultDistance = 2
    this.followBehavior.maximumDistance = 4
    this.followBehavior.orientToCameraDeadzoneDegrees = 30

    // Not required because follow camera uses scene.activeCamera by default. Might be important if
    // we need to support simultaneous XR and inline UIs though. ...though watching XR state is then probably better.
    this.cameraUnsub = logicalScene.appManager.appBus.subscribe(CameraChangedEvent, (evt) => {
      // this.followBehavior.followedCamera = evt.payload.camera
    })
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

    this.followBehavior.attach(this.guiPanel);


  }

  unload(): void {
    super.unload()

    this.followBehavior.detach()
  }

  dispose(): void {
    this.cameraUnsub()
    this.dispose()
  }
}
