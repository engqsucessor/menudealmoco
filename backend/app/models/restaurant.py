from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum

class PriceRange(str, Enum):
    BUDGET = "6-8"
    STANDARD = "8-10"
    GOOD_VALUE = "10-12"
    PREMIUM = "12-15"
    HIGH_END = "15+"

class FoodType(str, Enum):
    TRADITIONAL_PORTUGUESE = "Traditional Portuguese"
    MODERN_CONTEMPORARY = "Modern/Contemporary"
    SEAFOOD_SPECIALIST = "Seafood specialist"
    MEAT_FOCUSED = "Meat-focused"
    VEGETARIAN_FRIENDLY = "Vegetarian-friendly"
    INTERNATIONAL = "International"

class WhatsIncluded(str, Enum):
    SOUP = "soup"
    MAIN = "main"
    DRINK = "drink"
    COFFEE = "coffee"
    DESSERT = "dessert"
    WINE = "wine"
    BREAD = "bread"

class PracticalFeatures(BaseModel):
    cardsAccepted: bool
    quickService: bool
    groupFriendly: bool
    parking: bool

# Restaurant models
class RestaurantCreate(BaseModel):
    name: str
    address: str
    city: str
    district: str
    menuPrice: float
    priceRange: str
    foodType: str
    whatsIncluded: List[str] = []
    practical: PracticalFeatures
    googleRating: Optional[float] = None
    googleReviews: Optional[int] = None
    description: Optional[str] = None
    dishes: List[str] = []
    photos: List[str] = []

class RestaurantResponse(BaseModel):
    id: str
    name: str
    address: str
    city: str
    district: str
    menuPrice: float
    priceRange: str
    foodType: str
    whatsIncluded: List[str]
    practical: PracticalFeatures
    googleRating: Optional[float] = None
    googleReviews: Optional[int] = None
    description: Optional[str] = None
    dishes: List[str] = []
    photos: List[str] = []
    status: str
    submittedBy: Optional[str] = None
    submittedAt: Optional[datetime] = None
    approvedBy: Optional[str] = None
    approvedAt: Optional[datetime] = None

    class Config:
        from_attributes = True

# User models
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    displayName: str
    isReviewer: bool
    joinedAt: datetime
    reviews: List[dict] = []

    class Config:
        from_attributes = True

# Review models
class MenuReviewCreate(BaseModel):
    rating: float
    comment: Optional[str] = ""

class MenuReviewResponse(BaseModel):
    id: str
    userId: str
    restaurantId: str
    rating: float
    comment: str
    displayName: str
    upvotes: int
    downvotes: int
    createdAt: datetime
    userVotes: dict = {}

    class Config:
        from_attributes = True

# Submission models
class RestaurantSubmissionCreate(BaseModel):
    data: RestaurantCreate

class RestaurantSubmissionResponse(BaseModel):
    id: str
    type: str = "restaurant"
    restaurantName: str
    submittedBy: str
    submittedAt: datetime
    status: str
    data: dict
    reviewerComments: List[dict] = []

    class Config:
        from_attributes = True

# Report models
class ReviewReportCreate(BaseModel):
    reason: str

class ReviewReportResponse(BaseModel):
    id: str
    reviewId: str
    restaurantId: str
    reporterId: str
    reason: str
    dateReported: datetime
    status: str
    reviewContent: dict

    class Config:
        from_attributes = True