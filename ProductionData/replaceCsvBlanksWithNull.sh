
$vimCommand = ':%s/foo/bar/g | wq'

# Loop through all .txt files in the current directory
Get-ChildItem -Filter gen*_moves.csv | ForEach-Object {
    vim -es -c "%s/,,/,\\N/g" $_.FullName"
}
