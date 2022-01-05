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
      let metadata = values[0][0];
      let members = values[1];
      members.map(function (x) {
        x.best_copy = x.htid === metadata.best_centroid;
        x.best_copy_pd = x.htid === metadata.best_centroid_pd;
      });
      if (metadata.htid == null) {
        // if there's no best centroid, use the first member's metadata
        metadata = Object.assign(metadata, members[0]);
      }
      dataset = {
        metadata: metadata,
        members: members,
      };
      return { body: JSON.stringify(dataset) };
    });
    return all;
  } else {
    // TODO throw exception
  }
}
