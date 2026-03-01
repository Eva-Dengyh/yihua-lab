import os

from flask import Flask
from flask_cors import CORS

from api.categories import bp as categories_bp
from api.articles import bp as articles_bp
from api.posts import bp as posts_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    # 前端只读接口
    app.register_blueprint(posts_bp)
    # 管理端 CRUD 接口
    app.register_blueprint(categories_bp)
    app.register_blueprint(articles_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=8000, debug=debug)
