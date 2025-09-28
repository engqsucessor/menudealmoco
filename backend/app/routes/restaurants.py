from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import json
from app.models.restaurant import RestaurantResponse
from app.database.database import get_db
from app.database.models import Restaurant as DBRestaurant

router = APIRouter()

def convert_db_to_response(db_restaurant: DBRestaurant) -> dict:
    """Convert database restaurant to API response format matching mock backend"""
    return {
        "id": str(db_restaurant.id),
        "name": db_restaurant.name,
        "address": db_restaurant.address,
        "city": db_restaurant.city,
        "district": db_restaurant.district,
        "menuPrice": db_restaurant.menu_price,
        "priceRange": db_restaurant.price_range,
        "foodType": db_restaurant.food_type,
        "whatsIncluded": json.loads(db_restaurant.whats_included) if db_restaurant.whats_included else [],
        "practical": {
            "cardsAccepted": db_restaurant.cards_accepted,
            "quickService": db_restaurant.quick_service,
            "groupFriendly": db_restaurant.group_friendly,
            "parking": db_restaurant.parking
        },
        "googleRating": db_restaurant.google_rating,
        "googleReviews": db_restaurant.google_reviews,
        "description": db_restaurant.description,
        "dishes": json.loads(db_restaurant.dishes) if db_restaurant.dishes else [],
        "photos": json.loads(db_restaurant.photos) if db_restaurant.photos else [],
        "status": db_restaurant.status,
        "submittedBy": db_restaurant.submitter.email if db_restaurant.submitter else None,
        "submittedAt": db_restaurant.submitted_at.isoformat() if db_restaurant.submitted_at else None,
        "approvedBy": db_restaurant.approver.email if db_restaurant.approver else None,
        "approvedAt": db_restaurant.approved_at.isoformat() if db_restaurant.approved_at else None
    }

@router.get("/restaurants")
async def get_restaurants(
    db: Session = Depends(get_db),
    query: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    foodTypes: Optional[str] = Query(None),
    minPrice: Optional[float] = Query(None),
    maxPrice: Optional[float] = Query(None),
    sortBy: Optional[str] = Query("rating"),
    sortOrder: Optional[str] = Query("desc")
):
    """Get restaurants with filtering and sorting - matches mock backend behavior"""

    # Get all approved restaurants
    restaurants_query = db.query(DBRestaurant).filter(DBRestaurant.status == "approved")
    db_restaurants = restaurants_query.all()

    # Convert to response format
    restaurants = [convert_db_to_response(r) for r in db_restaurants]

    # Apply text search filter
    if query:
        query_lower = query.lower()
        restaurants = [r for r in restaurants if (
            query_lower in r["name"].lower() or
            (r["description"] and query_lower in r["description"].lower()) or
            any(query_lower in dish.lower() for dish in r["dishes"])
        )]

    # Apply location filter
    if location:
        location_lower = location.lower()
        restaurants = [r for r in restaurants if (
            location_lower in r["city"].lower() or
            location_lower in r["district"].lower() or
            location_lower in r["address"].lower()
        )]

    # Apply food type filter
    if foodTypes:
        food_types_list = [ft.strip() for ft in foodTypes.split(",")]
        restaurants = [r for r in restaurants if r["foodType"] in food_types_list]

    # Apply price filter
    if minPrice is not None or maxPrice is not None:
        min_p = minPrice if minPrice is not None else 0
        max_p = maxPrice if maxPrice is not None else float('inf')
        restaurants = [r for r in restaurants if min_p <= r["menuPrice"] <= max_p]

    # Apply sorting
    reverse = sortOrder == "desc"
    if sortBy == "price":
        restaurants.sort(key=lambda x: x["menuPrice"], reverse=reverse)
    elif sortBy == "rating":
        restaurants.sort(key=lambda x: x["googleRating"] or 0, reverse=reverse)
    elif sortBy == "name":
        restaurants.sort(key=lambda x: x["name"], reverse=reverse)

    return restaurants

@router.get("/restaurants/{restaurant_id}")
async def get_restaurant(restaurant_id: str, db: Session = Depends(get_db)):
    """Get single restaurant by ID"""
    try:
        restaurant_id_int = int(restaurant_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid restaurant ID")

    db_restaurant = db.query(DBRestaurant).filter(DBRestaurant.id == restaurant_id_int).first()
    if not db_restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")

    return convert_db_to_response(db_restaurant)