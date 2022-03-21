import { createEventDefinition } from 'ts-bus'

import { WebXRAbstractMotionController } from '@babylonjs/core/XR/motionController/webXRAbstractMotionController'
import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera'
import { WebXRState } from '@babylonjs/core/XR/webXRTypes'

export const WebXRStateChangedEvent = createEventDefinition<{
  state:WebXRState
}>()('xr.state')

export const ControllersChangedEvent = createEventDefinition<{
  leftController?: WebXRAbstractMotionController,
  rightController?: WebXRAbstractMotionController
}>()('controllers.changed')

export const CameraChangedEvent = createEventDefinition<{
  camera: TargetCamera
}>()('camera.changed')


