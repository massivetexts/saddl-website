import { neighbors } from "$lib/book.js";

function parse_item(meta) {
  /* Parse a single row of relationships to get additional information */
  // TODO author probs missing because of key class with meta
  meta.diff = meta.grsim + meta.simdiff + meta.randdiff;
  meta.sw = meta.swsm + meta.swde;

  let probs = (function ({ swsm, swde, wp_dv, partof, contains, OVERLAPS, diff }) {
    return { swsm, swde, wp_dv, partof, contains, OVERLAPS, diff };
  })(meta);

  meta.guess = Object.keys(probs).reduce((x, y) => (probs[x] > probs[y] ? x : y));
  return meta;
}
/*
    if (!organized[guess]) {
      organized[guess] = [];
    }
    organized[guess].push(rel);
    */

function build_dataset(htid, rels) {
  let dataset = { volume: htid };
  dataset.related_metadata = {
    years: [],
    titles: [],
    oclc: [],
    enumchron: [],
    titles_within: [],
    titles_that_contain: [],
  };
  let relationships = {
    identical_works: [],
    possibly_identical_works: [],
    other_expressions: [],
    possibly_other_expressions: [],
    other_volumes: [],
    contains: [],
    is_part_of: [],
  };

  for (let rel of rels) {
    rel.confidence = rel[rel.guess];
    if (rel.swsm > 0.6) {
      relationships.identical_works.push(rel);
    } else if (rel.guess === "swsm") {
      relationships.possibly_identical_works.push(rel);
    } else if (rel.swde > 0.6) {
      relationships.other_expressions.push(rel);
    } else if (rel.guess === "swse") {
      relationships.possibly_other_expressions.push(rel);
    } else if (rel.guess == "wp_dv") {
      relationships.other_volumes.push(rel);
    } else if (rel.guess == "contains") {
      relationships.contains.push(rel);
    } else if (rel.guess == "partof") {
      relationships.is_part_of.push(rel);
    }
    // Only use when SWSM + SWDE confidence > 60%
    if (rel.sw > 0.6) {
      dataset.related_metadata.titles.push(rel.title);
    }
  }

  // Sort each section by confidence
  for (let key of Object.keys(relationships)) {
    if (relationships[key].length > 1) {
      relationships[key].sort((a, b) => b.confidence - a.confidence);
    }
  }

  dataset.relationships = relationships;
  return dataset;
}

export function get({ params }) {
  let neighbor = neighbors(params.htid);
  return neighbor.then(function (relationships) {
    let rels = relationships.map(parse_item);
    let dataset = build_dataset(params.htid, rels);
    return { body: JSON.stringify(dataset) };
  });
}
