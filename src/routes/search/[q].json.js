import { simple_search } from "$lib/book.js";

export function get({ params }) {
  let results = simple_search(params.q, "work");
  return results.then(function (items) {
    return { body: JSON.stringify(items) };
  });
}
