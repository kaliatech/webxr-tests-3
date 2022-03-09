export declare type MediaItem = {
  id: string
  title: string
  type: 'video' | 'photo'
  halfDome?: boolean
  videoMode?: 0 | 1 | 2
  url: URL //TODO: Change to array for multiple source/codecs
}

const mediaItems: MediaItem[] = [
  {
    id: 'photo1',
    title: 'Photo 1 (360° Mono)',
    type: 'photo',
    url: new URL(
      //'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-002-photo/webxr-test-3-002-photo-041-insta360app-5760x2880.jpg',
      'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-002-photo/webxr-test-3-002-photo-048-insta360app-6080x3040-offset180-ps.jpg',
      //'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-002-photo/webxr-test-3-002-photo-042-insta360app-5760x2880.jpg',
    ),
  },
  {
    id: 'video1',
    title: 'Video 1 (360° Mono)',
    type: 'video',
    url: new URL(
      'https://temp.kaliatech.com/2022/webxr-tests-3/videos/kaliatech/webxr-tests-3-001-video/webxr-tests-3-video001-export-1-premiere-5760x2880-100Mbps-h264.mp4',
    ),
  },
  {
    id: 'video2',
    title: 'Video 2 (180° Stereo)',
    type: 'video',
    halfDome: true,
    url: new URL('https://temp.kaliatech.com/2022/webxr-tests-3/videos/hughhou/output_zcam_180_3d.mp4'),
  },
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
