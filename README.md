# pokedex

The file pokedexBackup.sql is a MySQL dump file for our sample database. To create and load this database,
1. downlad the dump file or clone this repo
2. Open MySQL Workbench
3. Go to Server > Data Import > Import From Disk
4. Select "Import Self-Contained File" and enter the path to pokedexBackup.sql
5. For the Default Target Schema feild, click the "New" button and enter the name you would like to give your copy of the database.
6. In the bottom-right corner of the screen, click "Start Import"

Once the import is complete, you should be able to select from the singular table in the database (for now): group_members.
