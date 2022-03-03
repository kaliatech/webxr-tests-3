import { IDisposable, Scene } from '@babylonjs/core/scene'
import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import * as GUI from '@babylonjs/gui/2D'
import { AssetContainer } from '@babylonjs/core/assetContainer'
import { Tools } from '@babylonjs/core/Misc/tools'

export class ControllerTrackingMenu implements IDisposable {
  private guiRoot: Mesh
  private assetContainer: AssetContainer = new AssetContainer()

  constructor(private scene: Scene) {
    // this.sphere = MeshBuilder.CreateSphere('xSphere', { segments: 32, diameter: 0.2 }, scene)
    // this.sphere.id = this.sphere.name
    // // sphere2.position.x = sphereD * 2
    // // sphere2.position.y = sphereD
    // this.sphere.position.z = -0.231
    // this.sphere.material = ColorMaterials.blue(scene)
    // //this.guiAssetContainer.meshes.push(sphere2)
    // //this.mirroredMeshes.push(sphere2)
    // this.sphere.parent = controller.rootMesh

    this.guiRoot = MeshBuilder.CreatePlane('plane', { size: 0.4 }, scene)
    this.assetContainer.meshes.push(this.guiRoot)

    //TODO: Potential timing issue due to the async (prob not needed after removing the remote snippet load)
    this.initGui(this.scene, this.guiRoot)
  }

  load(controller: WebXRAbstractMotionController) {
    this.assetContainer.addAllToScene()
    this.guiRoot.parent = controller.rootMesh
    // if (this.scene.activeCamera)
    //   this.guiRoot.lookAt(this.scene.activeCamera.position)
    this.guiRoot.position.z = 0
    this.guiRoot.position.y = 0

    this.guiRoot.rotation.x = Tools.ToRadians(-35)
    //this.guiRoot.rotation.y = Tools.ToRadians(-10)

    this.guiRoot.position.z = -0.15
    this.guiRoot.position.y = 0.175
  }

  unload() {
    //console.log('ControllerTrackingMenu.unload')
    this.guiRoot.parent = null
    this.assetContainer.removeAllFromScene()
  }

  private async initGui(scene: Scene, plane: Mesh) {
    plane.rotation.y = Math.PI
    plane.bakeCurrentTransformIntoVertices()

    //plane.rotation.x = Math.PI / 3

    const advancedTexture = GUI.AdvancedDynamicTexture.CreateForMesh(plane) as GUI.AdvancedDynamicTexture
    await advancedTexture.parseFromSnippetAsync('#MMWSUI#5')
    //advancedTexture.attachToMesh(plane)
    this.assetContainer.textures.push(advancedTexture)

    // Load a GUI from the snippet server.

    //let advancedTexture = new GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI", true, scene);

    // Set the ideal W and H if you wish to scale with the window.
    // advancedTexture.idealWidth = 1024;
    // advancedTexture.idealHeight = 1024;
  }

  dispose(): void {
    //this.guiRoot?.getChildren().forEach((node) => node.dispose())
    this.guiRoot?.dispose()
  }
}
