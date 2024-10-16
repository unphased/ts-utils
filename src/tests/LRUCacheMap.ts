import { test } from 'tst';
import { LRUCacheMap } from '../structures/LRUCacheMap.js';

export const LRUCache_01_basic_functionality = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 1: Basic functionality
  const cache = new LRUCacheMap<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);

  eq(cache.get("a"), 1, "Should retrieve correct value for 'a'");
  eq(cache.get("b"), 2, "Should retrieve correct value for 'b'");
  eq(cache.get("c"), 3, "Should retrieve correct value for 'c'");
  eq(cache.size(), 3, "Cache size should be 3");
});

export const LRUCache_02_eviction = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 2: Eviction of least recently used item
  const cache = new LRUCacheMap<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.put("d", 4);

  eq(cache.get("a"), undefined, "'a' should have been evicted");
  eq(cache.get("d"), 4, "'d' should be in the cache");
  eq(cache.size(), 3, "Cache size should still be 3");
});

export const LRUCache_03_updating_existing_key = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 3: Updating existing key
  const cache = new LRUCacheMap<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.put("a", 4);

  eq(cache.get("a"), 4, "'a' should be updated to 4");
  eq(cache.size(), 3, "Cache size should still be 3");
});

export const LRUCache_04_get_updates_order = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 4: Get updates order
  const cache = new LRUCacheMap<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.get("a");
  cache.put("d", 4);

  eq(cache.get("b"), undefined, "'b' should have been evicted");
  eq(cache.get("a"), 1, "'a' should still be in the cache");
});

export const LRUCache_05_delete_functionality = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 5: Delete functionality
  const cache = new LRUCacheMap<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);

  eq(cache.delete("b"), true, "Delete should return true for existing key");
  eq(cache.get("b"), undefined, "'b' should no longer be in the cache");
  eq(cache.size(), 2, "Cache size should be 2 after deletion");
  eq(cache.delete("d"), false, "Delete should return false for non-existing key");
});

export const LRUCache_06_clear_functionality = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 6: Clear functionality
  const cache = new LRUCacheMap<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.clear();

  eq(cache.size(), 0, "Cache should be empty after clear");
  eq(cache.get("a"), undefined, "All items should be removed after clear");
});


export const LRUCache_08_entries_method = test('LRUCacheMap', ({ a: { eq, is } }) => {
  // Test 8: Entries method
  const cache = new LRUCacheMap<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);

  const entriesArray = Array.from(cache.entries());
  eq(entriesArray.length, 3, "Entries should return all items");
  is(entriesArray.some(([k, v]) => k === "a" && v === 1), "Entries should contain ['a', 1]");
  is(entriesArray.some(([k, v]) => k === "b" && v === 2), "Entries should contain ['b', 2]");
  is(entriesArray.some(([k, v]) => k === "c" && v === 3), "Entries should contain ['c', 3]");
});

export const LRUCache_09_large_capacity = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 9: Large capacity
  const cache = new LRUCacheMap<number, number>(1000);
  for (let i = 0; i < 1000; i++) {
    cache.put(i, i * 2);
  }
  eq(cache.size(), 1000, "Cache should be full");
  eq(cache.get(500), 1000, "Should retrieve correct value");
  cache.put(1000, 2000);
  eq(cache.get(0), undefined, "Least recently used item should be evicted");
  eq(cache.get(1), 2, "Second item should still be present");
});

export const LRUCache_10_random_operations = test('LRUCacheMap', ({ l, a: { eq, is } }) => {
  // Test 10: Random operations
  const cache = new LRUCacheMap<number, number>(100);
  const operations = 10000;
  let putCount = 0, getCount = 0, deleteCount = 0;

  for (let i = 0; i < operations; i++) {
    const op = Math.floor(Math.random() * 3);
    const key = Math.floor(Math.random() * 200);

    if (op === 0) {
      cache.put(key, i);
      putCount++;
    } else if (op === 1) {
      cache.get(key);
      getCount++;
    } else {
      cache.delete(key);
      deleteCount++;
    }
  }

  is(cache.size() <= 100, "Cache size should not exceed capacity");
  l(`Put: ${putCount}, Get: ${getCount}, Delete: ${deleteCount}`);
});

export const LRUCache_11_edge_cases = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 11: Edge cases
  const cache1 = new LRUCacheMap<string, number>(1);
  cache1.put("key1", 1);
  cache1.put("key2", 2);
  eq(cache1.get("key1"), undefined, "First key should be evicted");
  eq(cache1.get("key2"), 2, "Second key should be present");

  const zeroCache = new LRUCacheMap<string, number>(0);
  zeroCache.put("key", 1);
  eq(zeroCache.size(), 0, "Zero capacity cache should always be empty");
  eq(zeroCache.get("key"), undefined, "Zero capacity cache should not store items");

  const negativeCache = new LRUCacheMap<string, number>(-5);
  negativeCache.put("key", 1);
  eq(negativeCache.size(), 0, "Negative capacity should be treated as zero");

  // Incorporating test from LRUCache_07_zero_capacity
  const cache = new LRUCacheMap<string, number>(0);
  cache.put("a", 1);
  eq(cache.size(), 0, "Cache with capacity 0 should always be empty");
  eq(cache.get("a"), undefined, "Cache with capacity 0 should not store items");
});

export const LRUCache_12_sequence_validation = test('LRUCacheMap', ({ l, a: { eq, eqO } }) => {
  // Test 12: Sequence validation
  const cache = new LRUCacheMap<string, number>(3);

  cache.put("A", 1);
  cache.put("B", 2);
  cache.put("C", 3);
  eqO(cache.getOrderedEntries(), [["C", 3], ["B", 2], ["A", 1]], "Initial state after putting 3 items");

  cache.get("A");
  eqO(cache.getOrderedEntries(), [["A", 1], ["C", 3], ["B", 2]], "After accessing 'A'");

  cache.put("D", 4);
  eqO(cache.getOrderedEntries(), [["D", 4], ["A", 1], ["C", 3]], "After adding 'D', 'B' should be evicted");

  cache.put("E", 5);
  eqO(cache.getOrderedEntries(), [["E", 5], ["D", 4], ["A", 1]], "After adding 'E', 'C' should be evicted");

  cache.get("A");
  eqO(cache.getOrderedEntries(), [["A", 1], ["E", 5], ["D", 4]], "After accessing 'A' again");

  cache.put("F", 6);
  eqO(cache.getOrderedEntries(), [["F", 6], ["A", 1], ["E", 5]], "After adding 'F', 'D' should be evicted");

  eq(cache.get("D"), undefined, "'D' should have been evicted");
  eq(cache.size(), 3, "Cache size should still be 3");
});

export const LRUCache_13_type_safety = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 12: Type safety
  const cache = new LRUCacheMap<string, number | string>(5);
  cache.put("num", 42);
  cache.put("str", "hello");
  eq(cache.get("num"), 42, "Should store and retrieve number correctly");
  eq(cache.get("str"), "hello", "Should store and retrieve string correctly");

  // Note: TypeScript errors cannot be checked at runtime, so we're just ensuring the operations are valid
  cache.put("valid", 123);
  cache.put("alsoValid", "world");
  eq(cache.size(), 4, "Cache should contain all valid entries");
});

export const LRUCache_14_capacity_change = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 14: Changing cache capacity
  const cache = new LRUCacheMap<string, number>(3);
  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);

  eq(cache.size(), 3, "Cache should have 3 items");

  cache.setCapacity(2);

  eq(cache.size(), 2, "Cache should now have 2 items after capacity reduction");
  eq(cache.get("a"), undefined, "Least recently used item should be evicted");
  eq(cache.get("b"), 2, "More recently used items should remain");
  eq(cache.get("c"), 3, "Most recently used item should remain");

  cache.setCapacity(4);
  cache.put("d", 4);
  cache.put("e", 5);

  eq(cache.size(), 4, "Cache should now have 4 items after capacity increase");
  eq(cache.get("b"), 2, "Previously added items should still be present");
});

export const LRUCache_15_concurrent_operations = test('LRUCacheMap', ({ l, a: { eq, is } }) => {
  // Test 15: Simulating concurrent operations
  const cache = new LRUCacheMap<string, number>(3);

  cache.put("a", 1);
  cache.get("a");
  cache.put("b", 2);
  cache.delete("a");
  cache.put("c", 3);
  cache.get("b");
  cache.put("d", 4);

  eq(cache.size(), 3, "Cache size should be 3 after concurrent-like operations");
  eq(cache.get("a"), undefined, "Deleted item should not be present");
  eq(cache.get("b"), 2, "Item 'b' should be present and have correct value");
  eq(cache.get("c"), 3, "Item 'c' should be present and have correct value");
  eq(cache.get("d"), 4, "Item 'd' should be present and have correct value");
});

export const LRUCache_16_large_capacity = test('LRUCacheMap', ({ l, a: { eq, is } }) => {
  // Test 16: Performance with large capacity
  const largeCapacity = 100000;
  const cache = new LRUCacheMap<number, number>(largeCapacity);

  for (let i = 0; i < largeCapacity; i++) {
    cache.put(i, i * 2);
  }

  eq(cache.size(), largeCapacity, "Cache should contain all inserted items");
  eq(cache.get(50000), 100000, "Should retrieve correct value for middle item");

  cache.put(largeCapacity, largeCapacity * 2);
  eq(cache.get(0), undefined, "First inserted item should be evicted");
  eq(cache.get(1), 2, "Second item should still be present");
});

export const LRUCache_17_stress_test = test('LRUCacheMap', ({ l, a: { eq } }) => {
  // Test 17: Stress test with repeated operations
  const cache = new LRUCacheMap<number, number>(1000);
  const operations = 1000000;

  for (let i = 0; i < operations; i++) {
    const key = i % 2000;
    if (i % 2 === 0) {
      cache.put(key, i);
    } else {
      cache.get(key);
    }
  }

  eq(cache.size(), 1000, "Cache size should be at capacity after stress test");
});

export const LRUCache_18_complex_keys_values = test('LRUCacheMap', ({ l, a: { eqO, eq } }) => {
  // Test 18: Complex object keys and values
  const cache = new LRUCacheMap<{ id: number; }, { data: string[]; }>(2);

  const key1 = { id: 1 };
  const value1 = { data: ['a', 'b', 'c'] };
  const key2 = { id: 2 };
  const value2 = { data: ['d', 'e', 'f'] };

  cache.put(key1, value1);
  cache.put(key2, value2);

  eqO(cache.get(key1), value1, "Should retrieve correct complex value for key1");
  eqO(cache.get(key2), value2, "Should retrieve correct complex value for key2");

  const key3 = { id: 3 };
  const value3 = { data: ['g', 'h', 'i'] };
  cache.put(key3, value3);

  eq(cache.get(key1), undefined, "First inserted complex key-value should be evicted");
});

export const LRUCache_19_entries = test('LRUCacheMap', ({ l, a: { eq, is } }) => {
  // Test 19: Verify entries() method
  const cache = new LRUCacheMap<string, number>(3);

  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.get("a");

  const entries = Array.from(cache.entries());
  eq(entries.length, 3, "Entries should contain all items");
  is(entries.some(([k, v]) => k === "a" && v === 1), "Entries should contain ['a', 1]");
  is(entries.some(([k, v]) => k === "b" && v === 2), "Entries should contain ['b', 2]");
  is(entries.some(([k, v]) => k === "c" && v === 3), "Entries should contain ['c', 3]");
});

export const LRUCache_20_non_string_keys = test('LRUCacheMap', ({ l, a: { eq, is } }) => {
  // Test 20: Non-string, non-numeric keys
  const cache = new LRUCacheMap<symbol, string>(2);

  const key1 = Symbol('key1');
  const key2 = Symbol('key2');

  cache.put(key1, "value1");
  cache.put(key2, "value2");

  eq(cache.get(key1), "value1", "Should retrieve correct value for symbol key1");
  eq(cache.get(key2), "value2", "Should retrieve correct value for symbol key2");

  const key3 = Symbol('key3');
  cache.put(key3, "value3");

  eq(cache.get(key1), undefined, "First inserted symbol key should be evicted");
});

export const LRUCache_21_cleanup_callback = test('LRUCacheMap', ({ l, a: { eq, eqO } }) => {
  // Test 21: Cleanup callback functionality
  const evictedItems: [string, number][] = [];
  const cleanupCallback = (key: string, value: number) => {
    evictedItems.push([key, value]);
  };

  const cache = new LRUCacheMap<string, number>(3, cleanupCallback);

  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.put("d", 4);

  eqO(evictedItems, [["a", 1]], "First item should be evicted");

  cache.put("e", 5);
  eqO(evictedItems, [["a", 1], ["b", 2]], "Second item should be evicted");

  cache.setCapacity(1);
  eqO(evictedItems, [["a", 1], ["b", 2], ["c", 3], ["d", 4]], "Items should be evicted when capacity is reduced");

  eq(cache.get("e"), 5, "Last item should remain in cache");
});

export const LRUCache_22_performance_benchmark = test('LRUCacheMap', ({ l, a: { is, lt, gt } }) => {
  // Test 21: Performance benchmark to confirm O(1) operation runtime
  const cache = new LRUCacheMap<number, number>(50000);
  const iterations = 10000;

  // Measure put operation
  const startPut = performance.now();
  for (let i = 0; i < iterations; i++) {
    cache.put(i, i);
  }
  const endPut = performance.now();
  const putTime = endPut - startPut;

  // Measure get operation
  const startGet = performance.now();
  for (let i = 0; i < iterations; i++) {
    cache.get(i);
  }
  const endGet = performance.now();
  const getTime = endGet - startGet;

  // Calculate average time per operation
  const avgPutTime = putTime / iterations;
  const avgGetTime = getTime / iterations;

  l(`Average put time: ${avgPutTime.toFixed(9)} ms`);
  l(`Average get time: ${avgGetTime.toFixed(9)} ms`);

  // Check if operations are roughly constant time
  // We'll consider it constant time if the average operation time is less than 0.0001 ms
  lt(avgPutTime, 0.0005, "Each put operation should run fairly quickly");
  lt(avgGetTime, 0.0005, "ditto for get operations");

  // Additional check: Perform operations on a smaller cache and compare times
  const smallCache = new LRUCacheMap<number, number>(100);
  const smallIterations = 10000;

  const startSmallPut = performance.now();
  for (let i = 0; i < smallIterations; i++) {
    smallCache.put(i % 100, i);
  }
  const endSmallPut = performance.now();
  const smallPutTime = (endSmallPut - startSmallPut) / smallIterations;

  const startSmallGet = performance.now();
  for (let i = 0; i < smallIterations; i++) {
    smallCache.get(i % 100);
  }
  const endSmallGet = performance.now();
  const smallGetTime = (endSmallGet - startSmallGet) / smallIterations;

  l(`Average small cache put time: ${smallPutTime.toFixed(9)} ms`);
  l(`Average small cache get time: ${smallGetTime.toFixed(9)} ms`);

  // Check if the operation times for the small cache are similar to the large cache
  // We'll consider them similar if they're within a smaller range
  lt(avgPutTime / smallPutTime, 8, "Put operation time should be similar for different cache sizes", avgPutTime, smallPutTime);
  gt(avgPutTime / smallPutTime, 0.1, "Put operation time should be similar for different cache sizes", avgPutTime, smallPutTime);
  // Put operation time should be similar for different cache sizes
  lt(avgGetTime / smallGetTime, 8, "Get operation time should be similar for different cache sizes", avgGetTime, smallGetTime);
  gt(avgGetTime / smallGetTime, 0.1, "Get operation time should be similar for different cache sizes", avgGetTime, smallGetTime);
  // Get operation time should be similar for different cache sizes
});

export const LRUCache_23_multiple_cleanup_calls = test('LRUCacheMap', ({ l, a: { eq, eqO } }) => {
  // Test 23: Multiple cleanup calls when resizing
  const evictedItems: [string, number][] = [];
  const cleanupCallback = (key: string, value: number) => {
    evictedItems.push([key, value]);
  };

  const cache = new LRUCacheMap<string, number>(5, cleanupCallback);

  cache.put("a", 1);
  cache.put("b", 2);
  cache.put("c", 3);
  cache.put("d", 4);
  cache.put("e", 5);

  eqO(evictedItems, [], "No items should be evicted initially");

  cache.setCapacity(3);
  eqO(evictedItems, [["a", 1], ["b", 2]], "Two items should be evicted when capacity is reduced to 3");

  cache.setCapacity(1);
  eqO(evictedItems, [["a", 1], ["b", 2], ["c", 3], ["d", 4]], "Two more items should be evicted when capacity is further reduced to 1");

  eq(cache.get("e"), 5, "Last item should remain in cache");
  eq(cache.size(), 1, "Cache size should be 1");

  cache.setCapacity(0);
  eqO(evictedItems, [["a", 1], ["b", 2], ["c", 3], ["d", 4], ["e", 5]], "Last item should be evicted when capacity is set to 0");
  eq(cache.size(), 0, "Cache should be empty");
});

import { lexAnsi } from '../terminal/ansi-parse.js';

export const LRUCache_24_toString_output = test('LRUCacheMap', ({ l, a: { includes } }) => {
  // Test 24: Verify toString() output
  const cache = new LRUCacheMap<string, number>(3);

  // Empty cache
  let output = cache.toString();
  l("Empty cache:", output);
  const cleanedOutput = lexAnsi(output).cleaned[0];
  includes(cleanedOutput, 'size: 0', "Empty cache should show size 0");
  includes(cleanedOutput, 'capacity: 3', "Empty cache should show capacity 3");
  includes(cleanedOutput, 'mru: "empty"', "Empty cache should show MRU as empty");
  includes(cleanedOutput, 'lru: "empty"', "Empty cache should show LRU as empty");

  // Add one item
  cache.put("a", 1);
  output = cache.toString();
  l("Cache with one item:", output);
  const cleanedOneItem = lexAnsi(output).cleaned[0];
  includes(cleanedOneItem, 'size: 1', "Cache with one item should show size 1");
  includes(cleanedOneItem, 'mru: { key: "a", value: 1 }', "Cache with one item should show correct MRU");
  includes(cleanedOneItem, 'lru: { key: "a", value: 1 }', "Cache with one item should show correct LRU");

  // Add more items
  cache.put("b", 2);
  cache.put("c", 3);
  output = cache.toString();
  l("Full cache:", output);
  const cleanedFull = lexAnsi(output).cleaned[0];
  includes(cleanedFull, 'size: 3', "Full cache should show size 3");
  includes(cleanedFull, 'mru: { key: "c", value: 3 }', "Full cache should show correct MRU");
  includes(cleanedFull, 'lru: { key: "a", value: 1 }', "Full cache should show correct LRU");

  // Access least recently used item
  cache.get("a");
  output = cache.toString();
  l("Cache after accessing LRU:", output);
  const cleanedAfterAccess = lexAnsi(output).cleaned[0];
  includes(cleanedAfterAccess, 'mru: { key: "a", value: 1 }', "Cache should show updated MRU after accessing LRU");
  includes(cleanedAfterAccess, 'lru: { key: "b", value: 2 }', "Cache should show updated LRU after accessing previous LRU");

  // Exceed capacity
  cache.put("d", 4);
  output = cache.toString();
  l("Cache after exceeding capacity:", output);
  const cleanedExceeded = lexAnsi(output).cleaned[0];
  includes(cleanedExceeded, 'size: 3', "Cache should maintain size after exceeding capacity");
  includes(cleanedExceeded, 'mru: { key: "d", value: 4 }', "Cache should show new item as MRU");
  includes(cleanedExceeded, 'lru: { key: "c", value: 3 }', "Cache should show correct LRU after eviction");
});

