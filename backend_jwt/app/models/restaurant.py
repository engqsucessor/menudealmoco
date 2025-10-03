from pydantic import BaseModel, EmailStr, field_validator, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum
import re

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
    name: str = Field(..., min_length=2, max_length=100, description="Full name")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, max_length=128, description="Password (8-128 characters)")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not re.match(r'^[a-zA-ZÀ-ÿ\s\'-]+$', v):
            raise ValueError('Name can only contain letters, spaces, hyphens and apostrophes')
        return v.strip()

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not re.search(r'[A-Za-z]', v):
            raise ValueError('Password must contain at least one letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one number')
        return v

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=1, max_length=128, description="Password")

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    displayName: str
    isReviewer: bool
    isAdmin: bool
    joinedAt: datetime
    reviews: List[dict] = []

    class Config:
        from_attributes = True

# Review models
class MenuReviewCreate(BaseModel):
    rating: float = Field(..., ge=1.0, le=5.0, description="Rating between 1 and 5")
    comment: Optional[str] = Field(default="", max_length=1000, description="Review comment (max 1000 chars)")

    @field_validator('comment')
    @classmethod
    def validate_comment(cls, v):
        if v:
            # Remove potential XSS attempts
            cleaned = re.sub(r'<[^>]*>', '', v)
            return cleaned.strip()
        return ""

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
# Reviewer Application models
class ReviewerApplicationCreate(BaseModel):
    motivation: str = Field(..., min_length=50, max_length=1000, description="Why you want to be a reviewer (50-1000 chars)")
    experience: Optional[str] = Field(default="", max_length=1000, description="Your relevant experience (optional, max 1000 chars)")

class ReviewerApplicationResponse(BaseModel):
    id: int
    userId: int
    userName: str
    userEmail: str
    motivation: str
    experience: Optional[str]
    status: str  # pending, approved, rejected
    appliedAt: datetime
    reviewedById: Optional[int]
    reviewedAt: Optional[datetime]
    adminNotes: Optional[str]

    class Config:
        from_attributes = True

class ReviewerApplicationReview(BaseModel):
    status: str = Field(..., pattern="^(approved|rejected)$", description="approved or rejected")
    adminNotes: Optional[str] = Field(default="", max_length=500, description="Admin notes (optional, max 500 chars)")
