import { random_books } from '$lib/book.js';

export function get() {
  return random_books()
}