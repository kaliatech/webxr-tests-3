import type { Navigator as NavigatorXR, XRSystem } from 'webxr'

// interface XrSupportResult {
//   isSupported: boolean
//   xrSystem?: XRSystem
//   message?: string
// }
// return Promise.resolve({
//   isSupported: false,
//   message: 'XRSystem does not exist.',
// } as XrSupportResult)

export async function checkXrSupport(navigator: Navigator, mode: XRSessionMode): Promise<XRSystem> {
  if (!('xr' in navigator)) {
    throw new Error('XRSystem does not exist.')
  }

  const xrSystem = (navigator as unknown as NavigatorXR).xr as XRSystem
  if (xrSystem === null) {
    throw new Error('XRSystem is null')
  }

  if (await xrSystem.isSessionSupported(mode)) {
    return xrSystem
  } else {
    throw new Error(`${mode} is not supported.`)
  }
}
