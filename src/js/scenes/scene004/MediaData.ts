import { VideoDome } from '@babylonjs/core/Helpers/videoDome'
import { PhotoDome } from '@babylonjs/core/Helpers/photoDome'

export declare type MediaItem = {
  id: string
  title: string
  type: 'video' | 'photo'
  halfDome?: boolean
  imageMode?: 0 | 1 | 2
  videoMode?: 0 | 1 | 2
  url: string //TODO: Change to array for multiple source/codecs
}

const mediaItems: MediaItem[] = [
  {
    id: 'photo1',
    title: 'Photo 1 - Office (6k, 360° Mono)',
    type: 'photo',
    url:
      //'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-002-photo/webxr-test-3-002-photo-041-insta360app-5760x2880.jpg',
      'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-002-photo/webxr-test-3-002-photo-048-insta360app-6080x3040-offset180-ps.jpg',
    //'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-002-photo/webxr-test-3-002-photo-042-insta360app-5760x2880.jpg',
  },
  {
    id: 'photo2',
    title: 'Photo 2 - Falls (5k, 360° Mono)',
    type: 'photo',
    url: 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-004-photo/webxr-test-3-004-photo-pixel-park-5760x2880.jpg',
  },
  // {
  //   id: 'video1-360-5k',
  //   title: 'Video 1 - Office (5k, 100Mbps, 360° Mono)',
  //   type: 'video',
  //   url:
  //     'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-001-video/webxr-tests-3-video001-export-1-premiere-5760x2880-100Mbps-h264.mp4',
  //
  // },
  {
    id: 'video1-360-4k',
    title: 'Video 1 - Office (4k, 60Mbps, 360° Mono)',
    type: 'video',
    url: 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-001-video/webxr-tests-3-video001-export-1-premiere-4096x2048-60Mbps-h264.mp4',
  },
  {
    id: 'video4-180-stereo-vp9',
    title: 'Video 2 - Canon 180° (5k, VP9/WebM)',
    type: 'video',
    halfDome: true,
    videoMode: VideoDome.MODE_SIDEBYSIDE,
    //url: new URL('https://temp.kaliatech.com/2022/webxr-tests-3/videos/yt/8k-vr-demo-canon-dual-fisheye-3840p30-7680x3840.webm'),
    url: 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/yt/8k-vr-demo-canon-vp9-25Mbps-5760x2880.webm',
  },
  {
    id: 'video4-180-stereo-h264',
    title: 'Video 2 - Canon 180° (5k, h264/MP4)',
    type: 'video',
    halfDome: true,
    videoMode: VideoDome.MODE_SIDEBYSIDE,
    //url: new URL('https://temp.kaliatech.com/2022/webxr-tests-3/videos/yt/8k-vr-demo-canon-dual-fisheye-3840p30-7680x3840.webm'),
    url: 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/yt/8k-vr-demo-canon-vp9-25Mbps-5760x2880.webm',
  },
  // {
  //   id: 'video5-180-stereo',
  //   title: 'Video 3 - Qporit? (360° Stereo, 2k)',
  //   type: 'video',
  //   halfDome: false,
  //   videoMode: VideoDome.MODE_TOPBOTTOM,
  //   url: 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/tests/pg-ZM8UQE%234-180-top-bottom-1113774789-2160x2160.mp4'
  // },
  {
    id: '180-sbs-flat-photo',
    title: 'Test-180-sbs-flat-photo-5760x2880',
    type: 'photo',
    halfDome: true,
    imageMode: PhotoDome.MODE_SIDEBYSIDE,
    url: '/assets/tests-180/180-sbs-flat-5760x2880-oxi.png',
  },
  // {
  //   id: '180-sbs-flat-photo-2x',
  //   title: 'Test-180-sbs-flat-photo-5760x1440-oxi-2x',
  //   type: 'photo',
  //   halfDome: true,
  //   imageMode: TextureDome.MODE_SIDEBYSIDE,
  //   url: '/assets/tests-180/180-sbs-flat-5760x1440-oxi-2x.png'
  // },
  {
    id: '180-sbs-flat-video',
    title: 'Test-180-sbs-flat-video-5760x2880',
    type: 'video',
    halfDome: true,
    videoMode: VideoDome.MODE_SIDEBYSIDE,
    url: '/assets/tests-180/180-sbs-flat-5760x2880.mp4',
  },
  // {
  //   id: 'video2-180-mono',
  //   title: 'Video 2 (180° Stereo)',
  //   type: 'video',
  //   halfDome: true,
  //   videoMode: VideoDome.MODE_SIDEBYSIDE,
  //   url: new URL('https://temp.kaliatech.com/2022/webxr-tests-3/videos/hughhou/output_zcam_180_3d.mp4'),
  // },
  // {
  //   id: 'video3-180-stereo',
  //   title: 'Video 2 (180° Mono)',
  //   type: 'video',
  //   halfDome: true,
  //   url: new URL('https://temp.kaliatech.com/2022/webxr-tests-3/videos/vuze/vuze-xr-sample-180stereo-TravelTheWorldInVR.mp4'),
  // },
]

export { mediaItems }

// 180 Video Tests
// const url = 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/hughhou/output_zcam_180_3d.mp4'
//const url = 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/hughhou/output_zcam_180_3d.mp4'
// this.videoDome = new VideoDome('videoDome', url, videoDomeOpts, this.scene)
// this.videoDome.videoMode = VideoDome.MODE_SIDEBYSIDE
// this.videoDome.halfDome = true

// 360 Video Tests
//const url = "https://yoda.blob.core.windows.net/videos/uptale360.mp4"
//const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/uptale360.mp4"
//const url = "https://temp.kaliatech.com/2022/webxr-tests-3/videos/hughhou/Insta360Titan-7680_60fps_H265_100Mbps_360.mp4"

//works on quest 2, not desktop
//url = 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-001-video/webxr-tests-3-video001-export-1-insta360-5760x2880-100Mbps-h265.mp4'
//url = 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-001-video/webxr-tests-3-video001-export-1-premiere-5760x2880-100Mbps-h265.mp4'
//url = 'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-001-video/webxr-tests-3-video001-export-1-premiere-4096x2048-100Mbps-h265.mp4'

//works on both
// url =
//   'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-001-video/webxr-tests-3-video001-export-1-premiere-4096x2048-60Mbps-h264.mp4'
// url =
//   'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-001-video/webxr-tests-3-video001-export-1-insta360-5760x2880-100Mbps-h264.mp4'
// url =
//   'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-001-video/webxr-tests-3-video001-export-1-premiere-5760x2880-100Mbps-h264.mp4'
