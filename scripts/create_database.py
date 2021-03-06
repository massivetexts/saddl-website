# ---
# jupyter:
#   jupytext:
#     text_representation:
#       extension: .py
#       format_name: light
#       format_version: '1.5'
#       jupytext_version: 1.8.2
#   kernelspec:
#     display_name: Python 3
#     language: python
#     name: python3
# ---

import duckdb
import sys

try:
    dbname, hfiles, LOCATION_OF_COMPARE_FILES = sys.argv[1:]
except IndexError:
    print("usage: python create_database.py dnname hathifile_parquet_location dir_with_compare_files")
    exit(1)


dathi = duckdb.connect(dbname)

# +
# Creat hathifiles table--I don't have the code handy, but the important thing is that it's a parquet where every column is 
# of string type, regardless of the underlying data.
# -

dathi.execute(f"CREATE TABLE hathifiles AS SELECT * FROM parquet_scan('{hfiles}') ORDER BY htid")

dathi.execute("CREATE UNIQUE INDEX htid ON hathifiles (htid)")

# +
# Create relationships Table

# +
import pyarrow as pa
from pyarrow import parquet
from htrc_features import utils

from pathlib import Path

codes = ["SWSM", "SWDE", "WP_DV", "PARTOF", "CONTAINS", "OVERLAPS", "AUTHOR", "SIMDIFF", "GRSIM", "RANDDIFF", "relatedness"]
schema = {
    "left": pa.string(),
    "right": pa.string(),
    "guess": pa.string()
}
for code in codes:
    schema[code] = pa.float32()
    
schema = pa.schema(schema)
output = parquet.ParquetWriter("out.parquet", schema)

for i, p in enumerate(Path(LOCATION_OF_COMPARE_FILES).glob("**/*.parquet")):
    data = parquet.read_table(p)
    batch = {k : data[k] for k in codes}
    batch['left'] = pa.array([utils.extract_htid(p.name.replace(".predictions.parquet", ""))] * len(data))
    batch['right'] = data['htid']
    batch['guess'] = data['guess']
    output.write_table(pa.table(batch, schema = schema))
    print(i, end = "\r")
# -

dathi.execute("CREATE TABLE relationships AS SELECT * FROM parquet_scan('out.parquet')")

dathi.close()


