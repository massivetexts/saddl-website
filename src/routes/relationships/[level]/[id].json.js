import { neighbors } from "$lib/book.js";

function parse_item(meta) {
  /* Parse a single row of relationships to get additional information */
  // TODO author probs missing because of key class with meta
  meta.diff = meta.authorclass + meta.grsim + meta.simdiff + meta.randdiff;
  meta.sw = meta.swsm + meta.swde;

  let probs = (function ({ swsm, swde, wp_dv, partof, contains, overlaps, diff }) {
    return { swsm, swde, wp_dv, partof, contains, overlaps, diff };
  })(meta);

  meta.guess = Object.keys(probs).reduce((x, y) => (probs[x] > probs[y] ? x : y));
  return meta;
}

function build_dataset(htid, rels) {
  let dataset = { volume: htid };
  let related_metadata = {
    years: [],
    titles: [],
    oclc: [],
    enumchron: [],
    titles_within: [],
    titles_that_contain: [],
  };
  let relationships = {
    identical_works: [],
    other_expressions: [],
    other_volumes: [],
    contains: [],
    overlaps: [],
    is_part_of: [],
  };

  //TODO #9 include authors in recommendations
  let recommendations = { books: [], authors: [] };

  for (let rel of rels) {
    rel.confidence = rel[rel.guess];
    if (rel.swsm > 0.6) {
      relationships.identical_works.push(rel);
    } else if (rel.guess == "swde" || rel.guess == "swsm") {
      relationships.other_expressions.push(rel);
      rel.confidence = rel["sw"];
    } else if (rel.guess == "wp_dv") {
      relationships.other_volumes.push(rel);
    } else if (rel.guess == "contains") {
      relationships.contains.push(rel);
      if (rel.title) {
        related_metadata.titles_that_contain.push(rel.title);
      }
    } else if (rel.guess == "overlaps") {
      relationships.overlaps.push(rel);
    } else if (rel.guess == "partof") {
      relationships.is_part_of.push(rel);
      if (rel.title) {
        related_metadata.titles_within.push(rel.title);
      }
    } else {
      recommendations.books.push(rel);
    }
    // Only use when SWSM + SWDE confidence > 60%
    if (rel.sw > 0.6) {
      if (rel.title) {
        related_metadata.titles.push(rel.title);
      }
      if (rel.rights_date_used) {
        related_metadata.years.push(rel.rights_date_used);
      }
      if (rel.oclc_num) {
        related_metadata.oclc.push(rel.oclc_num);
      }
      if (rel.description) {
        related_metadata.enumchron.push(rel.description);
      }
    }

    // deduplicate
    for (let key of Object.keys(related_metadata)) {
      related_metadata[key] = [...new Set(related_metadata[key])];
    }
  }

  // Sort each section by confidence
  for (let key of Object.keys(relationships)) {
    if (relationships[key].length > 1) {
      relationships[key].sort((a, b) => b.confidence - a.confidence);
    }
  }

  // Filter and sort recommendations
  // TODO #8 shouldn't return works by the same authors
  recommendations.books.filter((d) => d.relatedness > 0.05).sort((a, b) => b.relatedness - a.relatedness);

  dataset.related_metadata = related_metadata;
  dataset.relationships = relationships;
  dataset.recommendations = recommendations;
  return dataset;
}

export function get({ params }) {
  let neighbor = neighbors(params.id);
  return neighbor.then(function (relationships) {
    let rels = relationships.map(parse_item);
    let dataset = build_dataset(params.id, rels);
    return { body: JSON.stringify(dataset) };
  });
}
