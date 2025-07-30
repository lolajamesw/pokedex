Each feature has its own test-production.sql and test-production.out file. The expected output for each file is defined with the
assumption the database is in the state equivalent to that immediately after importing productionDump.sql. Since our production data was obtained
from multiple sources, this is much simpler than re-running all the scripts we used to set up the database.

If you would like to rerun any of the tests here, be sure to reset the database after testing any query that modifies it,
otherwise, the results for some queries may differ from our expected output.
