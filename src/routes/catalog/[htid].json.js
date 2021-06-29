import { metadata } from "$lib/book.js";

export function get({params}) {
  return metadata(params.htid)
}