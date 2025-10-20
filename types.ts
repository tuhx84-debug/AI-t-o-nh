
export interface GeneratedImage {
  id: string;
  src: string;
}

export interface GeneratePortraitsParams {
  imageFile: File;
  topic: string;
  context: string;
  aspectRatio: string;
  numImages: number;
}
