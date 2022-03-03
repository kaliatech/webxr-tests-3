import { EnvironmentHelper, IEnvironmentHelperOptions } from '@babylonjs/core/Helpers/environmentHelper'
//import { EnvironmentHelper, IEnvironmentHelperOptions } from '../3d/utils/customEnvHelper'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { Scene } from '@babylonjs/core/scene.js'

const globalEnvHelpers: { [key: string] : EnvironmentHelper } = {}

export function disposeDefaultEnvHelper(scene: Scene) {
  const envHelper = globalEnvHelpers[scene.uid]
  if (envHelper) {
    envHelper.dispose()
    delete globalEnvHelpers[scene.uid]
  }
}

export function initDefaultEnvHelper(scene: Scene, global:boolean): EnvironmentHelper {
  if (!global) {
    return new EnvironmentHelper(getDefaultEnvHelperOpts(), scene)
  }

  let envHelper = globalEnvHelpers[scene.uid]
  if (!envHelper) {
    envHelper = new EnvironmentHelper(getDefaultEnvHelperOpts(), scene)

    const bgrndSkybox = scene.getMeshById('BackgroundSkybox')
    if (bgrndSkybox) {
      bgrndSkybox.isPickable = false
      bgrndSkybox.enablePointerMoveEvents = false
    }

    const bgrndPlane = scene.getMeshById('BackgroundPlane')
    if (bgrndPlane) {
      bgrndPlane.isPickable = false
      bgrndPlane.enablePointerMoveEvents = false
    }

    if (envHelper.ground) {
      envHelper.ground.checkCollisions = true
    }

    globalEnvHelpers[scene.uid] = envHelper
  }
  return envHelper
}

export function getDefaultEnvHelperOpts(): Partial<IEnvironmentHelperOptions> {
  return {
    sizeAuto:false,
    skyboxSize: 42,
    skyboxColor: new Color3(0, 0, 0),
    groundColor: new Color3(0.01, 0.01, 0.2),
    // groundShadowLevel: 0.5,
    // enableGroundShadow: true,
    enableGroundMirror: true,
    createSkybox: true,
    groundSize: 42,
    //groundMirrorSizeRatio: 0.3,
    groundOpacity: 1.0,
    groundMirrorBlurKernel: 64,
    setupImageProcessing: true,
    // cameraExposure: 0.8,
    // cameraContrast: 1.5,
    //groundTexture: grndImg
  }
}

// export function appendKeepAssets(scene:Scene, envHelper:EnvironmentHelper, assetCont:AssetContainer) {
//     if (envHelper.skybox) {
//       assetCont.meshes.push(envHelper.skybox)
//     }
//     if (envHelper.skyboxMaterial) {
//       assetCont.materials.push(envHelper.skyboxMaterial)
//     }
//     if (envHelper.skyboxTexture) {
//       assetCont.textures.push(envHelper.skyboxTexture)
//     }
//
//     if (envHelper.ground) {
//       assetCont.meshes.push(envHelper.ground)
//     }
//     if (envHelper.groundMaterial) {
//       assetCont.materials.push(envHelper.groundMaterial)
//     }
//     if (envHelper.groundMirror) {
//       assetCont.textures.push(envHelper.groundMirror)
//     }
//     if (envHelper.groundTexture) {
//       assetCont.textures.push(envHelper.groundTexture)
//     }
//
//     // let mesh = scene.getMeshByName('BackgroundPlane')
//     // if (mesh) assetCont.meshes.push(mesh)
//     //
//     // mesh = scene.getMeshByName('BackgroundHelper')
//     // if (mesh) assetCont.meshes.push(mesh)
//     //
//     // mesh = scene.getMeshByName('BackgroundSkybox')
//     // if (mesh) assetCont.meshes.push(mesh)
// }
