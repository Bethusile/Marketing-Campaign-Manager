// Jayson Bam
// Interfaces used across ar-client

// Defines the structure of an ad campaign, including its content and status
export interface Campaign {
  id: number;
  title: string;
  message: string;
  buttonUrl: string;
  targetUrl: string;
  displayUrl: string;
  isActive: boolean;
  createdAt: string;
}

// Describes the MindAR tool used to process and compile images into tracking targets
export interface MindARCompiler {
  compileImageTargets: (
    images: HTMLImageElement[],
    callback: (progress: number) => void,
  ) => Promise<void>;
  exportData: () => Promise<Uint8Array>;
}

// Represents the global MindAR library object and its available tools
export interface MindAR {
  IMAGE: {
    Compiler: new () => MindARCompiler;
  };
}

// Represents a object (entity) within the A-Frame scene
export interface AFrameEntity extends HTMLElement {
  components?: Record<string, unknown>;
}

// Defines the structure of a custom component attached to an A-Frame entity
export interface AFrameComponent {
  el: AFrameEntity;
  data?: Record<string, unknown>;
}
