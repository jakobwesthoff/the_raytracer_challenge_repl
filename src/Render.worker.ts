import init, { Camera, World } from "../rust/pkg/raytracer";
import loadRaytracer from "../rust/pkg/raytracer_bg.wasm";
import { expose, transfer } from "comlink";

export type { Camera } from "../rust/pkg/raytracer";

export class RenderWorker {
  private initialized = false;

  private world: World | undefined;
  private cameras: Map<string, Camera>;

  private assertIsInitialized() {
    if (!this.initialized) {
      throw new Error(`Worker not initialized!`);
    }
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const wasm = await (loadRaytracer as any)();
    await init(wasm);

    this.cameras = new Map();
    this.initialized = true;
  }

  public loadYaml(yaml: string): void {
    this.assertIsInitialized();
    this.world = new World(yaml);
    this.cameras = new Map(
      this.world
        .getCameras()
        .map((camera) => [camera.id, (camera as any).toJSON()])
    );
  }

  public getCameras(): Camera[] {
    this.assertIsInitialized();
    return Array.from(this.cameras.values());
  }

  public renderForCamera(
    cameraId: string,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): ImageData {
    this.assertIsInitialized();

    // Render and get result in WASM memory
    const data = this.world.render(cameraId, x1, y1, x2, y2);

    // Extract data from WASM memory and copy into worker memory
    const workerBuffer = new ArrayBuffer(data.byteLength);
    const view = new Uint8ClampedArray(workerBuffer);
    view.set(new Uint8ClampedArray(data));

    // Transfer worker memory buffer to main thread
    return transfer(new ImageData(view, x2 - x1, y2 - y1), [
      workerBuffer,
    ]);
  }
}

expose(new RenderWorker());
