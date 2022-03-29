import { Container } from 'tsparticles'
import { Engine } from 'tsparticles/engine'
import { RecursivePartial } from 'tsparticles/Types'
import { IOptions } from 'tsparticles/Options/Interfaces/IOptions'

export class CustomParticleContainer extends Container {
  constructor(engine: Engine, id: string, sourceOptions?: RecursivePartial<IOptions>, ...presets: string[]) {
    super(engine, id, sourceOptions, ...presets)
  }

  async draw(force: boolean): Promise<void> {
    if (force) {
      this.lastFrameTime = undefined;
      await this.drawer.nextFrame(performance.now())
    }
  }

  // draw(force: boolean): void {
  //   let refreshTime = force;
  //   this.drawAnimationFrame = (0, Utils_2.animate)()(async (timestamp) => {
  //     if (refreshTime) {
  //       this.lastFrameTime = undefined;
  //       refreshTime = false;
  //     }
  //     await this.drawer.nextFrame(timestamp);
  //   });
  // }
}
