import { metadata, cluster_members } from "$lib/book.js";

export function get({ params }) {
  let meta = metadata(params.id, (level = params.level));
  if (level === "htid") {
    return meta.then(function (x) {
      return { body: JSON.stringify(x[0]) };
    });
  } else if (level === "work") {
    let members = cluster_members(params.id, (level = params.level));

    let all = Promise.all([meta]).then((values) => {
      let dataset;
      dataset = values[0];
      console.log(values);
      return { body: JSON.stringify(dataset[0]) };
    });
    return all;
  }
}
