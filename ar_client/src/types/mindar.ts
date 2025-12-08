// MindAR related types

export interface MindARCompiler {
  compileImageTargets: (
    images: HTMLImageElement[],
    callback: (progress: number) => void,
  ) => Promise<void>;
  exportData: () => Promise<Uint8Array>;
}

export interface MindAR {
  IMAGE: {
    Compiler: new () => MindARCompiler;
  };

}
