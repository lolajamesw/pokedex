# pokedex

The file pokedexBackup.sql is a MySQL dump file for our sample database. To create and load this database,
1. downlad the dump file or clone this repo
2. Open MySQL Workbench
3. Go to Server > Data Import > Import From Disk
4. Select "Import Self-Contained File" and enter the path to pokedexBackup.sql
5. For the Default Target Schema feild, click the "New" button and enter the name you would like to give your copy of the database.
6. In the bottom-right corner of the screen, click "Start Import"

Once the import is complete, you should be able to select from the singular table in the database (for now): group_members.


To get the project running, you need to separately run the backend and frontend

1. Make sure you have Node.js and npm installed
2. Navigate to the Frontend folder and run "npm install"
3. Navigate to the Backend folder and run "npm install"
4. Start up the database in MySQL Workbench if it isn't already running
5. Create a .env file in the Backend folder that contains your database's details. It should look like this with your_smth replaced with the detail relevant to you:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=pokedexBackup
DB_PORT=your_port_number
6. from the Backend folder run the command "node server.js" --> You can verify this worked by checking the web address http://localhost:8081 in a web browser
7. Verify the database is connecting by checking for the table details in http://localhost:8081/group_members
8. Open a new terminal (don't close the previous one), navigate to the Frontend folder and run "npm run dev"
9. You can find the site running at the address http://localhost:5173/