// Shared API response types for the AR client

export interface ARStartupResponse {
    message?: string | null;
    buttonUrl?: string | null;
    targetMindUrl?: string | null;
    targetIdMap?: Record<number, number> | null;
}

export interface UnredactedImageResponse {
    unredactedImageUrl: string;
}
