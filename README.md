# WebXR-Tests-3

WebXR tests using:

- [Vite](https://vitejs.dev/)
- [BabylonJS 5](https://www.babylonjs.com/) (ES6)
- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Bootstrap 5](https://getbootstrap.com/)

A simpler repo showing the minimal setup for using Babylon.js and Vite for WebXR
development is here:

- With Vue (but not using reactivity for Babylon)
  - https://github.com/kaliatech/webxr-vite-babylon-simple
  
- Without Vue
  - https://github.com/kaliatech/babylon-docs-vite-webxr

One of the benefits of WebXR over Unity and Unreal, is the development workflow. This vite based setup
is particularly fast to iterate. Make a change in code, and within seconds the change becomes visible. 

### Purpose
Test and verify WebXR functionality using Babylon.js 5. Key features tested:
 - High fidelity controller models
 - Teleport functionality (use right joystick)
 - Multiple scene transitioning
 - Basic UI and input functionality
 - 360° and 180° photos and videos
 - PBR Materials
 - Etc

Note that while most of the functionlity works across all browsers and devices (even Safari/iOS),
these demos are primarily meant to be viewed within a VR headset. Testing was done with
Meta Quest 2.

Additional notes and thoughts here:
 - _TODO_

### Screenhots

Browsers all the way down...
![webxr-3-tests-1](https://imgur.com/0d1WyBi.jpg)

Not the most exiting demo, but it _does_ work...
![webxr-3-tests-1](https://imgur.com/jyjx6v4.jpg)

2D UI and VR isn't the best fit, but sometimes necessary...
![webxr-3-tests-1](https://imgur.com/OXLXYVR.jpg)

Immersive photos and videos...
![webxr-3-tests-1](https://imgur.com/wSdHTL4.jpg)

PBR and high fidelity models...
![webxr-3-tests-1](https://imgur.com/AqJSQEC.jpg)
