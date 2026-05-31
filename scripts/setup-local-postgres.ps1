param(
    [string]$AdminUser = "postgres",
    [string]$AdminHost = "localhost",
    [int]$AdminPort = 5432,
    [string]$Database = "delivery_app",
    [string]$AppUser = "delivery_app",
    [string]$AppPassword = "delivery_app_dev_password"
)

$ErrorActionPreference = "Stop"

function Find-Psql {
    $command = Get-Command psql -ErrorAction SilentlyContinue
    if ($command) {
        return $command.Source
    }

    $programFiles = @(
        $env:ProgramFiles,
        ${env:ProgramFiles(x86)}
    ) | Where-Object { $_ }

    foreach ($root in $programFiles) {
        $matches = Get-ChildItem -Path $root -Recurse -Filter psql.exe -ErrorAction SilentlyContinue |
            Where-Object { $_.FullName -match "\\PostgreSQL\\.*\\bin\\psql.exe$" } |
            Sort-Object FullName -Descending

        if ($matches) {
            return $matches[0].FullName
        }
    }

    throw "psql.exe was not found. Add PostgreSQL bin to PATH or install PostgreSQL locally."
}

$psql = Find-Psql
$password = Read-Host "Password for PostgreSQL admin user '$AdminUser'" -AsSecureString
$bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)

try {
    $plainPassword = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
    $env:PGPASSWORD = $plainPassword

    $roleExistsSql = "SELECT 1 FROM pg_roles WHERE rolname = '$AppUser';"
    $roleExists = & $psql -h $AdminHost -p $AdminPort -U $AdminUser -d postgres -tAc $roleExistsSql

    if ($roleExists -ne "1") {
        & $psql -h $AdminHost -p $AdminPort -U $AdminUser -d postgres -c "CREATE ROLE $AppUser WITH LOGIN PASSWORD '$AppPassword';"
    }
    else {
        & $psql -h $AdminHost -p $AdminPort -U $AdminUser -d postgres -c "ALTER ROLE $AppUser WITH LOGIN PASSWORD '$AppPassword';"
    }

    $databaseExistsSql = "SELECT 1 FROM pg_database WHERE datname = '$Database';"
    $databaseExists = & $psql -h $AdminHost -p $AdminPort -U $AdminUser -d postgres -tAc $databaseExistsSql

    if ($databaseExists -ne "1") {
        & $psql -h $AdminHost -p $AdminPort -U $AdminUser -d postgres -c "CREATE DATABASE $Database OWNER $AppUser;"
    }
    else {
        & $psql -h $AdminHost -p $AdminPort -U $AdminUser -d postgres -c "ALTER DATABASE $Database OWNER TO $AppUser;"
    }

    Write-Host "Local PostgreSQL is ready for the app."
    Write-Host "Connection string:"
    Write-Host "Host=$AdminHost;Port=$AdminPort;Database=$Database;Username=$AppUser;Password=$AppPassword"
}
finally {
    $env:PGPASSWORD = $null
    if ($bstr -ne [IntPtr]::Zero) {
        [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
    }
}
