<template>
  <main-layout>
    <div class="container">
      <div class="render-cont-outer">
        <div class="container">
          <div class="row">
            <div class="col">
              <h1>Test 6 - PBR</h1>
              Test of physics based rendering using high fidelity GLTF models.
            </div>
          </div>
          <div class="row">
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
import { nextTick, onUnmounted, reactive, ref } from 'vue'
import { useTitle } from '@vueuse/core'

import MainLayout from './layouts/MainLayout.vue'
import WebxrSupportCheck from '../components/WebxrSupportCheck.vue'

import { AppManager } from '../js/AppManager'
import { Scene006Pbr } from '../js/scenes/Scene006-PBR'

useTitle('Test 6 - WebXR | Kaliatech')

const renderCanvas = ref<HTMLCanvasElement | undefined>()
let appManager: AppManager | undefined

const data = reactive({
  xrChecked: false,
})

function onWebXrChecked() {
  data.xrChecked = true

  // Use nextTick because at this point canvas size is still zero
  nextTick(() => {
    init()
  })
}

function init() {
  if (!renderCanvas.value) {
    return
  }
  appManager = new AppManager(renderCanvas.value, window)
  appManager.init().then(() => {
    if (appManager) {
      appManager.loadScene(new Scene006Pbr(appManager))
    }
  })
}

onUnmounted(() => {
  appManager?.dispose()
})
</script>
<!--
<style lang="scss">
@use '../styles/_variables' as vars;
</style>
-->
