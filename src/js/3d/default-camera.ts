import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { Scene } from '@babylonjs/core/scene.js'

export function initDefaultCamera(scene:Scene) : ArcRotateCamera {
  const camera = new ArcRotateCamera('DefaultCamera', -(Math.PI / 4) * 2.77, Math.PI / 3, 7, new Vector3(0, 1, 0), scene)
  // camera.lowerBetaLimit = -Math.PI / 6 - 0.1
  // camera.upperBetaLimit = Math.PI + -0.1
  camera.lowerBetaLimit = -Math.PI / 2 + 0.1
  camera.upperBetaLimit = Math.PI / 2 + -0.1
  camera.upperRadiusLimit = 20
  camera.panningDistanceLimit = 20
  camera.checkCollisions = true // prevent rotating through floor, redundant with the beta limits though
  camera.collisionRadius = new Vector3(1.5, 1.5, 1.5) // arbitrary for now
  camera.wheelPrecision = 25.0
  camera.attachControl(true)
  return camera
}
