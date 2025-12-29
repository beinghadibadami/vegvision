from pymongo import MongoClient
from app.core.config import settings

class Database:
    client: MongoClient = None

    def connect(self):
        if not settings.MONGODB_URL:
            print("❌ MongoDB URL not found in environment variables")
            return

        try:
            self.client = MongoClient(settings.MONGODB_URL)
            # Test connection
            self.client.admin.command('ping')
            print("✅ MongoDB connection successful")
        except Exception as e:
            print(f"❌ MongoDB connection failed: {e}")
            self.client = None

    def get_db(self):
        if self.client:
            return self.client['scraper_db']
        return None

    def get_collection(self, collection_name='fruits_veggies'):
        db = self.get_db()
        if db is not None:
            return db[collection_name]
        return None

db = Database()
# Initialize connection when module is loaded (or can be done in main startup event)
db.connect()
