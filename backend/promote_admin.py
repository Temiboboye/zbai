from app.core.database import SessionLocal
from app.models.models import User

def promote_first_user():
    db = SessionLocal()
    try:
        # Promote User ID 1 or the first user found
        user = db.query(User).order_by(User.id).first()
        if user:
            user.is_admin = True
            db.commit()
            print(f"Successfully promoted {user.email} (ID: {user.id}) to Admin.")
        else:
            print("No users found in database.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    promote_first_user()
