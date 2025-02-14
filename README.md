---

# **CinePick**

CinePick is a movie curation app built with **Express.js**, **Sequelize**, and **Supabase**. It allows users to search for movies, add them to watchlists or wishlists, create curated lists, and leave reviews. The app uses the **TMDB API** for movie data and **Supabase** for data storage.

---

## **Features**
- Search for movies using the TMDB API.
- Add movies to **Watchlist**, **Wishlist**, or **Curated Lists**.
- Leave reviews and ratings for movies.
- Sort movies by rating or release year.
- Search movies by genre or actor.
- Get top 5 movies by rating with detailed reviews.

---

## **Technologies Used**
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **ORM**: Sequelize
- **API**: TMDB API
- **Testing**: Jest

---

## **Setup Instructions**

### **1. Clone the Repository**
```bash
git clone https://github.com/KarunasriG/cinePick.git
cd cinePick
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Set Up Environment Variables**
Create a `.env` file in the root directory and add the following variables:
```env
# Supabase Credentials
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key

# TMDB API Key
TMDB_API_KEY=your-tmdb-api-key

# Server Port
PORT=3000
```

### **4. Run Migrations**
Set up the database schema using Sequelize migrations:
```bash
npx sequelize-cli db:migrate
```

### **5. Start the Server**
```bash
npm start
```

The server will start at `http://localhost:3000`.

---

## **API Endpoints**

### **1. Search Movies**
- **GET** `/api/movies/search?query=Inception`
  - Searches for movies using the TMDB API.
  - **Query Parameter**: `query` (e.g., "Inception").

### **2. Add to Watchlist**
- **POST** `/api/movies/watchlist`
  - Adds a movie to the user's watchlist.
  - **Request Body**:
    ```json
    {
      "movieId": 123
    }
    ```

### **3. Add to Wishlist**
- **POST** `/api/movies/wishlist`
  - Adds a movie to the user's wishlist.
  - **Request Body**:
    ```json
    {
      "movieId": 123
    }
    ```

### **4. Create Curated List**
- **POST** `/api/curated-lists`
  - Creates a new curated list.
  - **Request Body**:
    ```json
    {
      "name": "Horror Movies",
      "slug": "horror-movies",
      "description": "A collection of the best horror films."
    }
    ```

### **5. Add Movie to Curated List**
- **POST** `/api/movies/curated-list`
  - Adds a movie to a curated list.
  - **Request Body**:
    ```json
    {
      "movieId": 123,
      "curatedListId": 1
    }
    ```

### **6. Add Review**
- **POST** `/api/movies/:movieId/reviews`
  - Adds a review and rating for a movie.
  - **Request Body**:
    ```json
    {
      "rating": 8.5,
      "reviewText": "Great movie with a brilliant plot."
    }
    ```

### **7. Get Top 5 Movies**
- **GET** `/api/movies/top5`
  - Returns the top 5 movies by rating with detailed reviews.

---

## **Screenshots of API Responses**

### **1. Search Movies**
![Search Movies](screenshots/search-movies.png)

### **2. Add to Watchlist**
![Add to Watchlist](screenshots/add-to-watchlist.png)

### **3. Create Curated List**
![Create Curated List](screenshots/create-curated-list.png)

### **4. Add Review**
![Add Review](screenshots/add-review.png)

### **5. Get Top 5 Movies**
![Top 5 Movies](screenshots/top5-movies.png)

---

## **Testing**
Run unit and integration tests using Jest:
```bash
npm test
```

---

## **Contributing**
Contributions are welcome! Please open an issue or submit a pull request.

---

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
