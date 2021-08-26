import { random_books, random_work_listing } from "$lib/book.js";
export function get({ params }) {
  if (params.level == "htid") {
    return random_books().then(function (x) {
      return { body: JSON.stringify(x) };
    });
  } else if (params.level == "work" || params.level == "man") {
    return random_work_listing(params.level).then(function (x) {
      return { body: JSON.stringify(x) };
    });
  }
}
