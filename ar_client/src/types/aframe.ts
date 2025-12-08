//types used for AFrame lib

// Basic A-Frame entity/component surface used across the project
export interface AFrameEntity extends HTMLElement {
  components?: Record<string, AFrameComponentDefinition>;
}

export interface AFrameComponent {
  el: AFrameEntity;
  data?: Record<string, string | number | boolean | null>;
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
  update?: (this: AFrameComponent) => void;
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