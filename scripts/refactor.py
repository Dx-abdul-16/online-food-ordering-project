import os
import glob

files = glob.glob('routes/*.py')
imports_block = """
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import jwt
import datetime
import os
import secrets
import string
from functools import wraps
from typing import List, Dict, Any, Optional
from db import get_db

admin_bp = Blueprint("admin", __name__)
auth_bp = Blueprint("auth", __name__)
delivery_bp = Blueprint("delivery", __name__)
orders_bp = Blueprint("orders", __name__)
restaurant_bp = Blueprint("restaurant", __name__)
upload_bp = Blueprint("upload", __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
"""

combined = imports_block + "\n\n"

for fpath in files:
    if '__init__' in fpath: continue
    with open(fpath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for i, line in enumerate(lines):
            # Skip imports at top
            if 'import ' in line or 'from ' in line:
                if 'from db ' in line or 'flask' in line or 'werkzeug' in line or 'jwt' in line or 'datetime' in line or 'functools' in line:
                    continue
            if 'Blueprint(' in line:
                continue
            if 'ALLOWED_EXTENSIONS' in line:
                continue
            if 'def allowed_file' in line:
                continue
            combined += line

with open('views.py', 'w', encoding='utf-8') as f:
    f.write(combined)
