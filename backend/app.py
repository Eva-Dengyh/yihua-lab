import os

from flask import Flask, jsonify
from flask_cors import CORS

from api.auth import bp as auth_bp
from api.categories import bp as categories_bp
from api.articles import bp as articles_bp
from api.nav_visibility import bp as nav_visibility_bp
from api.posts import bp as posts_bp
from api.projects import bp as projects_bp
from api.images import bp as images_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    # 认证接口
    app.register_blueprint(auth_bp)
    # 前端只读接口
    app.register_blueprint(posts_bp)
    app.register_blueprint(nav_visibility_bp)
    # 管理端 CRUD 接口
    app.register_blueprint(categories_bp)
    app.register_blueprint(articles_bp)
    app.register_blueprint(projects_bp)
    app.register_blueprint(images_bp)

    return app


if __name__ == "__main__":
    app = create_app()
    debug = os.getenv("FLASK_DEBUG", "false").lower() == "true"
    app.run(host="0.0.0.0", port=8000, debug=debug)
