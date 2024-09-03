import { JSDOM } from 'jsdom';

// Create a new JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const { document } = dom.window;

// Make document global
globalThis.document = document;
