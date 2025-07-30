# Pokedex

## test-sample
The file test-sample/sampleDump.sql is a MySQL dump file for our sample database. To create and load this database,
1. downlad the dump file or clone this repo
2. Open MySQL Workbench
3. Go to Server > Data Import > Import From Disk
4. Select "Import Self-Contained File" and enter the path to productionDump.sql
5. For the Default Target Schema feild, click the "New" button and enter "pokedex".
6. In the bottom-right corner of the screen, click "Start Import"

Once the import is complete, the database should contain all the tables defined in our relational schema, along with some test data. The sample data was created with the queries in test-sample/TestData.sql.

Each feature has its own test-sample.sql and test-sample.out file. The expected output for each file is defined with the
assumption the database is in the state equivalent to that immediately after importing sampleDump.sql, or equivalently, running
createTablesQuery.sql and then TestData.sql.

If you would like to rerun any of the tests here, be sure to reset the database after testing any query that modifies it,
otherwise, the results for some queries may differ from our expected output.


## test-production
Within the test-production folder, each feature has its own test-production.sql and test-production.out file. The expected output for each file is defined in the report with the
assumption the database is in the state equivalent to that immediately after importing productionDump.sql. (See above for instructions on importing a dump file.) Since our production data was obtained
from multiple sources, this is much simpler than re-running all the scripts we used to set up the database.

If you would like to rerun any of the tests here, be sure to reset the database after testing any query that modifies it,
otherwise, the results for some queries may differ from our expected output.

## ProductionData
This folder contains everything used to set up the production dataset. You can see the results
by importing productionDump.sql from the test-production folder.

If you edit something here and want to run it all, please do so in this order:
1. createTablesQuery.sql
2. FillTypeTables.sql
3. ImportPokedexData.sql
4. PokedexDescriptions.js
5. ImportEvolutionData.sql
6. ImportAttackData.sql
7. ImportLearnableAttacks.sql
8. ResetUserData.sql
9. GeneratePokedexUsers.exe
10. GeneratePokedexTrades.exe

## Running the project

To get the project running, you need to separately run the backend and frontend

1. Make sure you have Node.js and npm installed
2. Navigate to the Frontend folder and run "npm install"
3. Navigate to the Backend folder and run "npm install"
4. Start up the database in MySQL Workbench if it isn't already running
5. Create a .env file in the Backend folder that contains your database's details. It should look like this with your_smth replaced with the detail relevant to you:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pokedex
DB_PORT=your_port_number
6. from the Backend folder run the command "node server.js" --> You can verify this worked by checking the web address http://localhost:8081 in a web browser
7. Verify the database is connecting by checking for the table details in http://localhost:8081/group_members
8. Open a new terminal (don't close the previous one), navigate to the Frontend folder and run "npm run dev"
9. You can find the site running at the address http://localhost:5173/