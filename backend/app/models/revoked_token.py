from app.utils.db import db

class RevokedToken(db.Model):
    __tablename__ = 'revoked_tokens'
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuario.id', ondelete='CASCADE'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.now())

    user = db.relationship('Usuario', back_populates='revoked_tokens', lazy='select')
    
    def __init__(self, jti, user_id):
        self.jti = jti
        self.user_id = user_id
    