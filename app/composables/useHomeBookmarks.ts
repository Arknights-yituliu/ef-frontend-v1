import type { HomeBookmark, HomeBookmarkInput } from '@/shared/types/homeBookmark';

const STORAGE_KEY = 'homeBookmarks:v1';
const STORAGE_VERSION = 1;

interface HomeBookmarkStorage {
  version: number;
  bookmarks: HomeBookmark[];
}

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

function isHomeBookmark(value: unknown): value is HomeBookmark {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const bookmark = value as Partial<HomeBookmark>;
  return (
    typeof bookmark.id === 'string' &&
    typeof bookmark.title === 'string' &&
    typeof bookmark.url === 'string' &&
    isAllowedUrl(bookmark.url) &&
    (bookmark.icon === undefined ||
      (typeof bookmark.icon === 'string' && isAllowedUrl(bookmark.icon))) &&
    typeof bookmark.openInNewTab === 'boolean' &&
    typeof bookmark.createdAt === 'number' &&
    typeof bookmark.updatedAt === 'number'
  );
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
  const icon = input.icon?.trim();

  return {
    title: input.title.trim(),
    url: normalizeUrl(input.url),
    icon: icon ? normalizeUrl(icon) : undefined,
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
      if (storage.version !== STORAGE_VERSION || !Array.isArray(storage.bookmarks)) {
        bookmarks.value = [];
        return;
      }

      bookmarks.value = storage.bookmarks.filter((bookmark) => isHomeBookmark(bookmark));
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
