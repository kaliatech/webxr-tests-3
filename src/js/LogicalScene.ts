import { Scene } from '@babylonjs/core/scene'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { AssetContainer } from '@babylonjs/core/assetContainer'
import { Nullable } from '@babylonjs/core/types'
import { Observer } from '@babylonjs/core/Misc/observable'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper'
//import { EnvironmentHelper } from '../3d/utils/customEnvHelper'
import { initDefaultEnvHelper } from './3d/default-environment'
import { EventBus } from 'ts-bus'
import { controllersChanged } from './AppBusEvents'
import { Controllers } from '../types'

export abstract class LogicalScene {
  public assetContainer: AssetContainer
  protected beforeRenderObv: Nullable<Observer<Scene>> = null
  private controllerChangeUnsub: (() => void) | undefined

  protected mirroredMeshes: Mesh[] = []

  protected envHelper?: EnvironmentHelper

  protected elapsedTime = 0
  private lastFpsLogTime = 0

  private controllers?: Controllers

  protected constructor(protected scene: Scene, protected appBus: EventBus) {
    this.assetContainer = new AssetContainer(scene)
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

  load(controllers?: Controllers): void {
    this.assetContainer.addAllToScene()

    // Commented lines show alternate way to setup callbacks:
    //private beforeRenderHandle = this.beforeRender.bind(this)
    //scene.registerBeforeRender(this.beforeRenderHandle)
    this.beforeRenderObv = this.scene.onBeforeRenderObservable.add(() => this.beforeRender())

    // (Re)Create environment
    this.envHelper = initDefaultEnvHelper(this.scene)

    this.controllerChangeUnsub = this.appBus.subscribe(controllersChanged, (event) => {
      // const { controllers } = event.payload
      // console.log('leftController', event.payload.controllers.leftController)
      // console.log('rightController', event.payload.controllers.rightController)
      this.onControllersChange(event.payload.controllers)
    })

    if (controllers !== this.controllers) {
      this.onControllersChange(controllers)
    }
  }

  protected onControllersChange(controllers?: Controllers): void {
    this.controllers = controllers
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
    this.controllerChangeUnsub?.()

    if (this.beforeRenderObv) {
      this.scene.onBeforeRenderObservable.remove(this.beforeRenderObv)
      this.beforeRenderObv = null
    }
    this.assetContainer.removeAllFromScene()
    this.envHelper?.dispose()
  }

  dispose() {
    this.unload()
    this.assetContainer.dispose()
  }
}
