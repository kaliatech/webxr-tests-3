import { createEventDefinition } from 'ts-bus'
import { LogicalScene } from './LogicalScene'

export const LogicalSceneUnloadingEvent = createEventDefinition<{logicalScene:LogicalScene}>()('logicalscene.unloading')

export const LogicalSceneDisposingEvent = createEventDefinition<{logicalScene:LogicalScene}>()('logicalscene.disposing')
