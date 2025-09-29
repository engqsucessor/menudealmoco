from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

# Association table for user favorites
user_favorites = Table(
    'user_favorites',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True),
    Column('restaurant_id', Integer, ForeignKey('restaurants.id'), primary_key=True)
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    display_name = Column(String, nullable=False)
    is_reviewer = Column(Boolean, default=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    submitted_restaurants = relationship("RestaurantSubmission", foreign_keys="RestaurantSubmission.submitted_by_id", back_populates="submitter")
    approved_restaurants = relationship("RestaurantSubmission", foreign_keys="RestaurantSubmission.approved_by_id", back_populates="approver")
    reviews = relationship("MenuReview", back_populates="user")
    favorite_restaurants = relationship("Restaurant", secondary=user_favorites, back_populates="favorited_by")
    reports_made = relationship("ReviewReport", foreign_keys="ReviewReport.reporter_id", back_populates="reporter")
    reports_resolved = relationship("ReviewReport", foreign_keys="ReviewReport.resolved_by_id", back_populates="resolver")

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    address = Column(String, nullable=False)
    city = Column(String, nullable=False, index=True)
    district = Column(String, nullable=False, index=True)
    menu_price = Column(Float, nullable=False)
    price_range = Column(String, nullable=False)
    food_type = Column(String, nullable=False)
    whats_included = Column(Text, nullable=True)  # JSON string
    cards_accepted = Column(Boolean, nullable=False)
    quick_service = Column(Boolean, nullable=False)
    group_friendly = Column(Boolean, nullable=False)
    parking = Column(Boolean, nullable=False)
    google_rating = Column(Float, nullable=True)
    google_reviews = Column(Integer, nullable=True)
    description = Column(Text, nullable=True)
    dishes = Column(Text, nullable=True)  # JSON string
    photos = Column(Text, nullable=True)  # JSON string
    restaurant_photo = Column(Text, nullable=True)  # Base64 image data
    menu_photo = Column(Text, nullable=True)  # Base64 image data
    status = Column(String, default="approved")  # approved, pending, rejected

    # Submission tracking
    submitted_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    submitter = relationship("User", foreign_keys=[submitted_by_id])
    approver = relationship("User", foreign_keys=[approved_by_id])
    reviews = relationship("MenuReview", back_populates="restaurant")
    favorited_by = relationship("User", secondary=user_favorites, back_populates="favorite_restaurants")

class RestaurantSubmission(Base):
    __tablename__ = "restaurant_submissions"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_name = Column(String, nullable=False)
    submitted_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="pending")  # pending, approved, rejected, needs_changes

    # Restaurant data (JSON)
    data = Column(Text, nullable=False)  # JSON string with restaurant details

    # Review process
    approved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    reviewer_comments = Column(Text, nullable=True)  # JSON string

    # Relationships
    submitter = relationship("User", foreign_keys=[submitted_by_id], back_populates="submitted_restaurants")
    approver = relationship("User", foreign_keys=[approved_by_id], back_populates="approved_restaurants")

class MenuReview(Base):
    __tablename__ = "menu_reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    rating = Column(Float, nullable=False)  # 1-5 stars (allows half stars)
    comment = Column(Text, nullable=False)
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_hidden = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="reviews")
    restaurant = relationship("Restaurant", back_populates="reviews")
    votes = relationship("ReviewVote", back_populates="review")
    reports = relationship("ReviewReport", back_populates="review")

class ReviewVote(Base):
    __tablename__ = "review_votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    review_id = Column(Integer, ForeignKey("menu_reviews.id"), nullable=False)
    vote_type = Column(String, nullable=False)  # 'up', 'down'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User")
    review = relationship("MenuReview", back_populates="votes")

class ReviewReport(Base):
    __tablename__ = "review_reports"

    id = Column(Integer, primary_key=True, index=True)
    review_id = Column(Integer, ForeignKey("menu_reviews.id"), nullable=False)
    reporter_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    reason = Column(String, nullable=False)
    date_reported = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="pending")  # pending, reviewed, resolved

    # Resolution
    resolved_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)
    action = Column(String, nullable=True)  # dismissed, review_hidden, user_warned, etc.

    # Relationships
    review = relationship("MenuReview", back_populates="reports")
    reporter = relationship("User", foreign_keys=[reporter_id], back_populates="reports_made")
    resolver = relationship("User", foreign_keys=[resolved_by_id], back_populates="reports_resolved")

class EditSuggestion(Base):
    __tablename__ = "edit_suggestions"

    id = Column(Integer, primary_key=True, index=True)
    restaurant_id = Column(Integer, ForeignKey("restaurants.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    suggested_changes = Column(Text, nullable=False)  # JSON string with proposed changes
    reason = Column(Text, nullable=True)  # Reason for the suggestion
    status = Column(String, default="pending")  # pending, approved, rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Voting
    upvotes = Column(Integer, default=0)
    downvotes = Column(Integer, default=0)

    # Resolution
    reviewed_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    rejection_reason = Column(Text, nullable=True)

    # Relationships
    restaurant = relationship("Restaurant")
    user = relationship("User", foreign_keys=[user_id])
    reviewer = relationship("User", foreign_keys=[reviewed_by_id])
    votes = relationship("EditSuggestionVote", back_populates="suggestion")

class EditSuggestionVote(Base):
    __tablename__ = "edit_suggestion_votes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    suggestion_id = Column(Integer, ForeignKey("edit_suggestions.id"), nullable=False)
    vote_type = Column(String, nullable=False)  # 'up', 'down'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User")
    suggestion = relationship("EditSuggestion", back_populates="votes")