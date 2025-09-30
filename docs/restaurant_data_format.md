
# Restaurant Data Format

This document outlines the data structure required to add a new restaurant to the Menu de Almoço application.

## JSON Object Structure

The data should be a single JSON object with the following fields:

```json
{
  "name": "string (required)",
  "address": "string (required)",
  "menuPrice": "number (float, required)",
  "priceRange": "string (enum, required)",
  "foodType": "string (enum, required)",
  "googleRating": "number (float, optional)",
  "googleReviews": "number (integer, optional)",
  "description": "string (optional)",
  "dishes": [
    "string"
  ],
  "whatsIncluded": [
    "string (enum)"
  ],
  "practical": {
    "takesCards": "boolean",
    "quickService": "boolean",
    "groupFriendly": "boolean",
    "hasParking": "boolean"
  },
  "restaurantPhoto": "string (url or base64, optional)",
  "menuPhoto": "string (url or base64, required)"
}
```

## Field Descriptions

- **`name`**: The name of the restaurant.
- **`address`**: The full address of the restaurant.
- **`menuPrice`**: The price of the lunch menu in euros (e.g., `12.50`).
- **`priceRange`** (enum): The price range category.
  - `"6-8"`: €6-8 (Budget deals)
  - `"8-10"`: €8-10 (Standard)
  - `"10-12"`: €10-12 (Good value)
  - `"12-15"`: €12-15 (Premium)
  - `"15+"`: €15+ (High-end)
- **`foodType`** (enum): The type of cuisine.
  - `"Traditional Portuguese"`
  - `"Modern/Contemporary"`
  - `"Seafood specialist"`
  - `"Meat-focused"`
  - `"Vegetarian-friendly"`
  - `"International"`
- **`googleRating`**: The restaurant's rating on Google (e.g., `4.5`).
- **`googleReviews`**: The number of reviews on Google (e.g., `128`).
- **`description`**: A general description or notes about the restaurant.
- **`dishes`**: An array of strings, where each string is a dish typically available.
- **`whatsIncluded`**: An array of strings indicating what the menu price includes.
  - `"soup"`
  - `"main"`
  - `"drink"`
  - `"coffee"`
  - `"dessert"`
  - `"wine"`
  - `"bread"`
- **`practical`**: An object with boolean flags for practical features.
  - **`takesCards`**: `true` if the restaurant accepts cards.
  - **`quickService`**: `true` if the service is notably fast.
  - **`groupFriendly`**: `true` if it's suitable for groups.
  - **`hasParking`**: `true` if there is parking available.
- **`restaurantPhoto`**: A URL or base64 encoded string of a photo of the restaurant.
- **`menuPhoto`**: A URL or base64 encoded string of a photo of the menu. This is required.
