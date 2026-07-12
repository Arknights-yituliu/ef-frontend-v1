export interface HomeBookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  openInNewTab: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface HomeBookmarkInput {
  title: string;
  url: string;
  icon?: string;
  openInNewTab: boolean;
}
