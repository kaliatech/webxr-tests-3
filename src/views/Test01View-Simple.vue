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
              <h1>Test 1 - Simple WebXR Scene</h1>
              A simple scene showing mirrored ground and basic animation.
            </div>
          </div>
          <div v-if="!data.xrChecked" class="row">
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

import type { XRSystem } from 'webxr'

import MainLayout from './layouts/MainLayout.vue'
import WebxrSupportCheck from '../components/WebxrSupportCheck.vue'

import { SceneManager } from '../js/SceneManager'
import { Scene001 } from '../js/scenes/Scene001'
import { EventBus } from 'ts-bus'

const renderCanvas = ref<HTMLCanvasElement | undefined>()
const appBus:EventBus = new EventBus()
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
  sceneManager = new SceneManager(renderCanvas.value, xrSystem, appBus, window)
  sceneManager.initWebXr().then(() => {
    if (sceneManager) {
      const scene = new Scene001(sceneManager.scene, appBus)
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
