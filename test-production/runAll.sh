#!/bin/bash

# MySQL credentials
USER="your_username"
PASSWORD="your_password"
DATABASE="your_database"
HOST="localhost"  # or another host

# Path to the dump file used to reset the database
RESET_DUMP="reset_dump.sql"

# Loop through all .sql files
for SQL_FILE in *.sql; do
    # Skip the reset dump file
    if [[ "$SQL_FILE" == "$RESET_DUMP" ]]; then
        continue
    fi

    # Generate output filename
    OUT_FILE="${SQL_FILE%.sql}.out"

    echo "Running $SQL_FILE..."
    mysql --user="$USER" --password="$PASSWORD" --host="$HOST" --database="$DATABASE" --table < "$SQL_FILE" > "$OUT_FILE"

    echo "Resetting database..."
    mysql --user="$USER" --password="$PASSWORD" --host="$HOST" --database="$DATABASE" < "$RESET_DUMP"
done

echo "All files processed."
