import { metadata, cluster_members } from "$lib/book.js";

export function get({ params }) {
  let meta = metadata(params.id, params.level);
  if (params.level === "htid") {
    return meta.then(function (x) {
      let dataset = { metadata: x[0] };
      return { body: JSON.stringify(dataset) };
    });
  } else if (params.level === "work" || params.level === "man") {
    let members = cluster_members(params.id, params.level);
    let all = Promise.all([meta, members]).then((values) => {
      let dataset;
      dataset = {
        metadata: values[0][0],
        members: values[1],
      };
      return { body: JSON.stringify(dataset) };
    });
    return all;
  } else {
    // TODO throw exception
  }
}
