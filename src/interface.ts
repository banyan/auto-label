export interface Label {
  [key: string]: string;
}

export interface LabelEdge {
  node: {
    id: string;
    name: string;
  };
}

export interface FileEdge {
  node: {
    path: string;
  };
}

export type LabelName = string;
