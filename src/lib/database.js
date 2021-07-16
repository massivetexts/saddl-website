
import duckdb from 'duckdb';
console.log("Regenerating database connection")
const db = new duckdb.Database("saddl.duckdb")
export const con = db.connect();