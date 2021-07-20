import { con } from './database.js';

function run_query(con, query) {
  return new Promise((resolve, reject) => {
      con.all(query, function(err, res = undefined) {
        if (err) {
          reject(err)
        }
        if (res && res.length) {
          resolve(res)
        } else {
          reject("query failed.")
        }
      }); 
  })
  return val;
}

export async function metadata(id) {
  const query = `SELECT * FROM "meta" WHERE "htid"='${id}' LIMIT 1;`;
  const val = run_query(con, query);
  return {body: JSON.stringify((await val)[0])}
}

export async function random_books() {
  const query = `
  SELECT htid, "title", "meta"."author" author FROM
  "meta" WHERE RANDOM() < .00005 AND EXISTS(SELECT "target" FROM clean_predictions b WHERE b."target" = meta.htid)
   LIMIT 20`;
  const val = run_query(con, query);
  return {body: JSON.stringify(await val)}
}


export async function neighbors(id) {
  const query = `SELECT * FROM clean_predictions INNER JOIN meta ON (meta.htid = clean_predictions.candidate) WHERE target='${id}';`;
  const val = run_query(con, query);
  return {body: JSON.stringify(await val)}
}