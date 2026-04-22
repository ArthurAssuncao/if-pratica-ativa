export interface Content {
  id: string;
  name: string;
}

export interface Discipline {
  id: string;
  name: string;
  icon: React.ReactNode;
  contents: Content[];
}

export interface SavedProgress {
  disciplineId: string;
  disciplineName: string;
  contentId: string;
  contentName: string;
  remaining: number;
}
