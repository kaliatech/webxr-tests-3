<template>
  <main-layout>
    <div class="container">
      <div class="render-cont-outer">
        <div class="container">
          <div class="row">
            <div class="col">
              <h1>About</h1>
              <p>This is an informal site for my own learning and testing. All source is available here:</p>
              <ul>
                <li>
                  <a href="https://github.com/kaliatech/webxr-tests-3">https://github.com/kaliatech/webxr-tests-3</a>
                  .
                </li>
              </ul>
              <p>These are my notes and thoughts related to these tests:</p>
              <ul>
                <li>
                  <a href="https://kaliatech.com/blog/2022/webxr-tests">https://kaliatech.com/blog/2022/webxr-tests</a>
                </li>
              </ul>
              <p>
                I have a number of other ideas and experiments I'd like to try, but I don't know if I'll add to this
                site or create new ones. For anyone that finds tests of this sort interesting, be sure to also check out
                these sites:
              </p>
              <div>
                <ul>
                  <li>
                    <a href="https://canvatorium.vercel.app/">Canvatorium</a> by @vrhermit
                    (
                    <a href="https://github.com/vrhermit/Canvatorium">source</a>
                    )
                    <ul>
                      <li>
                        I didn't come across this until almost done with my own testing. If I had come across sooner, I
                        probably wouldn't have bothered writing many of my own tests. These are very well done.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="https://immersive-web.github.io/webxr-samples/">WebXR Samples</a> by Immersive Web Working Group
                  </li>
                </ul>
              </div>
              <h1 class="mt-5">Link Convenience</h1>
              <p>
                Typing in long URLS while in the HMD is such a pain. The
                <a href="https://developer.oculus.com/documentation/web/browser-odh/">Oculus Developer Hub</a>
                makes this much easier now, but it's still not as convenient as simply pasting a link here while
                developing:
              </p>
              <button
                class="btn btn-primary"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseExample"
                aria-expanded="false"
                aria-controls="collapseExample">
                Show
              </button>

              <div id="collapseExample" class="collapse">
                <div class="card card-body">
                  <ul>
                    <li>
                      <a href="https://immersive-web.github.io/webxr-samples/">
                        https://immersive-web.github.io/webxr-samples/
                      </a>
                    </li>
                    <li>
                      <a href="https://immersive-web.github.io/webxr-samples/layers-samples/">
                        https://immersive-web.github.io/webxr-samples/layers-samples/
                      </a>
                    </li>
                    <li>
                      <a href="https://brianzinn.github.io/react-babylonjs/?path=/story/gui--with-2-dui">
                        https://brianzinn.github.io/react-babylonjs/?path=/story/gui--with-2-dui
                      </a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/watch?v=Q9vVYJd4bOE">
                        Canon RF5.2mm F2.8 L DUAL FISHEYE Real World Test
                      </a>
                      (
                      <a href="https://www.oculus.com/experiences/media/333140902004065/">Oculus TV</a>
                      )
                    </li>
                    <li>
                      <a href="https://makepad.dev/">https://makepad.dev/</a>
                    </li>
                    <li>
                      <a href="https://360rumors.com/theta-x-review/">https://360rumors.com/theta-x-review/</a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/watch?v=L7iP4zRD3cY">
                        RED V-RAPTOR w/ Canon Dual Fisheye vs EOS R5
                      </a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/watch?v=DvJyepBjHLY">VR180 from 2X Insta360 Go</a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/watch?v=LuRj5pX4nug">VR180 from 2X Insta360 Go, 22mm IPD test</a>
                    </li>
                    <li>
                      <a href="https://www.youtube.com/watch?v=_4a-RnTLu-I">Create 6DoF Video from 3DoF VR180</a>
                    </li>
                    <li>
                      <a href="https://www.babylonjs-playground.com/#ZM8UQE#4">PG - Top-Bottom</a>
                    </li>
                    <li>
                      <a href="https://canvatorium.vercel.app/">Canvatorium by @vrhermit/@radicalappdev</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main-layout>
</template>
<script setup lang="ts">
import MainLayout from './layouts/MainLayout.vue'
import { useTitle } from '@vueuse/core'

useTitle('About - WebXR | Kaliatech')
</script>
