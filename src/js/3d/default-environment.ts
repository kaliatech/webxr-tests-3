import { EnvironmentHelper, IEnvironmentHelperOptions } from '@babylonjs/core/Helpers/environmentHelper'
//import { EnvironmentHelper, IEnvironmentHelperOptions } from '../3d/utils/customEnvHelper'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { Scene } from '@babylonjs/core/scene.js'

export function initDefaultEnvHelper(scene: Scene): EnvironmentHelper {
  return new EnvironmentHelper(getDefaultEnvHelperOpts(), scene)
}

export function getDefaultEnvHelperOpts(): Partial<IEnvironmentHelperOptions> {
  return {
    skyboxSize: 20,
    skyboxColor: new Color3(0, 0, 0),
    groundColor: new Color3(0.01, 0.01, 0.2),
    // groundShadowLevel: 0.5,
    // enableGroundShadow: true,
    enableGroundMirror: true,
    createSkybox: true,
    groundSize: 20,
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
