import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'

import { LogicalScene } from '../LogicalScene.js'
import { AppManager } from '../AppManager'

import { Container, tsParticles } from 'tsparticles'
import { HtmlElementTexture } from '@babylonjs/core/Materials/Textures/htmlElementTexture'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Nullable } from '@babylonjs/core/types'
import { Observer } from '@babylonjs/core/Misc/observable'
import { Scene } from '@babylonjs/core/scene'
import { Engine } from 'tsparticles/engine'
import { CustomParticleContainer } from '../3d/utils/CustomParticleContainer'

export class Scene0XX2DCanvasParticles extends LogicalScene {

  private particlesCont?:Container
  private pCanvas?:HTMLCanvasElement
  private htmlElementTexture?:HtmlElementTexture
  private beforeRenderObvParticles: Nullable<Observer<Scene>> = null

  constructor(appManager: AppManager) {
    super(appManager)

    // Add a simple light
    const light = new HemisphericLight('lightA', new Vector3(0, 1, 0), this.scene)
    light.intensity = 0.7
    this.sceneAssetContainer.lights.push(light)

    if (this.scene.activeCamera instanceof ArcRotateCamera) {
      const arcCam = this.scene.activeCamera as ArcRotateCamera
      arcCam.position = new Vector3(0, 5, -20)
      arcCam.target = new Vector3(0, 4, 0)
    }

    this._initParticles()
  }

  private async _initParticles() {
    const pCanvas = this.pCanvas = document.createElement('canvas')
    this.pCanvas.id = 'particles'
    this.pCanvas.style.visibility = 'hidden'
    // pCanvas.width = 500;
    // pCanvas.height = 500;
    document.body.append(this.pCanvas)
    //let pCanvas = document.getElementById("particles");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const context = pCanvas.getContext('2d');
    //context?.clearRect(0, 0, pCanvas.width, pCanvas.height);


    const pEngine = new Engine()
    pEngine.init()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.particlesCont = new CustomParticleContainer(pEngine, "particles", {

    // eslint-disable-next-line
    // @ts-ignore
    // window.customRequestAnimationFrame = () => {
    //   console.log("animate")
    // }


    //this.particlesCont = await tsParticles.load('particles', {
      fpsLimit: 60,
      particles: {
        number: {
          value: 80,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: [
            '#73be28',
            '#6f2da8',
            '#1496ff',
            '#b4dc00',
          ],
        },
        shape: {
          type: [
            'circle',
          ],
          stroke: {
            width: 0,
            color: '#fff',
          },
          polygon: {
            nb_sides: 5,
          },
        },
        opacity: {
          value: 1,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.3,
            sync: false,
          },
        },
        size: {
          value: 15,
          random: true,
          anim: {
            enable: false,
            speed: 10,
            size_min: 5,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 350,
          // color: "#808080",
          color: '#ffffff',
          opacity: 0.6,
          width: 1.25,
        },
        move: {
          enable: true,
          speed: 2.5,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: {
            enable: false,
            rotateX: 500,
            rotateY: 1200,
          },
        },
      },
      retina_detect: true,
    })
    if (this.particlesCont) {
      this.particlesCont.canvas.loadCanvas(pCanvas)
      this.particlesCont.init()
      this.particlesCont.draw(true)
      await this.particlesCont.refresh()

    }

    // this.particlesCont.lastFrameTime = performance.now()
    await this.particlesCont?.start()

    const plane = MeshBuilder.CreatePlane('tsParticlePlane', { size: 10 })
    this.sceneAssetContainer.meshes.push(plane)
    const material = new StandardMaterial('tsParticleMaterial', this.scene)
    this.sceneAssetContainer.materials.push(material)
    material.diffuseColor = new Color3(1, 1, 1)
    //material.alpha = 0.5;
    this.htmlElementTexture = new HtmlElementTexture('texture', this.pCanvas, {
      scene: this.scene,
      engine: this.scene.getEngine(),
    })
    this.htmlElementTexture.hasAlpha = true
    material.diffuseTexture = this.htmlElementTexture
    this.sceneAssetContainer.textures.push(this.htmlElementTexture)


    console.log(this.particlesCont)

    this.beforeRenderObvParticles = this.scene.onBeforeRenderObservable.add(() => {
      //this.htmlElementTexture?.update()
      this.numLogs++
      if (this.numLogs % 60 === 0) {
        console.log("onBeforeRender...")
      }

      this.particlesCont?.play(true)
      this.particlesCont?.draw(true)
      this.htmlElementTexture?.update()
      if (this.numLogs % 60 === 0) {
        console.log("complete.")
      }
    })

    // I also tested updating the texture this way, but does not work either
    //setInterval(() => {
    //    text.update();
    //}, 1000/20);

    plane.position = new Vector3(0, 5, 0)
    plane.material = material
  }

  private numLogs = 0;

  dispose() {
    if (this.beforeRenderObvParticles) {
      this.scene.onBeforeRenderObservable.remove(this.beforeRenderObvParticles)
      this.beforeRenderObvParticles = null
    }

    this.particlesCont?.destroy()
    this.htmlElementTexture?.dispose()
    this.pCanvas?.remove()
    super.dispose()
  }
}
