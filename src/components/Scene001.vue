<template>
  <div class="container-outer">
    <div class="container">
      <div class="row">
        <div class="col">This is a lot of text that could be above the render area.</div>
      </div>
    </div>
    <p v-if="!data.asyncChecksDone">Checking WebXR support...</p>
    <div v-show="data.asyncChecksDone" class="container-render">
      <p v-if="!data.isWebXrSupported">WebXR with immersive-vr sessions not supported by this browser.</p>
      <p v-if="data.errorMsg">Error: {{ data.errorMsg }}</p>
      <canvas v-else ref="renderCanvas" class="renderCanvas"></canvas>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'

import { Nullable } from '@babylonjs/core'

import * as ErrorUtils from '../js/utils/ErrorUtils'
import * as WebXrUtils from '../js/utils/WebXrUtils'

import { GameManager } from '../js/GameManager'

const renderCanvas = ref<Nullable<HTMLCanvasElement>>(null)
let appManager: Nullable<GameManager> = null

// Reactive page data
const data = reactive({
  asyncChecksDone: false,
  errorMsg: '',
  isWebXrSupported: false,
})

onMounted(() => {
  initAsync()
})

async function initAsync() {
  try {
    const xrSystem = await WebXrUtils.checkXrSupport(window.navigator, 'immersive-vr')
    if (!renderCanvas.value) {
      throw new Error('Missing render canvas reference.')
    }
    data.isWebXrSupported = true
    appManager = new GameManager(renderCanvas.value, xrSystem)
    appManager.init(window)
  } catch (e) {
    data.errorMsg = ErrorUtils.getErrorMessage(e)

    //eslint-disable-next-line no-console
    console.error(e)

  } finally {
    data.asyncChecksDone = true
  }
}

onUnmounted(() => {
  appManager?.onDestroy(window)
})
</script>
<style lang="scss">
@use '../styles/_variables' as vars;

.container-outer {
  align-content: center;
  bottom: 1rem;
  display: flex;
  flex-direction: column;
  left: 1rem;
  position: absolute;
  right: 1rem;
  top: vars.$bootstrap-navbar-height;
}

.container-render {
  display: flex;
  flex: 1;
  //border: 1px solid red;
  min-height: 0; /* https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size */
  min-width: 0;
}

.renderCanvas {
  flex: 1;
  //border: 1px solid black;
  min-height: 0;
  min-width: 0;
}
</style>
