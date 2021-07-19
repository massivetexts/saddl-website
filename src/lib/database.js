
import duckdb from 'duckdb';
console.log("Regenerating database connection")
const db = new duckdb.Database("/drobo/saddl/dataset/saddl.duckdb")
console.log("Regenerated")
export const con = db.connect();
console.log("Connected")