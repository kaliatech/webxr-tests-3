<template>
  <main-layout>
    <div class="container">
      <div class="render-cont-outer">
        <div class="container">
          <!--          <nav aria-label="breadcrumb">-->
          <!--            <ol class="breadcrumb mb-1">-->
          <!--              <li class="breadcrumb-item"><router-link to='/'>Home</router-link></li>-->
          <!--              <li class="breadcrumb-item active" aria-current="page">Test 1</li>-->
          <!--            </ol>-->
          <!--          </nav>-->
          <div class="row">
            <div class="col">
              <h1>Experiment 1 - Simple Tree Generation</h1>
              Simplistic tree generation using
              <a href="https://doc.babylonjs.com/extensions/treeGenerators/spsTreeGenerator">SPS Tree Generator</a>
              .
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
import { Scene0XXExperiments } from '../js/scenes/Scene0XX-Experiments'

useTitle('Trees Experiment - WebXR | Kaliatech')

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
      appManager.loadScene(new Scene0XXExperiments(appManager))
    }
  })
}

onUnmounted(() => {
  appManager?.dispose()
})
</script>
