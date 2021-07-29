import { con } from "./database.js";
import { decode } from "./utils.js";

const table_ref = {
  work: {
    predictions: "work_predictions",
    stats: "work_stats",
    id_col: "work_id",
  },
  man: {
    predictions: "manifestation_predictions",
    stats: "manifestation_stats",
    id_col: "man_id",
  },
};
function run_query(con, query, params = []) {
  // Wraps a query as a promise.
  return new Promise((resolve, reject) => {
    // For Duckdb, this should be con.all
    // for postgres, wrapping in a new promise is unecessary (?) because it
    // has promises built in, but I didn't want to deviate too far from OG code.
    con.query(query, params, function (err, res = undefined) {
      if (err) {
        reject(err);
      }
      if (res && res.rows && res.rows.length) {
        resolve(res.rows);
      } else {
        reject("query failed.");
      }
    });
  });
}

export async function metadata(id, level = "htid") {
  let query;
  if (level === "htid") {
    query = `SELECT * FROM meta
    JOIN clusters ON clusters.htid = meta.htid
    WHERE clusters.htid=$1;`;
  } else if (level === "work" || level === "man") {
    const { stats, id_col } = table_ref[level];
    query = `SELECT 
    clusters.work_id, clusters.man_id, ${stats}.label_count, ${stats}.include, ${stats}.best_centroid, ${stats}.best_centroid_pd,
    meta.*
    FROM ${stats}
    JOIN meta ON meta.htid = best_centroid
    JOIN clusters on clusters.htid = best_centroid
    WHERE ${stats}.${id_col} = $1;
    `;
  }
  const params = [decode(id)];
  const val = run_query(con, query, params);
  return await val;
}

export async function random_books() {
  const query = `
  SELECT meta.htid, meta.title, meta.author, meta.description, meta.rights_date_used
  FROM meta
  JOIN clusters ON clusters.htid = meta.htid
  JOIN work_stats ON clusters.work_id = work_stats.work_id
  WHERE RANDOM() < .0005
    AND gov_prop < 0.5 AND serial_prop <0.5 AND label_count > 2
  LIMIT 20`;
  const val = run_query(con, query);
  return await val;
}

export async function cluster_members(id, level) {
  let query;
  let meta_cols = "meta.htid, meta.title, meta.author, meta.description, meta.rights_date_used, meta.access, meta.isbn";
  if (level == "work" || level == "man") {
    const { id_col } = table_ref[level];
    query = `SELECT clusters.${id_col}, ${meta_cols} FROM clusters 
    JOIN meta ON meta.htid=clusters.htid
    WHERE work_id = $1;`;
  }
  const val = run_query(con, query, [id]);
  return await val;
}

export async function simple_search(q, field) {
  const query = `SELECT * FROM meta WHERE 
  to_tsvector('simple', $1) @@ plainto_tsquery('simple', $2) limit 100;
  `;
  const val = run_query(con, query, [q, field]);
  return await val;
}

export async function neighbors(id, level = "htid") {
  let query;
  let prediction_cols = `p.target, p.candidate, p.swsm, p.swde, p.wp_dv, p.partof, p.contains,
  p.author AS authorclass, p.simdiff, p.grsim, p.randdiff, p.count`;
  let meta_cols = `meta.htid, meta.author, meta.title, meta.description, meta.oclc_num, meta.rights_date_used,
  meta.access, meta.rights, meta.ht_bib_key, meta.isbn, meta.issn, meta.page_count,
  meta.lang, meta.bib_fmt, meta.us_gov_doc_flag`;

  if (level === "htid") {
    query = `
      SELECT ${prediction_cols}, p."OVERLAPS" AS "overlaps", p.relatedness, ${meta_cols}
      FROM clean_predictions AS p
      INNER JOIN meta ON (meta.htid = p.candidate) 
      WHERE "target"=$1;`;
    id = decode(id);
  } else if (level == "work" || level == "man") {
    const { stats, predictions, id_col } = table_ref[level];

    query = `
      SELECT ${prediction_cols},
          p."overlaps" AS "overlaps", ${meta_cols}, label_count, include
      FROM ${predictions} AS p
      JOIN ${stats} ON ${stats}.${id_col} = p.candidate
      JOIN meta ON meta.htid = ${stats}.best_centroid
      WHERE "target"=$1;`;
  } else {
    //TODO #10 error handling when level is wrong
  }
  const params = [id];
  const val = run_query(con, query, params);
  return await val;
}

export async function random_work_listing(level = "work") {
  // Right now, this uses the first htid for the work listing. Eventually
  // we can use the 'best' copy or an inferred 'most common title'
  let id_col;
  let stats_table;
  if (level == "work") {
    id_col = "work_id";
    stats_table = "work_stats";
  } else if (level == "man") {
    id_col = "man_id";
    stats_table = "manifestation_stats";
  }
  const query = `
  SELECT ${stats_table}.${id_col}, label_count, title, author, description, rights_date_used 
  FROM ${stats_table}
  LEFT JOIN clusters ON clusters.${id_col} = ${stats_table}.${id_col}
  INNER JOIN meta ON clusters.htid = meta.htid
  WHERE gov_prop < 0.5 AND serial_prop <0.5 AND label_count > 2
    AND RANDOM() < .0005
  LIMIT 20;`;
  const val = run_query(con, query);
  return await val;
}
