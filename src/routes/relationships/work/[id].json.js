import { neighbors } from "$lib/book.js";

export function get({ params }) {
  return neighbors(params.id);
}
