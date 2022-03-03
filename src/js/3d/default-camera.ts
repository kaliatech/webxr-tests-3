import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Scene } from '@babylonjs/core/scene.js'
import { Tools } from '@babylonjs/core/Misc/tools'

export function initDefaultCamera(scene: Scene): ArcRotateCamera {
  // https://doc.babylonjs.com/divingDeeper/cameras/camera_introduction#arc-rotate-camera
  //alpha = rotation around Y (longitudinal rotation), 0 is in front, increases counterclockwise (right)
  //beta = rotation around Z (latitudinal rotation), 0 is straight up, increases clockwise (toward front)
  //radius = distance from target
  const alpha = Tools.ToRadians(-45.1)
  const beta = Tools.ToRadians(45.1)
  const camera = new ArcRotateCamera('DefaultCamera', alpha, beta, 10, new Vector3(0, 2, 0), scene)

  // But much easier to just set position and have alpha/beta calculated
  camera.setPosition(new Vector3(3, 3, -10))

  // camera.lowerBetaLimit = -Math.PI / 6 - 0.1
  // camera.upperBetaLimit = Math.PI + -0.1
  camera.lowerBetaLimit = Tools.ToRadians(-89)
  camera.upperBetaLimit = Tools.ToRadians(115)// past 90 allows us to look up with default camera
  camera.upperRadiusLimit = 20
  camera.panningDistanceLimit = 20
  camera.checkCollisions = true // prevent rotating through floor, can be redundant with the beta limits though
  camera.collisionRadius = new Vector3(1, 1, 1) // arbitrary for now
  camera.minZ = 0.1
  camera.wheelPrecision = 25.0
  camera.attachControl(true)
  return camera
}
