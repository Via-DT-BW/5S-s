from datetime import date
from flask import Flask
from flask_cors import CORS

import os

from api import api_bp
from web import web_bp

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
CORS(app)

app.register_blueprint(api_bp)
app.register_blueprint(web_bp)


@app.context_processor
def inject_globals():
    return {"year": date.today().strftime("%Y")}


@app.route("/testing")
def testing():
    print(app.config)
    return "Hey there"


if __name__ == "__main__":
    app.run(debug=True)
