# Lesson Management Endpoints

This document describes the lesson management API endpoints and how to seed sample lesson data.

## API Endpoints

### 1. Get All Lessons

**Endpoint:** `GET /api/lessons`

**Authentication:** Required (JWT token)

**Query Parameters:**
- `difficulty` (optional): Filter by difficulty level (`beginner`, `intermediate`, `advanced`)
- `tags` (optional): Filter by tags (can be a single tag or comma-separated tags)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of lessons per page (default: 10, max: 100)

**Example Requests:**
```bash
# Get all lessons
GET /api/lessons

# Get beginner lessons
GET /api/lessons?difficulty=beginner

# Get lessons with specific tags
GET /api/lessons?tags=mathematics

# Get lessons with pagination
GET /api/lessons?page=2&limit=5

# Combine filters
GET /api/lessons?difficulty=intermediate&tags=programming&page=1&limit=10
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "lessons": [
      {
        "_id": "lesson_id",
        "title": "Introduction to Mathematics",
        "description": "Learn the basics of mathematics...",
        "content": {
          "type": "text",
          "text": "# Introduction to Mathematics..."
        },
        "quiz": {
          "questions": [...]
        },
        "difficulty": "beginner",
        "tags": ["mathematics", "basics"],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 6,
      "pages": 1
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid query parameters
- `401 Unauthorized`: Missing or invalid authentication token
- `500 Internal Server Error`: Server error

### 2. Get Lesson by ID

**Endpoint:** `GET /api/lessons/:id`

**Authentication:** Required (JWT token)

**Path Parameters:**
- `id`: The MongoDB ObjectId of the lesson

**Example Request:**
```bash
GET /api/lessons/507f1f77bcf86cd799439011
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "lesson": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Introduction to Mathematics",
      "description": "Learn the basics of mathematics...",
      "content": {
        "type": "text",
        "text": "# Introduction to Mathematics..."
      },
      "quiz": {
        "questions": [
          {
            "question": "What are natural numbers?",
            "options": ["...", "...", "...", "..."],
            "correctAnswer": 0,
            "explanation": "Natural numbers are..."
          }
        ]
      },
      "difficulty": "beginner",
      "tags": ["mathematics", "basics"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid lesson ID format
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Lesson not found
- `500 Internal Server Error`: Server error

## Seeding Sample Lessons

The project includes a seed script that populates the database with 6 sample lessons covering various subjects and difficulty levels.

### Sample Lessons Included:

1. **Introduction to Mathematics** (Beginner)
   - Type: Text
   - Topics: Numbers, basic operations
   - 3 quiz questions

2. **English Grammar: Parts of Speech** (Beginner)
   - Type: Text
   - Topics: Nouns, verbs, adjectives, etc.
   - 3 quiz questions

3. **Basic Science: The Water Cycle** (Beginner)
   - Type: Mixed (text + video)
   - Topics: Evaporation, condensation, precipitation
   - 3 quiz questions

4. **Introduction to Computer Programming** (Intermediate)
   - Type: Video
   - Topics: Variables, data types, control structures
   - 3 quiz questions

5. **World Geography: Continents and Oceans** (Intermediate)
   - Type: Text
   - Topics: Seven continents, five oceans
   - 4 quiz questions

6. **Advanced Mathematics: Algebra Basics** (Advanced)
   - Type: Text
   - Topics: Variables, equations, problem-solving
   - 4 quiz questions

### Running the Seed Script

**Prerequisites:**
- MongoDB connection configured in `.env` file
- Backend dependencies installed (`npm install`)

**Command:**
```bash
cd backend
npm run seed:lessons
```

**Expected Output:**
```
Connecting to MongoDB...
Connected to MongoDB
Clearing existing lessons...
Existing lessons cleared
Inserting sample lessons...
Successfully inserted 6 lessons

Lesson Summary:
1. Introduction to Mathematics (beginner)
   - Type: text
   - Tags: mathematics, basics, numbers
   - Quiz Questions: 3
2. English Grammar: Parts of Speech (beginner)
   - Type: text
   - Tags: english, grammar, language
   - Quiz Questions: 3
...

Seed completed successfully!
```

**Note:** Running the seed script will delete all existing lessons in the database before inserting the sample data.

## Content Types

Lessons support three content types:

1. **Text**: Markdown-formatted text content
   ```json
   {
     "type": "text",
     "text": "# Lesson Title\n\nLesson content..."
   }
   ```

2. **Video**: Video URL (typically YouTube)
   ```json
   {
     "type": "video",
     "videoUrl": "https://www.youtube.com/watch?v=...",
     "text": "Optional supplementary text"
   }
   ```

3. **Mixed**: Both text and video
   ```json
   {
     "type": "mixed",
     "text": "# Lesson Title\n\nLesson content...",
     "videoUrl": "https://www.youtube.com/watch?v=..."
   }
   ```

## Quiz Structure

Each lesson includes a quiz with multiple-choice questions:

```json
{
  "quiz": {
    "questions": [
      {
        "question": "What is 2 + 2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": 1,
        "explanation": "2 + 2 equals 4"
      }
    ]
  }
}
```

- `correctAnswer` is the zero-based index of the correct option
- `explanation` provides feedback after answering

## Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": ["Additional error details (optional)"]
  }
}
```

Common error codes:
- `VALIDATION_ERROR`: Invalid input parameters
- `LESSON_NOT_FOUND`: Requested lesson doesn't exist
- `INVALID_LESSON_ID`: Malformed lesson ID
- `GET_LESSONS_ERROR`: General error retrieving lessons
- `GET_LESSON_ERROR`: General error retrieving a specific lesson
