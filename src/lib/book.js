import { con } from "./database.js";

function decode(str) {
  return decodeURIComponent(str).replaceAll("====", "/");
}

const encode = (str) => encodeURIComponent(str.replaceAll("/", "===="));

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
    query = `SELECT * FROM "meta" WHERE "htid"=$1 LIMIT 1;`;
  } else {
    // how do you throw any error properly?
  }
  const params = [decode(id)];
  const val = run_query(con, query, params);
  return { body: JSON.stringify((await val)[0]) };
}

export async function random_books() {
  const query = `
  SELECT htid, "title", "meta"."author" author
  FROM meta
  WHERE RANDOM() < .00005
    AND EXISTS(SELECT target FROM clean_predictions b WHERE b."target" = meta.htid)
  LIMIT 20`;
  const val = run_query(con, query);
  return { body: JSON.stringify(await val) };
}

export async function neighbors(id) {
  const query = `SELECT *
  FROM clean_predictions 
  INNER JOIN meta ON (meta.htid = clean_predictions.candidate) 
  WHERE "target"=$1;`;
  const params = [decode(id)];
  const val = run_query(con, query, params);
  return { body: JSON.stringify(await val) };
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
  return { body: JSON.stringify(await val) };
}
