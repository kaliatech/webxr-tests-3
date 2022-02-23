<template>
  <main-layout>
    <div class="container">
      <div class="container-outer">
        <div class="container">
          <div class="row">
            <div class="col">
              <h1>Test 3 - WebXR Scene Transitions</h1>
              <button class="btn btn-primary" @click="loadScene(1)">Load Scene 001</button>
              <button class="btn btn-primary" @click="unloadScene(1)">Unload Scene 001</button>
              <button class="btn btn-primary" @click="loadScene(2)">Load Scene 002</button>
              <button class="btn btn-primary" @click="unloadScene(2)">Unload Scene 002</button>
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
  </main-layout>
</template>
<script lang="ts" setup>
import MainLayout from './layouts/MainLayout.vue'
import { onMounted, onUnmounted, reactive, ref } from 'vue'

import { Nullable } from '@babylonjs/core/types'

import * as ErrorUtils from '../js/utils/ErrorUtils'
import * as WebXrUtils from '../js/utils/WebXrUtils'

import { GameEngine } from '../js/GameEngine'
import { Scene002 } from '../js/scene001/Scene002'
import { GameScene } from '../js/GameScene'
import { Scene001 } from '../js/scene001/Scene001'
import { initDefaultCamera } from '../js/scene-shared/DefaultCamera'
import { initDefaultEnvHelper } from '../js/scene-shared/DefaultEnvironment'
import { EnvironmentHelper } from '@babylonjs/core/Helpers/environmentHelper'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'

const renderCanvas = ref<Nullable<HTMLCanvasElement>>(null)
let gameEngine: Nullable<GameEngine> = null
//
// let envHelper:EnvironmentHelper | undefined
// let camera:ArcRotateCamera | undefined

let scene1:Scene001 | undefined
let scene2:Scene002 | undefined
let activeScene:GameScene | undefined

// Reactive page data
const data = reactive({
  asyncChecksDone: false,
  errorMsg: '',
  isWebXrSupported: false,
})

onMounted(() => {
  initAsync()
})

function unloadScene(sceneIdx:number) {
  if (!gameEngine)
    return
  if (sceneIdx === 1) {
    gameEngine.unloadScene(scene1!)
  }
  else if(sceneIdx === 2) {
    gameEngine.unloadScene(scene2!)
  }
  activeScene = undefined
}

function loadScene(sceneIdx:number) {
  if (!gameEngine)
    return

  if (sceneIdx === 1) {
    if (!scene1) {
      scene1 = new Scene001(gameEngine.scene)
    }
    activeScene = scene1
  }
  else if (sceneIdx === 2) {
    if (!scene2) {
      scene2 = new Scene002(gameEngine.scene)
    }
    activeScene = scene2
  }

  if (activeScene) {
    gameEngine.loadScene(activeScene)
  }
}

async function initAsync() {
  try {
    const xrSystem = await WebXrUtils.checkXrSupport(window.navigator, 'immersive-vr')
    if (!renderCanvas.value) {
      throw new Error('Missing render canvas reference.')
    }
    data.isWebXrSupported = true
    gameEngine = new GameEngine(renderCanvas.value, xrSystem, window)

    //scene1 = new Scene001(gameEngine.scene, false)
    //scene2 = new Scene002(gameEngine.scene, false)

    // camera = initDefaultCamera(gameEngine.scene)
    // envHelper = initDefaultEnvHelper(gameEngine.scene)

    const gameScene = scene1


    //TODO: Instead of load scene, maybe should util method to create a default (non-webXR) camera

    gameEngine.initWebXr().then(() => {
      //initDefaultEnvHelper(gameEngine.scene)
      if (gameEngine) {
        //gameEngine.loadScene(gameScene)
        //initDefaultEnvHelper(gameEngine.scene)
      }
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
@use 'src/styles/variables' as vars;

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
