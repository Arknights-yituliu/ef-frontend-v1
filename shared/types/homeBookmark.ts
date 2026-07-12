export const HOME_BOOKMARK_AVATAR_COLORS = [
  '#455A64',
  '#1565C0',
  '#00796B',
  '#6A1B9A',
  '#C62828',
  '#AD5B00',
  '#2E7D32',
  '#5D4037',
] as const;

export interface HomeBookmark {
  id: string;
  title: string;
  url: string;
  avatarText: string;
  avatarColor: string;
  openInNewTab: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface HomeBookmarkInput {
  title: string;
  url: string;
  avatarText: string;
  avatarColor: string;
  openInNewTab: boolean;
}

export function getHomeBookmarkInitial(value: string): string {
  return Array.from(value.trim())[0] ?? '';
}

export function getHomeBookmarkAvatarTextColor(backgroundColor: string): string {
  const match = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(backgroundColor);
  if (!match) {
    return '#ffffff';
  }

  const red = Number.parseInt(match[1] ?? '0', 16);
  const green = Number.parseInt(match[2] ?? '0', 16);
  const blue = Number.parseInt(match[3] ?? '0', 16);
  const perceivedBrightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return perceivedBrightness > 160 ? '#1f1f1f' : '#ffffff';
}
