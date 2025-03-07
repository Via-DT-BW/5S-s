from datetime import date
from flask import Flask, Config
from flask_cors import CORS

from api import api_bp
from web import web_bp

app = Flask(__name__)
app.secret_key = "emdfbrofn3bfopwndfb3k390#!@#"
app.config.from_object(Config)
CORS(app)

app.register_blueprint(api_bp)
app.register_blueprint(web_bp)


@app.context_processor
def inject_globals():
    return {"year": date.today().strftime("%Y")}


if __name__ == "__main__":
    app.run(debug=True)
