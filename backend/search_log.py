import os
log_file = 'server_log.txt'
if os.path.exists(log_file):
    with open(log_file, 'rb') as f:
        data = f.read()
        # Try different encodings
        for enc in ['utf-16le', 'utf-8', 'cp1252']:
            try:
                text = data.decode(enc)
                if "DEBUG:" in text:
                    print(f"--- MATCH FOUND ({enc}) ---")
                    lines = text.splitlines()
                    for line in lines:
                        if "DEBUG:" in line or "Email not found" in line:
                            print(line)
                    break
            except:
                continue
else:
    print("Log file not found")
