from app.utils.db import db
from datetime import datetime
import hashlib

class UsedToken(db.Model):
    __tablename__ = 'used_tokens'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    token_hash = db.Column(db.String(64), nullable=False, unique=True, index=True)
    purpose = db.Column(db.String(50), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('usuario.id', ondelete='CASCADE'), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.now())

    user = db.relationship('Usuario', back_populates='used_tokens', lazy='select')

    @staticmethod
    def hash_token(token):
        return hashlib.sha256(token.encode('utf-8')).hexdigest()
    
    def __init__(self, token_hash, purpose, user_id):
        self.token_hash = token_hash
        self.purpose = purpose
        self.user_id = user_id
        
