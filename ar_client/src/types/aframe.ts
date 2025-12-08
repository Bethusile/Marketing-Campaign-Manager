//types used for AFrame lib

// Basic A-Frame entity/component surface used across the project
export interface AFrameEntity extends HTMLElement {
  components?: Record<string, unknown>;
}

export interface AFrameComponent {
  el: AFrameEntity;
  data?: Record<string, unknown>;
}

// Shape emitted when a material texture is loaded
export interface MaterialTextureLoadedDetail {
  texture: {
    image: HTMLImageElement | {
      naturalWidth?: number;
      naturalHeight?: number;
      width?: number;
      height?: number;
    } | null;
  } | null;
}

// Data object passed to the `target-handler` component via its schema
export interface TargetHandlerData {
  campaignId?: number;
}

// Minimal component definition surface used by this project
export interface AFrameComponentDefinition {
  schema?: Record<string, { type: string }>;
  init?: (this: AFrameComponent) => void | Promise<void>;
  [key: string]: unknown;
}

export interface AFrameStatic {
  registerComponent(name: string, def: AFrameComponentDefinition): void;
}

declare global {
  interface Window {
    __TARGET_TO_CAMPAIGN?: Record<number, number>;
  }
}

export type TexImage = HTMLImageElement | { naturalWidth?: number; naturalHeight?: number; width?: number; height?: number };