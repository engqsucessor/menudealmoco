# Testing Guide - Menu Deal Moço

Your mock backend is now fully integrated! Here's how to test all the functionality:

## 🔐 Test Users

**Regular User:**
- Email: `maria.santos@example.com`
- Password: `password123`

**Reviewer User:**
- Email: `john.doe@example.com`
- Password: `password`

**Admin User:**
- Email: `admin@menudealmoco.com`
- Password: `admin123`

## 🧪 Testing Workflow

### 1. Authentication
- ✅ Sign up as a new user
- ✅ Login with existing users
- ✅ Session persistence (refresh page, stay logged in)
- ✅ Logout functionality

### 2. Restaurant Browsing
- ✅ Search by location (try "Porto", "Lisboa", "Braga")
- ✅ Filter by price range, food type
- ✅ Sort by rating, price, name
- ✅ View restaurant details

### 3. Favorites System
- ✅ Add restaurants to favorites (heart button)
- ✅ View favorites in profile
- ✅ Data persists across sessions

### 4. Restaurant Submissions
- ✅ Submit new restaurant (logged in users only)
- ✅ Form validation
- ✅ Submission goes to reviewer queue

### 5. Reviews System
- ✅ Write menu reviews on restaurant pages
- ✅ Rate 1-5 stars with comments
- ✅ Upvote/downvote reviews
- ✅ Sort reviews by different criteria
- ✅ View your reviews in profile

### 6. Reviewer Workflow
**Login as john.doe@example.com:**
- ✅ Go to Profile → Reviewer tab
- ✅ See pending submissions
- ✅ Approve/reject/request changes
- ✅ Approved restaurants appear in search
- ✅ Add comments to submissions

### 7. User Profile
- ✅ View your reviews
- ✅ View your favorites
- ✅ Reviewer access (for reviewers only)
- ✅ Real data from backend

## 📊 Test Data Available

**Restaurants:**
- Tasca do João (Porto) - €9.50
- Burger Palace (Lisboa) - €12.00
- Vegetarian Garden (Braga) - €8.50

**Pending Submission:**
- Marisqueira do Porto - waiting for reviewer approval

## 🔍 What to Verify

1. **Data Persistence:** All actions save to localStorage and persist
2. **User Roles:** Reviewers see different interface
3. **Form Validation:** Required fields work
4. **Real-time Updates:** Changes reflect immediately
5. **Navigation:** All links work correctly
6. **Error Handling:** Graceful error messages

## 🚀 Quick Test Sequence

1. Login as `maria.santos@example.com`
2. Browse restaurants, add to favorites
3. Submit a new restaurant
4. Write a review
5. Logout and login as `john.doe@example.com`
6. Go to Profile → Reviewer
7. Approve Maria's submission
8. Switch back to Maria's account
9. See the approved restaurant in search

Everything should work smoothly with real data persistence!