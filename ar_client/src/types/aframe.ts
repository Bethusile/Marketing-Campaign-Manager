import type { AFrameEntity, AFrameComponent } from "./index";

// Detail shape emitted by A-Frame when a material texture is loaded
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

export type { AFrameEntity, AFrameComponent };
