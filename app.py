from flask import Flask, Config
from flask_cors import CORS
import pyodbc

from utils.call_conn import db_conn
from routes.main import bp as main_bp
from routes.dashboard import bp as dashboard_bp

app = Flask(__name__)
app.secret_key = "emdfbrofn3bfopwndfb3k390#!@#"
app.config.from_object(Config)
CORS(app)

conn = pyodbc.connect(db_conn)

app.register_blueprint(main_bp)
app.register_blueprint(dashboard_bp)

print(app.url_map)

if __name__ == "__main__":
    app.run(debug=True)
