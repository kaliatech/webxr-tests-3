<template>
  <main-layout>
    <div class="container">
      <div class="render-cont-outer">
        <div class="container">
          <div class="row">
            <div class="col">
              <h1>Test 3 - WebXR Scene Transitions</h1>
              <div class="d-flex">
                <div
                  v-for="(loaded, idx) in data.scenesLoaded"
                  :key="`scene-${idx}`"
                  class="d-flex flex-column"
                  style="width: 10rem">
                  <button
                    class="btn m-1"
                    :class="data.scenesLoaded[idx] === false ? 'btn-primary' : 'disabled'"
                    @click="loadScene(idx)">
                    Load Scene {{ idx + 1 }}
                  </button>
                  <button
                    class="btn m-1"
                    :class="data.scenesLoaded[idx] === true ? 'btn-secondary' : 'disabled'"
                    @click="unloadScene(idx)">
                    Upload Scene {{ idx + 1 }}
                  </button>
                </div>
              </div>
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
import { onBeforeMount, onUnmounted, reactive, ref } from 'vue'

import MainLayout from './layouts/MainLayout.vue'
import WebxrSupportCheck from '../components/WebxrSupportCheck.vue'

import type { XRSystem } from 'webxr'

import { SceneManager } from '../js/SceneManager'
import { Scene001 } from '../js/scenes/Scene001'
import { Scene002 } from '../js/scenes/Scene002'
import { Scene004 } from '../js/scenes/Scene004'
import { LogicalScene } from '../js/LogicalScene'
import { EventBus } from 'ts-bus'

const renderCanvas = ref<HTMLCanvasElement | undefined>()
const appBus: EventBus = new EventBus()
let sceneManager: SceneManager | undefined

// lazy loaded scenes
const scenes = new Array<LogicalScene | undefined>()

const data = reactive({
  xrChecked: false,
  scenesLoaded: [] as boolean[],
})

onBeforeMount(() => {
  let numScenes = 3
  for (let i = 0; i < numScenes; i++) {
    data.scenesLoaded.push(false)
  }
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
    // if (sceneManager) {
    // scene1 = new Scene001(sceneManager.scene)
    // scene2 = new Scene002(sceneManager.scene)
    //sceneManager?.loadScene(scene1)
    // }
  })
}

function unloadScene(sceneIdx: number) {
  if (!sceneManager) return

  if (data.scenesLoaded[sceneIdx] === true) {
    const scene = scenes[sceneIdx]
    if (scene) {
      sceneManager.unloadScene(scene)
    }
    data.scenesLoaded[sceneIdx] = false
  }
}

function loadScene(sceneIdx: number) {
  if (!sceneManager) return

  let scene: Maybe<LogicalScene> = null

  if (scenes[sceneIdx] === undefined) {
    if (sceneIdx === 0) {
      scene = new Scene001(sceneManager.scene, appBus)
      scenes[sceneIdx] = scene
    } else if (sceneIdx === 1) {
      scene = new Scene002(sceneManager.scene, appBus)
      scenes[sceneIdx] = scene
    } else if (sceneIdx === 2) {
      scene = new Scene004(sceneManager.scene, appBus)
      scenes[sceneIdx] = scene
    }
  } else {
    scene = scenes[sceneIdx] as LogicalScene
  }
  if (scene) {
    sceneManager.loadScene(scene)
    data.scenesLoaded[sceneIdx] = true
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
