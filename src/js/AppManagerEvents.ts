import { createEventDefinition } from 'ts-bus'

// export const controllersChanged = createEventDefinition<{
//   leftController: WebXRAbstractMotionController | undefined
//   rightController: WebXRAbstractMotionController | undefined
// }>()("controllers.changed");

import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController'
import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera'

// export const XRStateEvent = createEventDefinition<{
// }>()('xr.state')

export const ControllersChangedEvent = createEventDefinition<{
  leftController?: WebXRAbstractMotionController,
  rightController?: WebXRAbstractMotionController
}>()('controllers.changed')

export const CameraChangedEvent = createEventDefinition<{
  camera: TargetCamera
}>()('camera.changed')


