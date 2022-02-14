<template>
  <div class="container-outer">
    <div class="container">
      <div class="row">
        <div class="col">This is a lot of text that could be above the render area.</div>
      </div>
    </div>
    <p v-if="!data.asyncChecksDone">Checking WebXR support...</p>
    <div v-show="data.asyncChecksDone" class="container-render">
      <p v-if="!data.isImmersiveVrSupported">WebXR with immersive-vr sessions not supported by this browser.</p>
      <p v-if="data.errorMsg">Error: {{ data.errorMsg }}</p>
      <canvas v-else ref="renderCanvas" class="renderCanvas"></canvas>
    </div>
  </div>
</template>
<script lang="ts" setup>
// Vue hooks, etc
import { onMounted, onUnmounted, reactive, ref } from 'vue'

// These are needed to workaround navigator.xr seemingly not being typed correctly in @types/webxr
import { Navigator as NavigatorXR, XRSystem } from 'webxr'
import { Engine } from '@babylonjs/core/Engines/engine.js'
import { TestScene001 } from '../js/TestScene001'

let xrSystem: XRSystem | null

// Vue 3 composition API handles refs in a very specific way
const renderCanvas = ref<HTMLCanvasElement | null>(null)

// Variable to store onResize event handler so we can explicitly remove it later
let onResize: EventListener | null = null

// Reactive page data
const data = reactive({
  asyncChecksDone: false,
  errorMsg: '',
  isWebXrSupported: false,
  isImmersiveVrSupported: false,
})

onMounted(() => {
  // Check that navigator.xr exists
  // Multiple ways to do this, and babylon has some built-in support to do it
  data.isWebXrSupported = 'xr' in window.navigator
  if (!data.isWebXrSupported) {
    data.asyncChecksDone = true
    return
  }

  // Check that immersive-vr is supported
  // Store xrSystem to workaround navigator.xr typing problems
  xrSystem = (navigator as unknown as NavigatorXR).xr
  xrSystem
    ?.isSessionSupported('immersive-vr')
    .then((result: boolean) => {
      if (result) {
        data.isImmersiveVrSupported = result
        init()
      }
    })
    .catch((reason: string) => {
      data.errorMsg = reason
      //eslint-disable-next-line no-console
      console.error(reason)
    })
    .finally(() => {
      data.asyncChecksDone = true
    })
})

onUnmounted(() => {
  if (onResize) {
    window.removeEventListener('resize', onResize)
  }
})

function init() {
  const test001 = new TestScene001(renderCanvas.value as HTMLCanvasElement)
  test001.setup().then((babylonEngine: Engine) => {
    onResize = () => {
      if (babylonEngine) {
        babylonEngine.resize()
      }
    }
    window.addEventListener('resize', onResize)
  })
}
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
  border: 1px solid red;
  min-height: 0; /* https://stackoverflow.com/questions/36247140/why-dont-flex-items-shrink-past-content-size */
  min-width: 0;
}

.renderCanvas {
  flex: 1;
  border: 1px solid black;
  min-height: 0;
  min-width: 0;
}
</style>
