if (!(Test-Path -Path ./scripts)) {
    New-Item -ItemType Directory -Force -Path ./scripts
}
$files = @(
    "actual_dumper.py",
    "database.sql",
    "fix_admin.py",
    "fix_db.py",
    "replace_colors.js",
    "replace_colors.py",
    "run_dump.py"
)

foreach ($file in $files) {
    if (Test-Path -Path $file) {
        Move-Item -Path $file -Destination ./scripts/ -Force
    }
}
