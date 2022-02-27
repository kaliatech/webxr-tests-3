import { Scene } from '@babylonjs/core/scene'
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder'
import { Node } from '@babylonjs/core/node'
import { TransformNode } from '@babylonjs/core/Meshes/transformNode'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import * as ColorMaterials from '../materials/ColorMaterials'

/**
 * A custom alternative to the built-in Babylon.js AxesViewer
 */
export class AxesWidget {
  private readonly _root: TransformNode | undefined

  constructor(scene: Scene, public name = 'axesWidget', public length = 1) {
    this._root = new TransformNode(name, scene, false)

    const lineDiameter = this.length * 0.02
    const arrowLength = this.length / 10
    const lineLength = this.length - arrowLength

    const yAxis = this._createYAxis(scene, this._root, length, lineLength, lineDiameter, arrowLength)
    for (const mesh of yAxis.getChildMeshes()) {
      mesh.material = ColorMaterials.green(scene)
    }

    const xAxis = yAxis.clone('xAxis', this._root, false) as TransformNode
    xAxis.rotation = new Vector3(0, 0, -Math.PI / 2)
    for (const mesh of xAxis.getChildMeshes()) {
      mesh.material = ColorMaterials.red(scene)
    }

    const zAxis = yAxis.clone('zAxis', this._root, false) as TransformNode
    zAxis.rotation = new Vector3(Math.PI / 2, 0, 0)
    for (const mesh of zAxis.getChildMeshes()) {
      mesh.material = ColorMaterials.blue(scene)
    }
  }

  public get root(): TransformNode {
    if (!this._root) return new TransformNode('error')

    return this._root
  }

  private _createYAxis(
    scene: Scene,
    parent: Node,
    length: number,
    lineLength: number,
    lineDiameter: number,
    arrowLength: number,
  ): TransformNode {
    const yAxis = new TransformNode('yAxis', scene, false)
    yAxis.parent = parent

    const line = MeshBuilder.CreateCylinder('line', { height: lineLength, diameter: lineDiameter }, scene)
    line.position.y = lineLength / 2
    line.parent = yAxis

    const arrow = MeshBuilder.CreateCylinder(
      'arrow',
      { height: arrowLength, diameterBottom: lineDiameter * 5, diameterTop: 0 },
      scene,
    )
    arrow.position.y = lineLength + arrowLength / 2
    arrow.parent = yAxis

    return yAxis
  }
}
