import { random_books, random_work_listing } from "$lib/book.js";
export function get({ params }) {
  if (params.level == "htid") {
    return random_books().then(function (x) {
      return { body: JSON.stringify(x) };
    });
  } else if (params.level == "work") {
    return random_work_listing().then(function (x) {
      return { body: JSON.stringify(x) };
    });
  }
}
