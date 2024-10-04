class Node<T> {
  constructor(public value: T, public prev: Node<T> | null = null, public next: Node<T> | null = null) { }
}

class DoublyLinkedList<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;

  addToFront(value: T): Node<T> {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    return newNode;
  }

  moveToFront(node: Node<T>): void {
    if (node === this.head) return;
    this.remove(node);
    node.next = this.head;
    node.prev = null;
    if (this.head) this.head.prev = node;
    this.head = node;
    if (!this.tail) this.tail = node;
  }

  removeLast(): T | undefined {
    if (!this.tail) return undefined;
    const value = this.tail.value;
    this.remove(this.tail);
    return value;
  }

  remove(node: Node<T>): void {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;
    if (node === this.head) this.head = node.next;
    if (node === this.tail) this.tail = node.prev;
  }

  clear(): void {
    this.head = this.tail = null;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

export class LRUCacheMap<K, V> {
  private capacity: number;
  private cache: Map<K, { value: V; node: Node<K>; }>;
  private list: DoublyLinkedList<K>;
  private cleanupCallback?: (key: K, value: V) => void;

  constructor(capacity: number, cleanupCallback?: (key: K, value: V) => void) {
    this.capacity = Math.max(0, capacity);
    this.cache = new Map();
    this.list = new DoublyLinkedList<K>();
    this.cleanupCallback = cleanupCallback;
  }

  setCapacity(newCapacity: number): void {
    this.capacity = Math.max(0, newCapacity);
    this.ensureCapacity();
  }

  get(key: K): V | undefined {
    const item = this.cache.get(key);
    if (!item) return undefined;

    // Move accessed item to front of list
    this.list.moveToFront(item.node);
    return item.value;
  }

  put(key: K, value: V): void {
    if (this.capacity === 0) return;

    if (this.cache.has(key)) {
      // Update existing item
      const item = this.cache.get(key)!;
      item.value = value;
      this.list.moveToFront(item.node);
    } else {
      // Add new item
      if (this.cache.size >= this.capacity) {
        // Remove least recently used item
        const lruKey = this.list.removeLast();
        if (lruKey !== undefined) {
          const evictedItem = this.cache.get(lruKey);
          if (evictedItem && this.cleanupCallback) {
            this.cleanupCallback(lruKey, evictedItem.value);
          }
          this.cache.delete(lruKey);
        }
      }
      const node = this.list.addToFront(key);
      this.cache.set(key, { value, node });
    }
  }

  delete(key: K): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    this.list.remove(item.node);
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.list.clear();
  }

  size(): number {
    return this.cache.size;
  }

  entries(): IterableIterator<[K, V]> {
    const entries = this.cache.entries();
    return {
      [Symbol.iterator]: function () { return this; },
      next: () => {
        const result = entries.next();
        if (result.done) {
          return { done: true, value: undefined };
        }
        const [key, { value }] = result.value;
        return { done: false, value: [key, value] as [K, V] };
      }
    };
  }

  getOrderedEntries(): [K, V][] {
    const orderedEntries = this.list.toArray().map(key => {
      const item = this.cache.get(key);
      if (!item) {
        throw new Error(`Integrity check failed: key ${String(key)} found in list but not in cache`);
      }
      return [key, item.value] as [K, V];
    });

    // Integrity check: ensure cache and list have the same size
    if (orderedEntries.length !== this.cache.size) {
      throw new Error(`Integrity check failed: list size (${orderedEntries.length}) does not match cache size (${this.cache.size})`);
    }

    // Integrity check: ensure all cache keys are in the list
    const listKeys = new Set(this.list.toArray());
    for (const key of this.cache.keys()) {
      if (!listKeys.has(key)) {
        throw new Error(`Integrity check failed: key ${String(key)} found in cache but not in list`);
      }
    }

    return orderedEntries;
  }

  private ensureCapacity(): void {
    while (this.cache.size > this.capacity) {
      const lruKey = this.list.removeLast();
      if (lruKey !== undefined) {
        const item = this.cache.get(lruKey);
        if (item && this.cleanupCallback) {
          this.cleanupCallback(lruKey, item.value);
        }
        this.cache.delete(lruKey);
      }
    }
  }
}
