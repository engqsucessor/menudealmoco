from app.database.database import SessionLocal
from app.database.models import Restaurant
import json

db = SessionLocal()

# Create Subenshi restaurant
subenshi = Restaurant(
    name="Subenshi Sushi Lisboa",
    address="R. M.e Teresa de Calcutá 1C 5, 1950-322 Lisboa",
    city="Lisboa",
    district="Parque das Nações",
    menu_price=19.15,  # Average of menu prices
    price_range="15+",
    food_type="Japanese",
    whats_included=json.dumps(["main", "soup"]),
    cards_accepted=True,
    quick_service=False,
    group_friendly=True,
    parking=False,
    google_rating=4.5,
    google_reviews=210,
    description="Japanese restaurant offering lunch menus from Monday to Friday (except holidays). Features sushi, yakisoba, tonkatsu, ceviche, and more. Vegan options available.",
    dishes=json.dumps([
        "Menu Sushi (11 pieces)",
        "Menu Executivo (15 pieces)",
        "Ceviche Nikkei",
        "Tonkatsu de Frango",
        "Yakisoba varieties",
        "Hamburguer Wagyu",
        "Menu Bao de Vitela Maturada",
        "Prego Subenshi (Tuna steak)"
    ]),
    photos=json.dumps([]),
    restaurant_photo=None,
    menu_photo=None,
    hours="12:00-16:00",
    status="approved"
)

db.add(subenshi)
db.commit()
db.refresh(subenshi)

print(f"Added Subenshi restaurant with ID: {subenshi.id}")
print(f"Name: {subenshi.name}")
print(f"Address: {subenshi.address}")
print(f"Menu Price: €{subenshi.menu_price}")

db.close()
