export interface LessonContent {
  id: string;
  title: string;
  slug: string; // URL amigável
  markdown?: string;
  order: number;
}
