import duckdb from "duckdb";
console.log("Regenerating database connection");
const db = new duckdb.Database("/drobo/saddl/dataset/saddl.duckdb");
console.log("Regenerated");
db.all("CREATE INDEX htid_idx ON meta (htid);", function (err, res) {
  if (err) {
    throw err;
  }
});
db.all(
  "CREATE INDEX target_idx ON clean_predictions (target);",
  function (err, res) {
    if (err) {
      throw err;
    }
  }
);
console.log("Connected");
export const con = db.connect();
