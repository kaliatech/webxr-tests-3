# WebXR-Tests-3

WebXR tests using:

- [Vite](https://vitejs.dev/)
- [BabylonJS 5](https://www.babylonjs.com/) (ES6)
- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Bootstrap 5](https://getbootstrap.com/)

Test site:
- http://webxr-tests-3.kaliatech.com/

One of the benefits of WebXR over Unity and Unreal, is the development workflow. This vite based setup is particularly
fast to iterate with. Make a change in code, save, and within seconds the change becomes visible.

### Purpose
Test and verify WebXR functionality using Babylon.js 5. Key features tested:
 - High fidelity controller models
 - Teleport functionality (use right joystick)
 - Multiple scene transitioning
 - Basic UI and input functionality
 - 360° and 180° photos and videos
 - PBR Materials
 - Etc

While most of the functionality works across all browsers and devices, including Safari/iOS,
these demos are primarily meant to be viewed within a VR headset. Testing was done with a
Meta Quest 2.

Additional notes and thoughts here:
 - https://kaliatech.com/blog/2022/webxr-tests

### Screenhots

Browsers all the way down...
![webxr-3-tests-1](https://imgur.com/0d1WyBi.jpg)

Not the most exiting demo, but it _does_ work...
![webxr-3-tests-1](https://imgur.com/jyjx6v4.jpg)

2D UI in VR...
![webxr-3-tests-1](https://imgur.com/OXLXYVR.jpg)

Immersive photos and videos...
![webxr-3-tests-1](https://imgur.com/wSdHTL4.jpg)

PBR and high fidelity models...
![webxr-3-tests-1](https://imgur.com/AqJSQEC.jpg)


### Project Setup Examples

A simpler repo showing the minimal setup for using Babylon.js and Vite for WebXR development is here:

- With Vue
  - https://github.com/kaliatech/webxr-vite-babylon-simple

- Without Vue
  - https://github.com/kaliatech/babylon-docs-vite-webxr

The Vue example does not use reactivity for Babylon.js. There are other projects showing how to do that if interested,
and even more examples of that if you prefer React over Vue. ...but why would you? :)

