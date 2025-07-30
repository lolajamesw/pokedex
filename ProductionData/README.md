This folder contains everything used to set up the production dataset. You can see the results
by importing productionDump.sql in the test-production folder.

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
