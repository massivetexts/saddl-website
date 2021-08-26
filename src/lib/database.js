import pkg from 'pg';
const { native } = pkg;

console.log("Regenerating database connection");
export const client = new native.Client({
  host: "localhost",
  database: "saddl",
  port: 5432, //default postgres port
});
client.connect();
console.log("Connected");
export const con = client;

/*
import duckdb from "duckdb";
const db = new duckdb.Database("/drobo/saddl/dataset/saddl.duckdb");
export const con = db.connect();*/
