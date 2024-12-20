# Blog Website

It is a modern, full-featured blog platform that empowers users to create, share, and discover engaging content. Built with scalability and performance in mind, the platform focuses on user interaction, personalized feeds, and seamless social features.

---

## Key Features

### Authentication System
- Secure user **sign-up** and **login** processes with support for personalized profiles.  
- Users can manage their accounts, including **bios** and **topic preferences**.  

### Content Management
- **Create, Edit, and Delete Blogs**: Users can share their thoughts with rich content and categorized tags.  
- **Clap and Comment System**: Readers can interact with blogs by giving **claps (likes)** and leaving comments.  
- **Comment Management**: Users can **add**, **edit**, and **delete comments** to foster discussions.  

### Social Features
- **Follow** and **Unfollow** functionality to connect with other writers.  
- Personalized feeds displaying blogs from followed authors and favorite tags.  

### Personalized Feed
- **For You Feed**: Blogs recommended based on user-selected interests.  
- **Filtered Feed**: View blogs filtered by specific tags or from followed authors.  

### User Profiles
- View detailed user profiles, including:  
  - Blogs written by the user.  
  - Followers list.  
  - Following list.  

---

## Table of Contents

- **Authentication APIs**
  - Sign Up
  - Login
  - Logout
- **Blog APIs**
  - Create Blog
  - Delete Blog
  - View Blog
  - Clap on Blog
  - Add a Comment
  - Edit a Comment
  - Delete a Comment
- **Social APIs**
  - Follow a User
  - Unfollow a User
- **Profile APIs**
  - View Profile
  - View Following Users
  - View Followers
- **Feed APIs**
  - For You Feed
  - Filtered Feed

---

## Authentication APIs

### Sign Up

- **URL:** `POST /api/auth/signup`
- **Description:** Register a new user.
- **Request Body:**
  ```json
  {
    "name": "Full Name",
    "username": "user123",
    "emailId": "example@mail.com",
    "password": "yourPassword",
    "bio": "I am a blogger",
    "interestedTopics": ["NodeJS", "Technology", "golang"] // atleast 3 topics
  }

### Login

- **URL:** `POST /api/auth/login`
- **Description:** Login a user.
- **Request Body:**
  ```json
    {
    "emailId" : "dedrick.borer@hotmail.com",
    // "username" : "exampleUsername",
    "password" : "@Neeraj123"
    }

### Logout

- **URL:** `POST /api/auth/logout`
- **Description:** logout a user.

---

## Blog APIs

### Create Blog

- **URL:** `POST /api/blogs/createblog`
- **Description:** Creates a new blog.
- **Request Body:**
  ```json
    {
    "title" : "windows 11 is very secure 2",
    "subtitle" : "Arvo Pärt the holy magician",
    "content" : "riedrich Nietzsche once said, “If there were no music, life would be a mistake.” I could not agree..............",
    "tags" :  ["NodeJS", "operating system", "Rust", "technology"] // max 5 tags
    }


### Delete Blog

- **URL:** `DELETE /api/blogs/deleteblog/:blogId`
- **Description:** Delete a blog.


### View Blog

- **URL:** `GET /api/blogs/@:username/:titleSlug`
- **Description:** To open a full fleged blog.
- **Request Body:**

### Clap on Blog

- **URL:** `POST /api/blogs/clap/:blogId`
- **Description:** Adds a "clap" to the specified blog post.

### Add a Comment on a Blog

- **URL:** `POST /api/blogs/addcomment/:blogId`
- **Description:** Add comment on a blog.
- **Request Body:**
  ```json
    {
        "message" : "very nice"
    }

### Edit a comment

- **URL:** `PATCH /api/blogs/editcomment/:commentId`
- **Description:** Edit a comment on a blog.
- **Request Body:**
  ```json
    {
        "message" : "very nice 2"
    }

### Delete a comment

- **URL:** `DELETE /api/blogs/deletecomment/:blogId/:commentId`
- **Description:** Delete a comment on a blog.

---

## Social APIs

### Follow a user

- **URL:** `POST /api/connections/follow/@:username`
- **Description:** Follow a user.

### Unfollow a user

- **URL:** `POST /api/connections/unfollow/@:username`
- **Description:** Unfollow a user.

---

## Profile APIs

### View profile of a user

- **URL:** `GET /api/profile/@:username`
- **Description:** To view the profile of a user.

### View following users of a user

- **URL:** `GET /api/profile/@:username/following?page=1&limit=10`
- **Description:** To view following users, a user is following to.

### View following users of a user

- **URL:** `GET /api/profile/@:username/followers?page=1&limit=10`
- **Description:** To view following users, a user is following to.

## Feed APIs

### Get For-You Feed

- **URL:** `GET /feed/for-you?page=1&limit=10`
- **Description:** This endpoint provides blogs suggested to the user based on their interests (the topics selected during signup).
- **Query Parameters:**
  - `page` (integer): Page number for pagination.
  - `limit` (integer): Number of blogs to display per page.
- **Response:**
  - Status `200`: Returns a list of suggested blogs.

### Get Filtered Feed

#### Based on Type

1. **If type = tag**

   - **URL:** `GET /feed/?type=tag&tag=nodejs&page=1&limit=10`
   - **Description:** If the type is `tag`, it filters and returns blogs related to the specified tag.
   - **Query Parameters:**
     - `type` (string): Filter type, e.g., `tag`.
     - `tag` (string): The specific tag to filter blogs.
     - `page` (integer): Page number for pagination.
     - `limit` (integer): Number of blogs to display per page.
   - **Example:**
     ```http
     GET /feed/?type=tag&tag=nodejs&page=1&limit=10
     ```
   - **Response:**
     - Status `200`: Returns blogs filtered by the tag.

2. **If type = following**

   - **URL:** `GET /feed/?type=following&page=1&limit=10`
   - **Description:** If the type is `following`, it returns blogs written by users whom the logged-in user is following.
   - **Query Parameters:**
     - `type` (string): Filter type, e.g., `following`.
     - `page` (integer): Page number for pagination.
     - `limit` (integer): Number of blogs to display per page.
   - **Example:**
     ```http
     GET /feed/?type=following&page=1&limit=10
     ```
   - **Response:**
     - Status `200`: Returns blogs written by followed users.

