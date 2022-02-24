<template>
  <main-layout>
    <div class="container">
      <div class="render-cont-outer">
        <div class="container">
          <div class="row">
            <div class="col">
              <h1>Test 4 - WebXR Immersive Video</h1>
              Immersive video quality tests. 360&deg; mono, 180&deg; mono, & 180&deg; stereo.
            </div>
          </div>
          <div v-if='!data.xrChecked' class="row">
            <div class="col">
              <webxr-support-check mode="immersive-vr" @webxr-checked="onWebXrChecked" />
            </div>
          </div>
        </div>
        <canvas v-show="data.xrChecked" ref="renderCanvas" class="render-canvas mt-3"></canvas>
      </div>
    </div>
  </main-layout>
</template>
<script setup lang="ts">
import { onUnmounted, reactive, ref } from 'vue'

import MainLayout from './layouts/MainLayout.vue'
import WebxrSupportCheck from '../components/WebxrSupportCheck.vue'

import type { XRSystem } from 'webxr'

import { SceneManager } from '../js/3d/SceneManager'
import { Scene004 } from '../js/scenes/Scene004'

const renderCanvas = ref<HTMLCanvasElement | undefined>()
let sceneManager: SceneManager | undefined

const data = reactive({
  xrChecked: false,
})

function onWebXrChecked(xrSystem: XRSystem | undefined) {
  if (xrSystem) {
    data.xrChecked = true
    init(xrSystem)
  }
}

function init(xrSystem: XRSystem) {
  if (!xrSystem || !renderCanvas.value) {
    return
  }
  sceneManager = new SceneManager(renderCanvas.value, xrSystem, window)
  sceneManager.initWebXr().then(() => {
    if (sceneManager) {
      const scene = new Scene004(sceneManager.scene)
      sceneManager?.loadScene(scene)
    }
  })
}

onUnmounted(() => {
  sceneManager?.dispose(window)
})

</script>
<!--
<style lang="scss">
@use '../styles/_variables' as vars;
</style>
-->
