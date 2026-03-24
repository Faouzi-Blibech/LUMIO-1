"""
generate_training_data.py — Generate synthetic XGBoost training data.

Creates 2000 labeled samples (500 per distraction class) with realistic
feature distributions based on ADHD research literature:

  fatigue:     avg_focus 0.1-0.38, blink_rate 4-11,  session > 3600s
  difficulty:  avg_focus 0.2-0.45, blink_rate 8-15
  environment: avg_focus 0.3-0.6,  focus_std 0.4-0.75, blink_rate 18-35
  unknown:     random across all ranges

Output: backend/models/training_data.csv

TODO Day 4: Implement full data generation with numpy random distributions.
"""


def generate():
    """Generate synthetic training data and save to CSV. TODO Day 4."""
    # TODO Day 4: implement using numpy random distributions
    print("generate_training_data.py — not yet implemented (Day 4)")


if __name__ == "__main__":
    generate()
