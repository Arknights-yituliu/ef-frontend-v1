import type { HomeBookmark, HomeBookmarkInput } from '@/shared/types/homeBookmark';
import { getHomeBookmarkInitial, HOME_BOOKMARK_AVATAR_COLORS } from '@/shared/types/homeBookmark';

const STORAGE_KEY = 'homeBookmarks:v1';
const STORAGE_VERSION = 2;

interface HomeBookmarkStorage {
  version: number;
  bookmarks: unknown[];
}

const AVATAR_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

function isAllowedUrl(value: string): boolean {
  if (value.startsWith('/') && !value.startsWith('//')) {
    return true;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function normalizeUrl(value: string): string {
  const trimmedValue = value.trim();
  if (trimmedValue.startsWith('/')) {
    return trimmedValue;
  }

  return new URL(trimmedValue).toString();
}

function getDefaultAvatarColor(title: string): string {
  const hash = Array.from(title).reduce(
    (result, character) => result + (character.codePointAt(0) ?? 0),
    0,
  );
  return HOME_BOOKMARK_AVATAR_COLORS[hash % HOME_BOOKMARK_AVATAR_COLORS.length] ?? '#455A64';
}

function normalizeAvatarColor(value: unknown, title: string): string {
  if (typeof value === 'string' && AVATAR_COLOR_PATTERN.test(value.trim())) {
    return value.trim().toUpperCase();
  }

  return getDefaultAvatarColor(title);
}

function migrateStoredBookmark(value: unknown): HomeBookmark | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const bookmark = value as Partial<HomeBookmark> & { icon?: unknown };
  const isValid =
    typeof bookmark.id === 'string' &&
    typeof bookmark.title === 'string' &&
    Boolean(bookmark.title.trim()) &&
    typeof bookmark.url === 'string' &&
    isAllowedUrl(bookmark.url) &&
    typeof bookmark.openInNewTab === 'boolean' &&
    typeof bookmark.createdAt === 'number' &&
    typeof bookmark.updatedAt === 'number';

  if (!isValid) {
    return undefined;
  }

  const title = bookmark.title.trim();
  const avatarText =
    typeof bookmark.avatarText === 'string'
      ? getHomeBookmarkInitial(bookmark.avatarText)
      : getHomeBookmarkInitial(title);

  return {
    id: bookmark.id,
    title,
    url: normalizeUrl(bookmark.url),
    avatarText: avatarText || '?',
    avatarColor: normalizeAvatarColor(bookmark.avatarColor, title),
    openInNewTab: bookmark.openInNewTab,
    createdAt: bookmark.createdAt,
    updatedAt: bookmark.updatedAt,
  };
}

function createBookmarkId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function validateHomeBookmarkUrl(value: string): boolean {
  return isAllowedUrl(value.trim());
}

export function normalizeHomeBookmarkInput(input: HomeBookmarkInput): HomeBookmarkInput {
  const title = input.title.trim();
  const avatarText = getHomeBookmarkInitial(input.avatarText) || getHomeBookmarkInitial(title);

  return {
    title,
    url: normalizeUrl(input.url),
    avatarText: avatarText || '?',
    avatarColor: normalizeAvatarColor(input.avatarColor, title),
    openInNewTab: input.openInNewTab,
  };
}

export function useHomeBookmarks() {
  const bookmarks = useState<HomeBookmark[]>('home-bookmarks', () => []);
  const hasLoaded = useState<boolean>('home-bookmarks-loaded', () => false);

  function saveBookmarks(): void {
    if (!import.meta.client) {
      return;
    }

    const storage: HomeBookmarkStorage = {
      version: STORAGE_VERSION,
      bookmarks: bookmarks.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
  }

  function loadBookmarks(): void {
    if (!import.meta.client || hasLoaded.value) {
      return;
    }

    hasLoaded.value = true;
    const savedValue = localStorage.getItem(STORAGE_KEY);
    if (!savedValue) {
      bookmarks.value = [];
      return;
    }

    try {
      const storage = JSON.parse(savedValue) as Partial<HomeBookmarkStorage>;
      if (
        (storage.version !== 1 && storage.version !== STORAGE_VERSION) ||
        !Array.isArray(storage.bookmarks)
      ) {
        bookmarks.value = [];
        return;
      }

      bookmarks.value = storage.bookmarks
        .map((bookmark) => migrateStoredBookmark(bookmark))
        .filter((bookmark): bookmark is HomeBookmark => bookmark !== undefined);

      if (storage.version !== STORAGE_VERSION) {
        saveBookmarks();
      }
    } catch (error) {
      console.error('Failed to load home bookmarks:', error);
      bookmarks.value = [];
    }
  }

  function addBookmark(input: HomeBookmarkInput): HomeBookmark {
    const normalizedInput = normalizeHomeBookmarkInput(input);
    const now = Date.now();
    const bookmark: HomeBookmark = {
      ...normalizedInput,
      id: createBookmarkId(),
      createdAt: now,
      updatedAt: now,
    };

    bookmarks.value = [bookmark, ...bookmarks.value];
    saveBookmarks();
    return bookmark;
  }

  function updateBookmark(id: string, input: HomeBookmarkInput): HomeBookmark | undefined {
    const index = bookmarks.value.findIndex((bookmark) => bookmark.id === id);
    if (index === -1) {
      return undefined;
    }

    const currentBookmark = bookmarks.value[index];
    if (!currentBookmark) {
      return undefined;
    }

    const updatedBookmark: HomeBookmark = {
      ...currentBookmark,
      ...normalizeHomeBookmarkInput(input),
      updatedAt: Date.now(),
    };
    bookmarks.value = bookmarks.value.map((bookmark) =>
      bookmark.id === id ? updatedBookmark : bookmark,
    );
    saveBookmarks();
    return updatedBookmark;
  }

  function removeBookmark(id: string): void {
    bookmarks.value = bookmarks.value.filter((bookmark) => bookmark.id !== id);
    saveBookmarks();
  }

  return {
    bookmarks: readonly(bookmarks),
    loadBookmarks,
    addBookmark,
    updateBookmark,
    removeBookmark,
  };
}
