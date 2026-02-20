from flask import Flask
from flask_mysqldb import MySQL
from config import Config
from ai.recommendation import FoodRecommender

app = Flask(__name__)
app.config.from_object(Config)
mysql = MySQL(app)

def test_food_recommendation():
    email = "testuser@gmail.com"  # must exist in DB
    recommendation = FoodRecommender.recommend_food(mysql, email)
    print("✅ Recommended food:", recommendation)

if __name__ == "__main__":
    test_food_recommendation()
