
export enum Step {
  Landing,
  Capture,
  SelectBackground,
  Generating,
  Results,
}

export interface Background {
  id: string;
  name: string;
  previewUrl: string;
}
