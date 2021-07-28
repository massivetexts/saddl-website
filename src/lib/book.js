import { con } from "./database.js";
import { decode, encode } from "./utils.js";

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
  } else if (level === "work") {
    query = `SELECT 
    work_stats.label_count, work_stats.include, work_stats.best_centroid, work_stats.best_centroid_pd,
    meta.*
    FROM work_stats
    JOIN meta ON meta.htid = best_centroid
    WHERE work_id = $1;
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
  if (level == "work") {
    query = `SELECT clusters.man_id, ${meta_cols} FROM clusters 
    JOIN meta ON meta.htid=clusters.htid
    WHERE work_id = $1;`;
  } else if (level == "manifestation") {
    query = `SELECT clusters.work_id, ${meta_cols} FROM clusters 
    JOIN meta ON meta.htid=clusters.htid
    WHERE man_id = $1;`;
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
  } else if (level == "work") {
    query = `
      SELECT ${prediction_cols},
          p."overlaps" AS "overlaps", ${meta_cols}, label_count, include
      FROM work_predictions AS p
      JOIN work_stats ON work_stats.work_id = p.candidate
      JOIN meta ON meta.htid = work_stats.best_centroid
      WHERE "target"=$1;`;
  } else {
    //TODO #10 error handling when level is wrong
  }
  const params = [id];
  const val = run_query(con, query, params);
  return await val;
}

export async function random_work_listing() {
  // Right now, this uses the first htid for the work listing. Eventually
  // we can use the 'best' copy or an inferred 'most common title'
  const query = `
  SELECT work_stats.work_id, label_count, title, author, description, rights_date_used 
  FROM work_stats
  LEFT JOIN clusters ON clusters.work_id = work_stats.work_id
  INNER JOIN meta ON clusters.htid = meta.htid
  WHERE gov_prop < 0.5 AND serial_prop <0.5 AND label_count > 2
    AND RANDOM() < .0005
  LIMIT 20;`;
  const val = run_query(con, query);
  return await val;
}
