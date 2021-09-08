import base64
from werkzeug.utils import secure_filename
from flask import request, jsonify, abort
from app import create_app
from decouple import config
import base64
from pathlib import Path
from db_config import config_db_mm
from hashlib import algorithms_available, sha256
from sqlalchemy.dialects import mysql
from jwt import encode

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = create_app()
configs = config_db_mm(app)
db = configs['db']
ma = configs['ma']


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(100), unique=True)
    name = db.Column(db.String(100))
    password = db.Column(db.String(100))

    photo = db.relationship('Photo', backref='user', lazy=True)

    def __init__(self, user, name, password):
        self.user = user
        self.name = name
        self.password = password

class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    body = db.Column(mysql.LONGTEXT)

    def __init__(self, id_user, body):
        self.id_user = id_user
        self.body = body
    


db.create_all()


class UserSchema(ma.Schema):
    class Meta:
        fields = ('id', 'user', 'name', 'password')

class PhotoSchema(ma.Schema):
    class Meta:
        fields = ('id', 'id_user', 'body')
    
user_schema = UserSchema()
users_schema = UserSchema(many=True)

photo_schema = PhotoSchema()
photos_schema = PhotoSchema(many=True)

def encrypt_pass(password):
    return sha256(password.encode()).hexdigest()


# If user exist
def existing_user(user):
    user = User.query.filter_by(user=user).first()
    return True if user != None else False

@app.route('/user/new', methods=['POST'])
def new_user():
    user = request.json["user"]
    name = request.json["name"]
    password = encrypt_pass(request.json["password"])

    # Comprobations
    if existing_user(user):
        abort(400)
    # Comprobations
    if user == None or password == None or name == None or user == '' or request.json['password'] == '' or name == '':
        abort(400)

    new_user = User(user, name, password)
    db.session.add(new_user)
    db.session.commit()

    return user_schema.jsonify(new_user)


@app.route('/user/login', methods=['POST'])
def login():
    user = request.json['user']
    password = encrypt_pass(request.json['password'])

    # Comprobations
    if user == None or password == None or user == '' or request.json['password'] == '':
        abort(400)
    if not existing_user(user):
        abort(400)

    user_db = User.query.filter_by(user=user).first()

    if user_db.password != password:
        abort(400)
    else:
        acces_token = encode({
            "user" : user,
            "name" : user_db.name,
            "id" : user_db.id
        }, "high_secret_password*/%@", algorithm="HS256")

    return jsonify({'token' : acces_token})

@app.route('/user/delete', methods=['DELETE'])
def delete_photo():
    photo_to_delete = Photo.query.filter_by(id=request.json['id']).first()
    db.session.delete(photo_to_delete)
    db.session.commit()
    return jsonify({'Status' : 'deleted'})

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def folder_exists(id):
    Path(f"{app.config['UPLOAD_FOLDER']}/{id}").mkdir(parents=True, exist_ok=True)

def get_response_image(image):
    encoded_img = base64.b64encode(image.read())
    return encoded_img

@app.route('/upload', methods=['POST'])
def upload_photo():
    if 'file' not in request.files:
        reponse = jsonify({'ERROR' : 'File needed'})
        reponse.status_code = 400
        return reponse
    file = request.files['file']
    # If the user does not select a file, the browser submits an
    # empty file without a filename.
    if file.filename == '':
        reponse = jsonify({'ERROR' : 'Incorrect name'})
        reponse.status_code = 400
        return reponse
    if file and allowed_file(file.filename):
        id_user = request.form['id']
        filename = secure_filename(file.filename)

        body =  get_response_image(file)
        new_photo = Photo(id_user, body)
        db.session.add(new_photo)
        db.session.commit()

        return jsonify({'file' : filename})
    


@app.route('/images/<id>', methods=['GET'])
def get_photos(id):

    # get the photos
    images = Photo.query.filter_by(id_user=id).all()
    
    photos = photos_schema.dump(images)

    return jsonify({'images' : photos})

if __name__ == '__main__':
    app.run(debug=True)