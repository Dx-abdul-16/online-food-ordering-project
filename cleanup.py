import os
import shutil

files_to_move = [
    'actual_dumper.py',
    'database.sql',
    'fix_admin.py',
    'fix_db.py',
    'replace_colors.js',
    'replace_colors.py',
    'run_dump.py',
    'move_files.bat'
]

if not os.path.exists('scripts'):
    os.makedirs('scripts')

for file in files_to_move:
    if os.path.exists(file):
        try:
            shutil.move(file, os.path.join('scripts', file))
            print(f"Moved {file}")
        except Exception as e:
            print(f"Failed to move {file}: {e}")
