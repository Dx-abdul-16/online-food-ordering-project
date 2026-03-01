import os

replacements = {
    'c9a84c': '2872a1', # Gold -> Ocean Blue
    'C9A84C': '2872A1',
    'b8943d': '1c5173', # Hover gold -> Hover blue
    'B8943D': '1C5173',
    '0d0d0d': '1e2421', # Background darkest -> Dark green/gray
    '0D0D0D': '1E2421',
    '111111': '2f3633', # Cards -> Image 1 dark color
    '111': '2f3633',
    '141414': '39423e', # Popovers
    '1a1a1a': '434d49', # Other backgrounds
    '1A1A1A': '434D49',
    '2a2a2a': '4e5953', # Borders
    '2A2A2A': '4E5953'
}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filepath}')

for root, dirs, files in os.walk('frontend/src'):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.css', '.html')):
            replace_in_file(os.path.join(root, file))
