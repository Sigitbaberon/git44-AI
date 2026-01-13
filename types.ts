
export type ToolCategory = 'video' | 'audio' | 'image' | 'face-swap';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
}

export interface WorkerResponse {
  code: number;
  data: string;
  message?: string;
}

export type ProcessingStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ProcessedVideo {
  id: string;
  timestamp: number | string;
  fileName?: string;
  processedUrl: string;
}

export interface DeepSwapResponse {
  code: number;
  data: any;
  msg: string;
}
