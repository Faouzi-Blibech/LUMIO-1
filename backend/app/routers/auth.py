"""
auth.py — Authentication router.

Handles user registration, login, and session management via JWT tokens.
JWTs are stored in httpOnly cookies (not localStorage) for security —
this prevents JavaScript from reading the token, protecting against XSS attacks.

TODO Day 2:
  POST /register — hash password with bcrypt, create user in DB, return JWT in httpOnly cookie
  POST /login    — verify credentials, return JWT
  GET  /me       — decode JWT from cookie, return current user data
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
async def ping():
    return {"message": "auth router working"}
