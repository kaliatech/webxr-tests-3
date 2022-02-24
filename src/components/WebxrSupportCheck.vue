<template>
  <p v-if="!data.asyncChecksDone">Checking WebXR support...</p>
  <div v-if="data.asyncChecksDone && !data.isWebXrSupported" class="mt-2">
    <div class="alert alert-danger" role="alert">
      <h4>Error</h4>
      <p>WebXR with immersive-vr sessions not supported by this browser.</p>
      <p>
        <strong>{{ data.errorMsg }}</strong>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue'

import type { XRSystem } from 'webxr'

import * as ErrorUtils from '../js/3d/utils/ErrorUtils'
import * as WebXrUtils from '../js/3d/utils/WebXrUtils'

const emit = defineEmits<{
  (e: 'webxrChecked', xrSystem: XRSystem | undefined, errorMsg: string | undefined): void
}>()

const props = defineProps({
  mode: {
    type: String,
    required: true,
    default: 'immersive-vr',
  },
})

const data = reactive({
  asyncChecksDone: false,
  errorMsg: '',
  isWebXrSupported: false,
})

onMounted(() => {
  initAsync()
})

async function initAsync() {
  let xrSystem: XRSystem | undefined
  let errorMsg: string | undefined

  try {
    xrSystem = await WebXrUtils.checkXrSupport(window.navigator, props.mode as XRSessionMode)
    data.isWebXrSupported = true
  } catch (e) {
    errorMsg = ErrorUtils.getErrorMessage(e)
    data.errorMsg = errorMsg

    //eslint-disable-next-line no-console
    console.error(e)
  } finally {
    data.asyncChecksDone = true
    emit('webxrChecked', xrSystem, errorMsg)
  }
}
</script>
