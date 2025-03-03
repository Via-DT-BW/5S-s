from datetime import date
from flask import Flask, Config, redirect, url_for
from flask_cors import CORS
import pyodbc

from utils.call_conn import db_conn
from routes.main import bp as main_bp
from routes.dashboard.listings import bp as dashboard_listings_bp
from routes.dashboard.audits import bp as dashboard_audits_bp

app = Flask(__name__)
app.secret_key = "emdfbrofn3bfopwndfb3k390#!@#"
app.config.from_object(Config)
CORS(app)
conn = pyodbc.connect(db_conn)


@app.context_processor
def inject_globals():
    return {"year": date.today().strftime("%Y")}


app.register_blueprint(main_bp)
app.register_blueprint(dashboard_listings_bp)
app.register_blueprint(dashboard_audits_bp)


@app.route("/dashboard")
def dashboard():
    return redirect(url_for("dashboard.listings"))


if __name__ == "__main__":
    app.run(debug=True)
