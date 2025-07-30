Each feature has its own test-sample.sql and test-sample.out file. The expected output for each file is defined with the
assumption the database is in the state equivalent to that immediately after importing sampleDump.sql, or equivalently, running
createTablesQuery.sql and then TestData.sql.

If you would like to rerun any of the tests here, be sure to reset the database after testing any query that modifies it,
otherwise, the results for some queries may differ from our expected output.
