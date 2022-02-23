<template>
  <div class="container">
    <div class="container-outer">
      <div class="container">
        <div class="row">
          <div class="col">
            <h1>Test 1 - Simple WebXR Scene</h1>
            A simplistic scene showing mirrored ground and basic animation.
          </div>
        </div>
      </div>
      <p v-if="!data.asyncChecksDone">Checking WebXR support...</p>
      <div v-show="data.asyncChecksDone" class="container-render mt-2">
        <p v-if="!data.isWebXrSupported">WebXR with immersive-vr sessions not supported by this browser.</p>
        <p v-if="data.errorMsg">Error: {{ data.errorMsg }}</p>
        <canvas v-else ref="renderCanvas" class="renderCanvas"></canvas>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'

import * as ErrorUtils from '../js/utils/ErrorUtils'
import * as WebXrUtils from '../js/utils/WebXrUtils'

import { GameEngine } from '../js/GameEngine'
import { Scene001 } from '../js/scene001/Scene001'

const renderCanvas = ref<HTMLCanvasElement | undefined>()
let gameEngine: GameEngine | undefined

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
    gameEngine = new GameEngine(renderCanvas.value, xrSystem, window)
    const scene1 = new Scene001(gameEngine.scene)

    gameEngine.initWebXr().then(() => {
      gameEngine?.loadScene(scene1)
    })
  } catch (e) {
    data.errorMsg = ErrorUtils.getErrorMessage(e)

    //eslint-disable-next-line no-console
    console.error(e)
  } finally {
    data.asyncChecksDone = true
  }
}

onUnmounted(() => {
  gameEngine?.dispose(window)
})
</script>
<style lang="scss">
@use '../styles/_variables' as vars;

.container-outer {
  align-content: center;
  //bottom: 1rem;
  display: flex;
  flex-direction: column;

  left: 1rem;
  position: absolute;
  right: 1rem;
  top: vars.$bootstrap-navbar-height;
  bottom: 1rem;
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
