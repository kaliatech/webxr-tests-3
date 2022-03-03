import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial'
import { Scene } from '@babylonjs/core/scene'
import { Color3 } from '@babylonjs/core/Maths/math.color'

export function red(scene: Scene): StandardMaterial {
  function create(scene: Scene) {
    const m = new StandardMaterial('red-material', scene)
    m.diffuseColor = Color3.Red()
    return m
  }
  return (scene.getMaterialByName('red-material') as StandardMaterial) ?? create(scene)
}

export function green(scene: Scene): StandardMaterial {
  function create(scene: Scene) {
    const m = new StandardMaterial('green-material', scene)
    m.diffuseColor = Color3.Green()
    return m
  }
  return (scene.getMaterialByName('green-material') as StandardMaterial) ?? create(scene)
}

export function blue(scene: Scene): StandardMaterial {
  function create(scene: Scene) {
    const m = new StandardMaterial('blue-material', scene)
    m.diffuseColor = Color3.Blue()
    return m
  }
  return (scene.getMaterialByName('blue-material') as StandardMaterial) ?? create(scene)
}

export function white(scene: Scene): StandardMaterial {
  function create(scene: Scene) {
    const m = new StandardMaterial('white-material', scene)
    m.diffuseColor = Color3.White()
    return m
  }
  return (scene.getMaterialByName('white-material') as StandardMaterial) ?? create(scene)
}
