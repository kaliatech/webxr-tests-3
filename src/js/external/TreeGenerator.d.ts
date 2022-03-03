import { Mesh } from '@babylonjs/core/Meshes/mesh'
import { Material } from '@babylonjs/core/Materials/material'
import { Scene } from '@babylonjs/core/scene'

export function createTree(
  trunkHeight: number,
  trunkTaper: number,
  trunkSlices: number,
  trunkMaterial: Material,
  boughs: number,
  forks: number,
  forkAngle: number,
  forkRatio: number,
  branches: number,
  branchAngle: number,
  bowFreq: number,
  bowHeight: number,
  leavesOnBranch: number,
  leafWHRatio: number,
  leafMaterial: Material,
  scene: Scene,
): Mesh
