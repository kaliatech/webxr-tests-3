import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene.js'
import { Mesh } from '@babylonjs/core/Meshes/mesh'

export abstract class GameScene {
  abstract scene: Scene | null

  abstract get floorMesh(): Mesh | null | undefined

  protected constructor(protected engine: Engine) {}
}
