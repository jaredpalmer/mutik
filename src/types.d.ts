declare module 'use-sync-external-store' {
  export function useSyncExternalStore<Snapshot>(
    subscribe: (callback: Function) => () => void,
    getSnapshot: () => Snapshot
  ): Snapshot;
}

declare module 'use-sync-external-store/extra' {
  export function useSyncExternalStoreExtra<Snapshot, Selection>(
    subscribe: (callback: Function) => () => void,
    getSnapshot: () => Snapshot,
    selector: (snapshot: Snapshot) => Selection,
    isEqual?: (a: Selection, b: Selection) => boolean
  ): Selection;
}
