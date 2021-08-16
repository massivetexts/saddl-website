import { neighbors } from "$lib/book.js";

function parse_item(meta) {
  /* Parse a single row of relationships to get additional information */
  // TODO author probs missing because of key class with meta
  meta.diff = meta.authorclass + meta.grsim + meta.simdiff + meta.randdiff;
  meta.sw = meta.swsm + meta.swde;

  // recalculated relatedness
  let relatedness_weights = {
    swsm: 1,
    swde: 0.7,
    wp_dv: 0.7,
    partof: 0.6,
    contains: 0.6,
    overlaps: 0.6,
    authorclass: 0.3,
    simdiff: 0.1,
    grsim: 0.4,
    randdiff: 0,
  };
  let weighted_sum = Object.keys(relatedness_weights)
    .map((x) => meta[x] * relatedness_weights[x])
    .reduce((x, y) => x + y);
  meta.relatedness = weighted_sum / Object.values(relatedness_weights).reduce((x, y) => x + y);

  let probs = (function ({ swsm, swde, wp_dv, partof, contains, overlaps, diff }) {
    return { swsm, swde, wp_dv, partof, contains, overlaps, diff };
  })(meta);

  meta.guess = Object.keys(probs).reduce((x, y) => (probs[x] > probs[y] ? x : y));
  return meta;
}

function build_dataset(id, rels, level = "htid") {
  let dataset = {};
  if (level == "htid") {
    dataset["volume"] = id;
  } else if (level == "work") {
    dataset["work"] = id;
  }
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
      if (level == "work") {
        // If operating on the work level, there shouldn't be a distinction between
        // between swde and swsm - they're all considered SW!
        relationships.identical_works.push(rel);
      } else {
        relationships.other_expressions.push(rel);
      }
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
  recommendations.books = recommendations.books
    .filter((d) => d.relatedness > 0.05)
    .sort((a, b) => b.relatedness - a.relatedness);
  recommendations.books.length = Math.min(recommendations.books.length, 20);

  dataset.related_metadata = related_metadata;
  dataset.relationships = relationships;
  dataset.recommendations = recommendations;
  return dataset;
}

export function get({ params }) {
  let neighbor = neighbors(params.id, (level = params.level));
  return neighbor.then(function (relationships) {
    let rels = relationships
      .filter(function (x) {
        if ("include" in x) {
          return x.include;
        } else {
          return true;
        }
      })
      .map(parse_item);
    let dataset = build_dataset(params.id, rels, (level = params.level));
    return { body: JSON.stringify(dataset) };
  });
}
