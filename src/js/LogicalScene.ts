import { Scene } from '@babylonjs/core/scene'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { AssetContainer } from '@babylonjs/core/assetContainer'
import { Nullable } from '@babylonjs/core/types'
import { Observer } from '@babylonjs/core/Misc/observable'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper'
import { initDefaultEnvHelper } from './3d/default-environment'
import { EventBus } from 'ts-bus'
import { ControllersChangedEvent } from './AppManagerEvents'
import { AppManager } from './AppManager'
import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController'
import { LogicalSceneDisposingEvent, LogicalSceneUnloadingEvent } from './LogicalSceneEvents'

export abstract class LogicalScene {
  public scene: Scene

  public sceneBus: EventBus
  public sceneAssetContainer: AssetContainer

  protected beforeRenderObv: Nullable<Observer<Scene>> = null

  private appBusUnsubs: { (): void }[] = []

  protected mirroredMeshes: Mesh[] = []

  protected envHelper?: EnvironmentHelper

  protected elapsedTime = 0
  private lastFpsLogTime = 0

  protected constructor(public appManager: AppManager, private useGlobalEnvHelper = true) {
    this.scene = appManager.scene
    this.sceneBus = new EventBus()
    this.sceneAssetContainer = new AssetContainer(this.scene)
  }

  get floorMeshes(): Mesh[] {
    if (this.envHelper?.ground) {
      return [
        this.envHelper.ground,
      ]
    } else {
      return []
    }
  }

  load(): void {
    this.sceneAssetContainer.addAllToScene()

    // Commented lines show alternate way to setup callbacks:
    //private beforeRenderHandle = this.beforeRender.bind(this)
    //scene.registerBeforeRender(this.beforeRenderHandle)
    this.beforeRenderObv = this.scene.onBeforeRenderObservable.add(() => this.beforeRender())

    // (Re)Create environment
    if (this.useGlobalEnvHelper) {
      this.envHelper = initDefaultEnvHelper(this.scene, this.useGlobalEnvHelper)
    }

    this.appBusUnsubs.push(
      this.appManager.appBus.subscribe(ControllersChangedEvent, (event) => {
        this.onControllersChange(event.payload.leftController, event.payload.rightController)
      }),
    )
    this.onControllersChange(this.appManager.leftController, this.appManager.rightController)

    // this.appManager.appBus.subscribe(CameraChangedEvent, (event) => {
    //   this.onCameraChange(event.payload.camera)
    // })
  }

  /**
   * Will be called by scene.load and scene.unload.
   */
  onControllersChange(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    leftController?: WebXRAbstractMotionController,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    rightController?: WebXRAbstractMotionController,
  ): void {
    //this.controllers = controllers
    //console.log('onControllersChange', this.controllers)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected beforeRender(): void {
    const engine = this.scene.getEngine()
    const deltaMs = engine.getDeltaTime()
    this.elapsedTime += deltaMs

    if (this.elapsedTime - this.lastFpsLogTime > 5000) {
      // eslint-disable-next-line no-console
      console.log(engine.getFps().toFixed() + ' fps')
      this.lastFpsLogTime = this.elapsedTime
    }
  }

  unload(): void {
    this.sceneBus.publish(LogicalSceneUnloadingEvent({ logicalScene: this }))

    this.onControllersChange()

    this.appBusUnsubs.forEach((unsub) => unsub())

    if (this.beforeRenderObv) {
      this.scene.onBeforeRenderObservable.remove(this.beforeRenderObv)
      this.beforeRenderObv = null
    }

    this.sceneAssetContainer.removeAllFromScene()

    if (!this.useGlobalEnvHelper) {
      this.envHelper?.dispose()
    }
  }

  dispose() {
    this.unload()
    this.sceneBus.publish(LogicalSceneDisposingEvent({ logicalScene: this }))
    this.sceneAssetContainer.dispose()
  }
}
