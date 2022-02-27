<template>
  <main-layout>
    <div class="container">
      <div class="render-cont-outer">
        <div class="container">
          <div class="row">
            <div class="col">
              <h1>Test 3 - WebXR Scene Transitions</h1>
              <button
                class="btn mr-2"
                :class="data.scene1 === undefined ? 'btn-primary' : 'disabled'"
                @click="loadScene(1)">
                Load Scene 1
              </button>
              <button
                class="btn m-2"
                :class="data.scene1 !== undefined ? 'btn-secondary' : 'disabled'"
                @click="unloadScene(data.scene1 as LogicalScene)">
                Unload Scene 1
              </button>
              <button
                class="btn m-2"
                :class="data.scene2 === undefined ? 'btn-primary' : 'disabled'"
                @click="loadScene(2)">
                Load Scene 2
              </button>
              <button
                class="btn m-2"
                :class="data.scene2 !== undefined ? 'btn-secondary' : 'disabled'"
                @click="unloadScene(data.scene2 as LogicalScene)">
                Unload Scene 2
              </button>
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

import MainLayout from './layouts/MainLayout.vue'
import WebxrSupportCheck from '../components/WebxrSupportCheck.vue'

import type { XRSystem } from 'webxr'

import { SceneManager } from '../js/SceneManager'
import { Scene002 } from '../js/scenes/Scene002'
import { Scene001 } from '../js/scenes/Scene001'
import { LogicalScene } from '../js/LogicalScene'
import { EventBus } from 'ts-bus'

const renderCanvas = ref<HTMLCanvasElement | undefined>()
const appBus: EventBus = new EventBus()
let sceneManager: SceneManager | undefined

let scene1: Scene001 | undefined
let scene2: Scene002 | undefined

const data = reactive({
  xrChecked: false,
  scene1: undefined as LogicalScene | undefined,
  scene2: undefined as LogicalScene | undefined,
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
      // scene1 = new Scene001(sceneManager.scene)
      // scene2 = new Scene002(sceneManager.scene)
      //sceneManager?.loadScene(scene1)
    }
  })
}

function unloadScene(scene?: LogicalScene) {
  if (!sceneManager) return

  if (scene === data.scene1) {
    data.scene1 = undefined
  } else if (scene === data.scene2) {
    data.scene2 = undefined
  }

  if (scene) {
    sceneManager.unloadScene(scene)
  }
}

function loadScene(sceneIdx: number) {
  if (!sceneManager) return

  if (sceneIdx === 1) {
    if (!scene1) {
      scene1 = new Scene001(sceneManager.scene, appBus)
    }
    data.scene1 = scene1
    sceneManager.loadScene(scene1)
  } else if (sceneIdx === 2) {
    if (!scene2) {
      scene2 = new Scene002(sceneManager.scene, appBus)
    }
    data.scene2 = scene2
    sceneManager.loadScene(scene2)
  }
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
