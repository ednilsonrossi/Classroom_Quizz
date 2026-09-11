from app.models import RevokedToken, UsedToken
from app.utils.db import db

class TokenRepository:
    def revoke_token(self, jti, user_id):
        if not RevokedToken.query.filter_by(jti=jti).first():
            revoked = RevokedToken(jti=jti, user_id=user_id)
            db.session.add(revoked)

    def is_revoked(self, jti):
        return RevokedToken.query.filter_by(jti=jti).first() is not None

    def is_token_used(self, token, purpose=None):
        token_hash = UsedToken.hash_token(token)

        query = UsedToken.query.filter_by(token_hash=token_hash)
        if purpose:
            query = query.filter_by(purpose=purpose)

        return query.first() is not None

    def mark_token_as_used(self, token, purpose, user_id):
        token_hash = UsedToken.hash_token(token)

        if not UsedToken.query.filter_by(token_hash=token_hash).first():
            used = UsedToken(token_hash=token_hash, purpose=purpose,user_id=user_id)
            db.session.add(used)
