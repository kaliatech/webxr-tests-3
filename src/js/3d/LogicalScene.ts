import { Scene } from '@babylonjs/core/scene'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { AssetContainer } from '@babylonjs/core/assetContainer'
import { Nullable } from '@babylonjs/core/types'
import { Observer } from '@babylonjs/core/Misc/observable'
//import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper'
import { EnvironmentHelper } from '../3d/utils/customEnvHelper'
import { initDefaultEnvHelper } from './default-environment'

export abstract class LogicalScene {
  public assetContainer: AssetContainer
  protected beforeRenderObv: Nullable<Observer<Scene>> = null

  protected mirroredMeshes: Mesh[] = []

  protected envHelper: EnvironmentHelper | undefined

  protected elapsedTime = 0
  private lastFpsLogTime = 0

  protected constructor(protected scene: Scene) {
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

  load(): void {
    this.assetContainer.addAllToScene()

    // Commented lines show alternate way to setup callbacks:
    //private beforeRenderHandle = this.beforeRender.bind(this)
    //scene.registerBeforeRender(this.beforeRenderHandle)
    this.beforeRenderObv = this.scene.onBeforeRenderObservable.add(() => this.beforeRender())

    // (Re)Create environment
    this.envHelper = initDefaultEnvHelper(this.scene)
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
