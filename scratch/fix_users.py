
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase Admin
cred_path = os.path.join(os.getcwd(), 'services', 'serviceAccountKey.json')
if not firebase_admin._apps:
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

def fix_users():
    users_ref = db.collection('users')
    docs = users_ref.stream()
    
    count = 0
    for doc in docs:
        data = doc.to_dict()
        updates = {}
        
        fields_to_init = [
            'doubts_solved',
            'notes_uploaded',
            'planner_progress',
            'pending_assignments'
        ]
        
        for field in fields_to_init:
            if field not in data:
                updates[field] = 0
        
        if updates:
            doc.reference.update(updates)
            print(f"Updated user {doc.id} with fields: {list(updates.keys())}")
            count += 1
            
    print(f"Finished updating {count} users.")

if __name__ == "__main__":
    fix_users()
