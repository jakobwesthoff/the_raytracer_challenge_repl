import { Remote, wrap } from "comlink";
import { createDeferred, Deferred } from "./Deferred";
import type { Camera, RenderWorker } from "./Render.worker";

export type RenderCallback = (data: ImageData, block: Block) => void;
export type BlockSize = { width: number; height: number };
export type Block = { x1: number; y1: number; x2: number; y2: number };
export class RenderPool {
  private workers: Remote<RenderWorker>[];
  private stopRendering: false | Deferred<void>;
  private renderingInProgress: boolean;
  private lastBlock: Block;
  private renderCamera: Camera;

  constructor(private poolSize?: number, private blockSize?: BlockSize) {
    if (this.poolSize === undefined) {
      this.poolSize = navigator.hardwareConcurrency || 4;
    }
    if (this.blockSize === undefined) {
      this.blockSize = { width: 64, height: 64 };
    }

    this.workers = [];
    this.stopRendering = false;
    this.renderingInProgress = false;
    this.renderCamera = undefined;
    this.resetNextBlock();
  }

  public async loadYaml(yaml: string): Promise<void> {
    if (this.workers.length < this.poolSize) {
      await this.initialize();
    }
    await Promise.all([this.workers.map((worker) => worker.loadYaml(yaml))]);
  }

  public async getCameras(): Promise<Camera[]> {
    if (this.workers.length < this.poolSize) {
      await this.initialize();
    }

    const [worker] = this.workers;

    const cameras = await worker.getCameras();
    return cameras;
  }

  public async render(
    cameraId: string,
    callback: RenderCallback
  ): Promise<void> {
    this.stopRendering = false;
    this.renderingInProgress = true;
    this.resetNextBlock();

    if (this.workers.length < this.poolSize) {
      await this.initialize();
    }

    const [worker] = this.workers;
    const [camera] = (await worker.getCameras()).filter(
      (camera) => camera.id === cameraId
    );
    if (camera === undefined) {
      this.renderingInProgress = false;
      throw new Error(`No camera with id ${cameraId} available.`);
    }
    this.renderCamera = camera;

    let finished = Array(this.workers.length).fill(false);
    let deferred = createDeferred<void>();

    const next = async (workerId: number, block: Block | false) => {
      if (this.stopRendering === false && block !== false) {
        const data = await this.workers[workerId].renderForCamera(
          camera.id,
          block.x1,
          block.y1,
          block.x2,
          block.y2
        );
        callback(data, block);
        next(workerId, this.getNextBlock());
      } else {
        finished[workerId] = true;
        if (finished.every((candidate) => candidate === true)) {
          deferred.resolve();
          if (this.stopRendering !== false) {
            this.stopRendering.resolve();
          }
          this.renderingInProgress = false;
        }
      }
    };

    for (let i = 0; i < this.workers.length; i++) {
      next(i, this.getNextBlock());
    }

    return deferred.promise;
  }

  public stop(): Promise<void> {
    if (!this.renderingInProgress) {
      return;
    }

    if (this.stopRendering === false) {
      this.stopRendering = createDeferred<void>();
    }
    return this.stopRendering.promise;
  }

  private async initialize(): Promise<void> {
    while (this.workers.length < this.poolSize) {
      this.workers.push(await this.instantiateWorker());
    }
  }

  private async instantiateWorker(): Promise<Remote<RenderWorker>> {
    const worker = new Worker(`/build/Render.worker.js`);
    const wrappedWorker = wrap<RenderWorker>(worker);
    await wrappedWorker.initialize();
    return wrappedWorker;
  }

  private resetNextBlock(): void {
    this.lastBlock = undefined;
  }

  private getNextBlock(): Block | false {
    if (this.renderCamera === undefined) {
      throw new Error(
        `Next block can only be calculated once the render process has begun.`
      );
    }

    const { width: cw, height: ch } = this.renderCamera;
    const { width: bw, height: bh } = this.blockSize;

    if (this.lastBlock === undefined) {
      this.lastBlock = {
        x1: 0,
        y1: 0,
        x2: Math.min(bw, cw),
        y2: Math.min(bh, ch),
      };
    } else {
      let { x1, x2, y1, y2 } = this.lastBlock;
      if (x2 >= cw) {
        if (y2 >= ch) {
          return false;
        }

        // Next line of blocks
        x1 = 0;
        x2 = Math.min(bw, cw);
        y1 = y2;
        y2 = Math.min(y1 + bh, ch);
      } else {
        // Move along in block "line"
        x1 = x2;
        x2 = Math.min(x1 + bw, cw);
      }
      this.lastBlock = { x1, x2, y1, y2 };
    }

    return this.lastBlock;
  }
}
