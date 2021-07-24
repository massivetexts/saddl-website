import * as pg from "pg";
const { Pool, Client } = pg;

console.log("Regenerating database connection");
export const client = new Client({
  user: "saddl",
  host: "localhost",
  database: "saddl",
  //password: 'secretpassword',
  port: 5432, //default postgres port
});
client.connect();
console.log("Connected");
export const con = client;

/*
import duckdb from "duckdb";
const db = new duckdb.Database("/drobo/saddl/dataset/saddl.duckdb");
db.all("CREATE INDEX htid_idx ON meta (htid);", function (err, res) {
  if (err) {
    throw err;
  }
});
db.all("CREATE INDEX target_idx ON clean_predictions (target);", function (err, res) {
  if (err) {
    throw err;
  }
});
export const con = db.connect();*/
