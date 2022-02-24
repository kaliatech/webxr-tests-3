<template>
  <main-layout>
    <div class="container">
      <div class="render-cont-outer">
        <div class="container">
          <div class="row">
            <div class="col">
              <h1>Test 3 - WebXR Scene Transitions</h1>
              <button
                class="btn btn-primary mr-2"
                :class="data.activeSceneNum === 1 ? 'btn-secondary' : ''"
                @click="loadScene(1)"
              >
                Load Scene 1
              </button>
              <button
                class="btn btn-primary m-2"
                :class="data.activeSceneNum === 2 ? 'btn-secondary' : ''"
                @click="loadScene(2)"
              >
                Load Scene 002
              </button>
              <button
                class="btn btn-primary m-2"
                :class="data.activeSceneNum === undefined ? 'btn-secondary' : ''"
                @click="unloadScene()"
              >
                Unload Active Scene
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
import { XRSystem } from 'webxr'

import MainLayout from './layouts/MainLayout.vue'
import WebxrSupportCheck from '../components/WebxrSupportCheck.vue'

import { SceneManager } from '../js/3d/SceneManager'
import { Scene002 } from '../js/scenes/Scene002'
import { Scene001 } from '../js/scenes/Scene001'
import { LogicalScene } from '../js/3d/LogicalScene'

const renderCanvas = ref<HTMLCanvasElement | undefined>()
let sceneManager: SceneManager | undefined

let scene1: Scene001 | undefined
let scene2: Scene002 | undefined
let activeScene: LogicalScene | undefined

const data = reactive({
  xrChecked: false,
  activeSceneNum: undefined as number | undefined,
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
      // scene1 = new Scene001(sceneManager.scene)
      // scene2 = new Scene002(sceneManager.scene)
      //sceneManager?.loadScene(scene1)
    }
  })
}

function unloadScene() {
  if (!sceneManager || !activeScene) return

  sceneManager.unloadScene(activeScene)
  activeScene = undefined
  data.activeSceneNum = undefined
}

function loadScene(sceneIdx: number) {
  if (!sceneManager) return

  if (sceneIdx === 1) {
    if (!scene1) {
      scene1 = new Scene001(sceneManager.scene)
    }
    activeScene = scene1
    data.activeSceneNum = 1
  } else if (sceneIdx === 2) {
    if (!scene2) {
      scene2 = new Scene002(sceneManager.scene)
    }
    activeScene = scene2
    data.activeSceneNum = 2
  }

  if (activeScene) {
    sceneManager.loadScene(activeScene)
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
