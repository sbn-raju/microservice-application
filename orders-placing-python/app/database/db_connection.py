from motor.motor_asyncio import AsyncIOMotorClient

uri = "mongodb://mongoadmin:mongopass@localhost:27018/"
client = AsyncIOMotorClient(uri)
db = client["e-comm"]
orders = db.get_collection("orders")