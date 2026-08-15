declare module 'lowdb' {
  interface LowdbCollection<T> {
    find(query: Partial<T>): { value: () => T | undefined; assign: (data: Partial<T>) => { write: () => void } };
    push(item: T): { write: () => void };
    remove(query: Partial<T>): { write: () => void };
    value(): T[];
  }

  interface LowdbInstance<S> {
    defaults(data: S): LowdbInstance<S>;
    get(key: string): LowdbCollection<any>;
    write(): void;
  }

  function low<S>(adapter: any): LowdbInstance<S>;
  export default low;
}

declare module 'lowdb/adapters/FileSync' {
  export default class FileSync<S> {
    constructor(source: string);
  }
}
