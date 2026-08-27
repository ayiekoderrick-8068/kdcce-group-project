from .user import utcnow
from ..extensions import db


class Program(db.Model):
    __tablename__ = "programs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(220), nullable=False, unique=True, index=True)
    summary = db.Column(db.String(500))
    description = db.Column(db.Text)
    image_url = db.Column(db.String(500))
    is_published = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow, nullable=False)

    events = db.relationship("Event", back_populates="program", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "slug": self.slug,
            "summary": self.summary,
            "description": self.description,
            "image_url": self.image_url,
            "is_published": self.is_published,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
