export interface WikiEntry {
  list: string[];
}

export type WikiEntryTable = Record<string, WikiEntry>;
