import { IDisposable, Scene } from '@babylonjs/core/scene'
import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController'
import * as ColorMaterials from '../materials/ColorMaterials'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Mesh } from '@babylonjs/core/Meshes/mesh'

export class ControllerTrackingMenu implements IDisposable {
  private sphere?: Mesh

  constructor(private scene: Scene, private controller: WebXRAbstractMotionController) {
    this.sphere = MeshBuilder.CreateSphere('xSphere', { segments: 32, diameter: 0.2 }, scene)
    this.sphere.id = this.sphere.name
    // sphere2.position.x = sphereD * 2
    // sphere2.position.y = sphereD
    this.sphere.position.z = -0.231
    this.sphere.material = ColorMaterials.blue(scene)
    //this.assetContainer.meshes.push(sphere2)
    //this.mirroredMeshes.push(sphere2)
    this.sphere.parent = controller.rootMesh
  }

  dispose(): void {
    this.sphere?.dispose()
  }
}
