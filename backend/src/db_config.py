from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from decouple import config

def config_db_mm(app):
    app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+pymysql://{config("SQLALCHEMY_DATABASE_URI")}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db = SQLAlchemy(app)
    ma = Marshmallow(app)
    return {'db' : db, 'ma' : ma}