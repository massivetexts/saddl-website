
import duckdb from 'duckdb';
console.log("Regenerating database connection")
const db = new duckdb.Database("/drobo/hathi_db")
export const con = db.connect();