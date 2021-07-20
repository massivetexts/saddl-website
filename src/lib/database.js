
import duckdb from 'duckdb';
console.log("Regenerating database connection");
const db = new duckdb.Database("saddl.duckdb");
db.all('CREATE INDEX htid_idx ON meta (htid);', function(err, res) {
    if (err) {
      throw err;
    }
  });
db.all('CREATE INDEX target_idx ON clean_predictions (target);', function(err, res) {
    if (err) {
        throw err;
    }
});
export const con = db.connect();