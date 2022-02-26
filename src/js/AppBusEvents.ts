import { createEventDefinition } from "ts-bus";
import type { Controllers } from '../types'

// export const controllersChanged = createEventDefinition<{
//   leftController: WebXRAbstractMotionController | undefined
//   rightController: WebXRAbstractMotionController | undefined
// }>()("controllers.changed");

export const controllersChanged = createEventDefinition<{
  controllers:Controllers
}>()("controllers.changed");

