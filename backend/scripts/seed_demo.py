"""
seed_demo.py — Seed the database with demo data for presentations.

Creates:
  - 1 teacher: teacher@demo.com
  - 3 students with varying risk profiles:
      * Yassine: risk_tier='needs_attention', 7 days of focus_events,
                 full suggested_actions JSON
      * Mohamed: risk_tier='moderate'
      * Sarra:   risk_tier='low'
  - 2 homework assignments
  - 1 submission with struggle_flag=True (grade < 8)

This is meant for IEEE CODE2CURE demo day — run it once before the presentation.

TODO Day 9: Implement full seeding with realistic demo data.
"""


async def seed():
    """Seed demo data into the database. TODO Day 9."""
    # TODO Day 9: implement using async SQLAlchemy sessions
    print("seed_demo.py — not yet implemented (Day 9)")


if __name__ == "__main__":
    import asyncio
    asyncio.run(seed())
