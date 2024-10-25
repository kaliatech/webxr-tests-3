<template>
  <home-layout>
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-10 col-xl-8">
          <h2>WebXR Tests</h2>
          <p>Tests using Babylon.js 5, Vite, Vue3, Bootstrap 5, and TypeScript.</p>

          <p>
            While most of the functionality works across all browsers and devices, including Safari/iOS, these demos are
            primarily meant to be viewed within a VR headset. Testing was done with a Meta Quest 2.
          </p>

          <h3>Purpose</h3>
          <p>Test and verify WebXR functionality using Babylon.js 5. Key features tested:</p>

          <ul>
            <li>High fidelity controller models</li>
            <li>Teleport functionality (use right joystick)</li>
            <li>Multiple scene loading/unloading</li>
            <li>Basic UI and input functionality</li>
            <li>360° and 180° photos and videos</li>
            <li>PBR Materials</li>
            <li>Etc</li>
          </ul>

          <h3>Tests</h3>
          <ul>
            <li>
              <a href="test1">Test 1</a>
              - Simple XR Setup
            </li>
            <li>
              <a href="test2">Test 2</a>
              - Picking & Highlight Layers
            </li>
            <li>
              <a href="test3">Test 3</a>
              - Scene Loading/Unloading
            </li>
            <li>
              <a href="test4">Test 4</a>
              - Photo & Video (non-layer)
            </li>
            <li>
              <a href="test5">Test 5</a>
              - Menus & UIs (non-layer)
            </li>
            <li>
              <a href="test6">Test 6</a>
              - PBR Materials and Models
            </li>
          </ul>

          <h3>Experiments</h3>
          <ul>
            <li>
              <a href="experiment1">Experiment 1</a>
              - Trees
            </li>
          </ul>

          <h3>Screenshots</h3>

          <figure class="figure">
            <img
              class="img-fluid rounded-3"
              alt="Screenshot - Browser view in Quest 2"
              src="/docs/i/scrshot-010-simple.jpg" />
            <figcaption class="figure-caption text-center">Browsers all the way down</figcaption>
          </figure>

          <figure class="figure">
            <img class="img-fluid rounded-3" alt="Screenshot - Simple Scene" src="/docs/i/scrshot-020-works.jpg" />
            <figcaption class="figure-caption text-center">
              Not the most exiting demo, but it
              <em>does</em>
              work
            </figcaption>
          </figure>

          <figure class="figure">
            <img class="img-fluid rounded-3" alt="Screenshot - UI and Input in VR" src="/docs/i/scrshot-030-ui.jpg" />
            <figcaption class="figure-caption text-center">2D UI in VR</figcaption>
          </figure>

          <figure class="figure">
            <img class="img-fluid rounded-3" alt="Screenshot - 360 Photo" src="/docs/i/scrshot-040-photo.jpg" />
            <figcaption class="figure-caption text-center">Immersive photos and videos</figcaption>
          </figure>

          <figure class="figure">
            <img
              class="img-fluid rounded-3"
              alt="Screenshot - PBR and high fidelity models"
              src="/docs/i/scrshot-050-pbr.jpg" />
            <figcaption class="figure-caption text-center">PBR and high fidelity models</figcaption>
          </figure>
        </div>
        <div class="col-sm-2"></div>
      </div>
    </div>
  </home-layout>
</template>
<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import HomeLayout from './layouts/HomeLayout.vue'

useTitle('WebXR Tests | Kaliatech')
</script>
<style lang="sass"></style>
