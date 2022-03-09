import { VideoDome } from '@babylonjs/core/Helpers/videoDome'
import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { Scene } from '@babylonjs/core/scene'
import { Nullable } from '@babylonjs/core/types'

export class VideoDome2 extends VideoDome {
  constructor(
    name: string,
    textureUrlOrElement: string | string[] | HTMLVideoElement,
    options: {
      resolution?: number
      clickToPlay?: boolean
      autoPlay?: boolean
      loop?: boolean
      size?: number
      poster?: string
      faceForward?: boolean
      useDirectMapping?: boolean
      halfDomeMode?: boolean
      crossEyeMode?: boolean
      generateMipMaps?: boolean
      mesh?: Mesh
    },
    scene: Scene,
    // eslint-disable-next-line
    onError?: Nullable<(message?: string, exception?: any) => void>,
  ) {
    super(name, textureUrlOrElement, options, scene, onError)
  }

  dispose(doNotRecurse?: boolean, disposeMaterialAndTextures?: boolean): void {
    const videoEl = this.videoTexture.video

    // eslint-disable-next-line
    this._scene.onPointerUp = ():void => {}

    if (videoEl) {
      // Remove any <source> elements, etc.
      while (videoEl.firstChild) {
        videoEl.removeChild(videoEl.firstChild)
      }

      // Set a blank src (https://html.spec.whatwg.org/multipage/media.html#best-practices-for-authors-using-media-elements)
      videoEl.src = ''

      // Prevent non-important errors maybe (https://twitter.com/beraliv/status/1205214277956775936)
      videoEl.removeAttribute('src')

      // Get certain browsers to let go
      videoEl.load()
    }

    super.dispose(doNotRecurse, disposeMaterialAndTextures)

    if (videoEl) {
       videoEl.remove()
    }
  }
}
