"""
test_auth.py — Tests for the auth router.

TODO Day 9:
  - test_register_new_user: POST /auth/register → 201, user in DB
  - test_register_duplicate_email: POST /auth/register with existing email → 409
  - test_login_valid: POST /auth/login → 200, JWT cookie set
  - test_login_invalid: POST /auth/login with wrong password → 401
  - test_me_authenticated: GET /auth/me with valid JWT → 200, user data
  - test_me_no_token: GET /auth/me without JWT → 401
"""


def test_placeholder():
    """Placeholder so pytest doesn't fail on empty file. TODO Day 9."""
    assert True
