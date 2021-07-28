import { random_books, random_work_listing } from "$lib/book.js";
export function get({ params }) {
  console.log(params);
  if (params.level == "htid") {
    return random_books();
  } else if (params.level == "work") {
    return random_work_listing();
  }
}
