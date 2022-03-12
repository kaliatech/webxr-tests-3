import { AxesViewer } from '@babylonjs/core/Debug/axesViewer'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'

import { LogicalScene } from '../LogicalScene.js'
import { AppManager } from '../AppManager'
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader'

export class Scene006Pbr extends LogicalScene {
  private xSphere: Mesh | null = null
  private axesViewer1: AxesViewer | undefined
  private axesViewer2: AxesViewer | undefined

  constructor(appManager: AppManager) {
    super(appManager)

    // Add a simple light
    const light = new HemisphericLight('lightA', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
    this.sceneAssetContainer.lights.push(light)

    // if (this.scene.activeCamera instanceof ArcRotateCamera) {
    //   const arcCam = this.scene.activeCamera as ArcRotateCamera
    //   arcCam.position = new Vector3(0, 5, 10)
    //   arcCam.target = new Vector3(0, 2, 0)
    // }

    //https://forum.babylonjs.com/t/texts-are-flipped-on-my-setup/13925/2
    // this.scene.useRightHandedSystem = true

    this._loadModels()

    //this.guiAssetContainer.moveAllFromScene()
    //this.sceneAssetContainer.removeAllFromScene()
  }

  _loadModels() {
    SceneLoader.LoadAssetContainerAsync(
      'https://www.babylonjs.com/Assets/FlightHelmet/glTF/',
      'FlightHelmet_Materials.gltf',
      this.scene,
    ).then((cont) => {
      cont.meshes.forEach((mesh) => {
        if (this.envHelper && this.envHelper.groundMirrorRenderList) {
          this.envHelper.groundMirrorRenderList.push(mesh)
        }
      })
      const rootMesh = cont.createRootMesh()
      rootMesh.position.x = -2
      rootMesh.scaling = new Vector3(0.08, 0.08, 0.08)
      rootMesh.rotation.y = Math.PI
      this.sceneAssetContainer.meshes.push(rootMesh) // TODO: would this work?
      cont.addAllToScene()
    })

    SceneLoader.LoadAssetContainerAsync('assets/BoomBox/', 'BoomBox.gltf', this.scene).then((cont) => {
      cont.meshes.forEach((mesh) => {
        if (this.envHelper && this.envHelper.groundMirrorRenderList) {
          this.envHelper.groundMirrorRenderList.push(mesh)
        }
      })
      const rootMesh = cont.createRootMesh()
      rootMesh.position.x = 2
      rootMesh.position.y = 0.75
      rootMesh.rotation.y = Math.PI
      rootMesh.scaling = new Vector3(80, 80, 80)
      this.sceneAssetContainer.meshes.push(rootMesh) // TODO: would this work?
      cont.addAllToScene()
    })

    //https://github.com/BabylonJS/CDN/blob/master/Demos/PBRGlossy/index.js
    SceneLoader.LoadAssetContainerAsync(
      'https://cdn.babylonjs.com/Assets/DamagedHelmet/glTF/',
      'DamagedHelmet.gltf',
      this.scene,
    ).then((cont) => {
      cont.meshes.forEach((mesh) => {
        if (this.envHelper && this.envHelper.groundMirrorRenderList) {
          this.envHelper.groundMirrorRenderList.push(mesh)
        }
      })
      const rootMesh = cont.createRootMesh()
      rootMesh.position.x = 0
      rootMesh.position.y = 1.75
      this.sceneAssetContainer.meshes.push(rootMesh) // TODO: would this work?
      cont.addAllToScene()
    })
  }

  load() {
    //this.envHelper.updateOptions(getDefaultEnvHelperOpts())
    super.load()

    // AxesViewer on the origin
    this.axesViewer1 = new AxesViewer(this.scene, 1, 0)

    // AxesViewer on the animated sphere
    this.axesViewer2 = new AxesViewer(this.scene, 1, 0)
    this.axesViewer2.xAxis.parent = this.xSphere
    this.axesViewer2.yAxis.parent = this.xSphere
    this.axesViewer2.zAxis.parent = this.xSphere
  }

  unload() {
    this.axesViewer1?.dispose()
    this.axesViewer2?.dispose()
    super.unload()
  }
}
