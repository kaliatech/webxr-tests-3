import { Scene } from '@babylonjs/core/scene'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { AssetContainer } from '@babylonjs/core/assetContainer'
import { Nullable } from '@babylonjs/core/types'
import { Observer } from '@babylonjs/core/Misc/observable'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper'
import { initDefaultEnvHelper } from './3d/default-environment'
import { EventBus } from 'ts-bus'
import { AppManager } from './AppManager'
import { LogicalSceneDisposingEvent, LogicalSceneLoadedEvent, LogicalSceneUnloadingEvent } from './LogicalSceneEvents'

export abstract class LogicalScene {
  public scene: Scene

  public sceneBus: EventBus
  public sceneAssetContainer: AssetContainer
  public sceneAssetContainerLoaded = true

  protected beforeRenderObv: Nullable<Observer<Scene>> = null

  protected appBusUnsubs: { (): void }[] = []

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
    if (!this.sceneAssetContainerLoaded) {
      this.sceneAssetContainer.addAllToScene()
      this.sceneAssetContainerLoaded = true
    }

    // Commented lines show alternate way to setup callbacks:
    //private beforeRenderHandle = this.beforeRender.bind(this)
    //scene.registerBeforeRender(this.beforeRenderHandle)
    this.beforeRenderObv = this.scene.onBeforeRenderObservable.add(() => this.beforeRender())

    // (Re)Create environment
    if (this.useGlobalEnvHelper) {
      this.envHelper = initDefaultEnvHelper(this.scene, this.useGlobalEnvHelper)
    }

    // this.appManager.appBus.subscribe(CameraChangedEvent, (event) => {
    //   this.onCameraChange(event.payload.camera)
    // })

    this.sceneBus.publish(LogicalSceneLoadedEvent({ logicalScene: this }))
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected beforeRender(): void {
    const engine = this.scene.getEngine()
    const deltaMs = engine.getDeltaTime()
    this.elapsedTime += deltaMs

    if (this.elapsedTime - this.lastFpsLogTime > 5000) {
      // eslint-disable-next-line no-console
      // console.log(engine.getFps().toFixed() + ' fps')
      this.lastFpsLogTime = this.elapsedTime
    }
  }

  unload(): void {
    this.sceneBus.publish(LogicalSceneUnloadingEvent({ logicalScene: this }))

    this.appBusUnsubs.forEach((unsub) => unsub())

    if (this.beforeRenderObv) {
      this.scene.onBeforeRenderObservable.remove(this.beforeRenderObv)
      this.beforeRenderObv = null
    }

    if (this.sceneAssetContainerLoaded) {
      this.sceneAssetContainer.removeAllFromScene()
      this.sceneAssetContainerLoaded = false
    }

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
