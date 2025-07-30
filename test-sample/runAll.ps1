# MySQL credentials
$User = "your_username"
$Password = "your_password"
$Database = "your_database"
$Host = "localhost"  # or another host
$ResetDump = "reset_dump.sql"

# Get all .sql files in the current directory, excluding the reset dump
$SqlFiles = Get-ChildItem -Filter *.sql | Where-Object { $_.Name -ne $ResetDump }

foreach ($File in $SqlFiles) {
    $SqlFile = $File.FullName
    $OutFile = [System.IO.Path]::ChangeExtension($SqlFile, ".out")

    Write-Host "Running $SqlFile..."
    & mysql.exe --user=$User --password=$Password --host=$Host --database=$Database --table < $SqlFile > $OutFile

    Write-Host "Resetting database..."
    & mysql.exe --user=$User --password=$Password --host=$Host --database=$Database < $ResetDump
}

Write-Host "All files processed."
