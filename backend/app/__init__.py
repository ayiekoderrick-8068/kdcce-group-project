# SHARED / INTEGRATION FILE — do not edit without coordination.
from flask import Flask, jsonify

from .config import Config
from .extensions import db, migrate, jwt, cors


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, origins=app.config.get("CORS_ORIGINS", "*"))

    @app.get("/api/health")
    def health():
        return jsonify(status="ok"), 200

    # Blueprints are registered here as each route module is implemented.
    # from .routes.auth import bp as auth_bp
    # app.register_blueprint(auth_bp)

    return app
