<template>
  <main-layout>
    <div class="container">
      <div class="render-cont-outer">
        <div class="container">
          <div class="row">
            <div class="col">
              <h1>Test 3 - WebXR Scene Loading/Unloading</h1>
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
                    Unload Scene {{ idx + 1 }}
                  </button>
                </div>
              </div>
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
import { nextTick, onBeforeMount, onUnmounted, reactive, ref } from 'vue'
import { useTitle } from '@vueuse/core'

import MainLayout from './layouts/MainLayout.vue'
import WebxrSupportCheck from '../components/WebxrSupportCheck.vue'

import { AppManager } from '../js/AppManager'
import { Scene001Simple } from '../js/scenes/Scene001-Simple'
import { Scene002PickingAndHighlights } from '../js/scenes/Scene002-PickingAndHighlights'
import { Scene004PhotoAndVideos } from '../js/scenes/Scene004-PhotoAndVideos'
import { LogicalScene } from '../js/LogicalScene'
import { disposeDefaultEnvHelper } from '../js/3d/default-environment'

useTitle('Test 3 - WebXR | Kaliatech')

const renderCanvas = ref<HTMLCanvasElement | undefined>()
let appManager: AppManager | undefined

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
  appManager.init()
}

function unloadScene(sceneIdx: number) {
  if (!appManager) return

  if (data.scenesLoaded[sceneIdx] === true) {
    const scene = scenes[sceneIdx]
    if (scene) {
      appManager.unloadScene(scene)
    }
    data.scenesLoaded[sceneIdx] = false

    // Hack for this particular demo.
    // TODO: Refactor for the notion of a shared/global environments. Some scenes need, some do not.
    if (scene && data.scenesLoaded[0] === false && data.scenesLoaded[1] === false) {
      disposeDefaultEnvHelper(scene.scene)
    }
  }
}

function loadScene(sceneIdx: number) {
  if (!appManager) return

  let scene: Maybe<LogicalScene> = null

  if (scenes[sceneIdx] === undefined) {
    if (sceneIdx === 0) {
      scene = new Scene001Simple(appManager)
      scenes[sceneIdx] = scene
    } else if (sceneIdx === 1) {
      scene = new Scene002PickingAndHighlights(appManager)
      scenes[sceneIdx] = scene
    } else if (sceneIdx === 2) {
      scene = new Scene004PhotoAndVideos(appManager)
      scenes[sceneIdx] = scene
    }
  } else {
    scene = scenes[sceneIdx] as LogicalScene
  }
  if (scene) {
    appManager.loadScene(scene)
    data.scenesLoaded[sceneIdx] = true
  }
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
