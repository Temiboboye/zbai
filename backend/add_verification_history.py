"""
Migration script: Create verification_history table
Run this on the production database to add the new table.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import engine, Base
from app.models.models import VerificationHistory

def migrate():
    print("Creating verification_history table...")
    VerificationHistory.__table__.create(engine, checkfirst=True)
    print("✅ verification_history table created successfully!")

if __name__ == "__main__":
    migrate()
