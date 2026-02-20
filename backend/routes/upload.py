
from flask import Blueprint, request, jsonify, send_from_directory, current_app
import os
from werkzeug.utils import secure_filename

upload_bp = Blueprint("upload", __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route("/image", methods=["POST"])
def upload_file():
    if 'image' not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400
    file = request.files['image']
    if file.filename == '':
        return jsonify({"success": False, "message": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            
        file.save(os.path.join(upload_folder, filename))
        
        # Return path that can be served
        # Assuming our frontend proxies /api calls, we return the API path
        file_url = f"/api/uploads/image/{filename}"
        return jsonify({"success": True, "url": file_url})
    
    return jsonify({"success": False, "message": "Invalid file type"}), 400

@upload_bp.route("/image/<filename>", methods=["GET"])
def get_file(filename):
    upload_folder = current_app.config['UPLOAD_FOLDER']
    return send_from_directory(upload_folder, filename)
