import { con } from "./database.js";

function decode(str) {
  return decodeURIComponent(str).replaceAll("====", "/");
}

const encode = (str) => encodeURIComponent(str.replaceAll("/", "===="));

function run_query(con, query) {
  // Wraps a query as a promise.
  return new Promise((resolve, reject) => {
    con.all(query, function (err, res = undefined) {
      if (err) {
        reject(err);
      }
      if (res && res.length) {
        resolve(res);
      } else {
        reject("query failed.");
      }
    });
  });
}

export async function metadata(id) {
  const query = `SELECT * FROM "meta" WHERE "htid"='${decode(id)}' LIMIT 1;`;
  const val = run_query(con, query);
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
  WHERE "target"='${decode(id)}';`;
  const val = run_query(con, query);
  return { body: JSON.stringify(await val) };
}

export async function random_work_listing() {
  // Right now, this uses the first htid for the work listing. Eventually
  // we can use the 'best' copy or an inferred 'most common title'
  const query = `
  SELECT work_stats.work_id, label_count, title, author, description, rights_date_used 
  FROM work_stats
  LEFT JOIN clusters on clusters.work_id == work_stats.work_id
  INNER JOIN meta ON clusters.htid == meta.htid
  WHERE gov_prop < 0.5 AND serial_prop <0.5 AND label_count > 2
  LIMIT 5;`;
  const val = run_query(con, query);
  return { body: JSON.stringify(await val) };
}
