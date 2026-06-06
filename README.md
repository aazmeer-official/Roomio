# Roomio

Roomio is a full-stack property listing web application inspired by Airbnb. It lets users explore rental listings, create their own listings, upload listing images, view listing locations on a map, and add reviews. The app is built with a Node.js and Express backend, MongoDB for persistent data, EJS for server-rendered pages, and browser-side JavaScript for small interactive UI features.

The project follows a classic MVC-style structure: models define the MongoDB data, controllers contain the application logic, routes expose the HTTP endpoints, views render the frontend, and public assets provide styling and browser scripts.

## Project Overview

Roomio is designed as a complete full-stack project with these layers:

| Layer | Purpose | Main Technologies |
| --- | --- | --- |
| Frontend | Server-rendered pages, responsive layout, listing cards, forms, flash messages, tax toggle, review UI, and Mapbox map display | EJS, EJS Mate, HTML, CSS, Bootstrap, Font Awesome, JavaScript |
| Backend | Routing, controller logic, validation, authentication, authorization, sessions, file uploads, and error handling | Node.js, Express.js, Passport.js, Multer, Joi |
| Database | Persistent storage for users, listings, reviews, ownership, and session data | MongoDB, Mongoose, Connect Mongo |
| External Services | Image hosting and map/geocoding features | Cloudinary, Mapbox |

## Features

- Browse all property listings from MongoDB.
- View detailed listing pages with image, owner, description, price, location, country, reviews, and map.
- Register, log in, and log out using session-based authentication.
- Create new listings when authenticated.
- Upload listing images to Cloudinary.
- Automatically geocode listing locations through Mapbox when creating a listing.
- Edit or delete listings only when the logged-in user owns the listing.
- Add reviews to listings when authenticated.
- Delete reviews only when the logged-in user is the review author.
- Store persistent sessions in MongoDB using `connect-mongo`.
- Display success and error flash messages.
- Validate listing and review input with Joi.
- Use Bootstrap client-side form validation for user-friendly forms.
- Show listing coordinates on an interactive Mapbox map.
- Toggle an 18% GST display on listing prices from the listings page.
- Clean up associated reviews automatically when a listing is deleted.
- Render a custom error page for invalid routes and application errors.

## Tech Stack

### Backend

- Node.js
- Express.js 5
- CommonJS modules
- Mongoose
- MongoDB
- Express Session
- Connect Mongo
- Passport.js
- Passport Local
- Passport Local Mongoose
- Method Override
- Joi
- Multer
- Multer Storage Cloudinary
- Dotenv

### Frontend

- EJS
- EJS Mate layouts
- HTML5
- CSS3
- Bootstrap 5
- Font Awesome
- Google Fonts
- Vanilla JavaScript
- Starability rating styles

### External APIs and Services

- Cloudinary for listing image storage.
- Mapbox Geocoding API for converting listing locations into coordinates.
- Mapbox GL JS for rendering listing maps in the browser.
- Unsplash image URLs in the seed data.

### Runtime

The project declares this Node.js engine in `package.json`:

```json
{
  "node": "24.13.1"
}
```

## Folder Structure

```text
Roomio/
  app.js                    Main Express application entry point
  CloudConfig.js            Cloudinary and Multer storage configuration
  data.js                   Seed listing data
  init.js                   Database seeding script
  middlewares.js            Auth, authorization, and validation middleware
  schema.js                 Joi validation schemas
  package.json              Project metadata and dependencies
  controllers/
    listing.js              Listing controller logic
    reviews.js              Review controller logic
    user.js                 User auth controller logic
  models/
    Listing.js              Listing Mongoose model
    User.js                 User Mongoose model
    review.js               Review Mongoose model
  routes/
    listing.js              Listing routes
    reviews.js              Nested review routes
    user.js                 Signup, login, and logout routes
  utils/
    ExpressError.js         Custom error class
    wrapAsync.js            Async route error wrapper
  views/
    layouts/
      boilerplate.ejs       Main page layout
    includes/
      nav.ejs               Navbar
      footer.ejs            Footer
      flash.ejs             Flash message partial
    listings/
      listing.ejs           All listings page
      show.ejs              Single listing page
      new.ejs               Create listing form
      edit.ejs              Edit listing form
    users/
      signup.ejs            Signup form
      login.ejs             Login form
    error.ejs               Error page
  public/
    style.css               Main styles
    rating.css              Star rating styles
    JS/
      map.js                Mapbox listing map script
      script.js             Bootstrap form validation script
```

## Application Data

Roomio uses three main MongoDB collections: users, listings, and reviews. Session data is also stored in MongoDB through `connect-mongo`.

### User Data

Defined in `models/User.js`.

| Field | Type | Description |
| --- | --- | --- |
| `email` | String | Required email address for the user |
| `username` | String | Added by `passport-local-mongoose` |
| `hash` / `salt` | String | Managed by `passport-local-mongoose` for password authentication |

Authentication is handled by Passport Local and Passport Local Mongoose. Password handling is delegated to `passport-local-mongoose`, so raw passwords are not stored in the database.

### Listing Data

Defined in `models/Listing.js`.

| Field | Type | Description |
| --- | --- | --- |
| `title` | String | Required listing title |
| `description` | String | Required listing description |
| `image.url` | String | Cloudinary or seed image URL |
| `image.filename` | String | Cloudinary public filename or seed filename |
| `price` | Number | Required price per night |
| `location` | String | Listing city or location name |
| `country` | String | Listing country |
| `reviews` | ObjectId[] | References to related `Review` documents |
| `owner` | ObjectId | Reference to the `User` who owns the listing |
| `geometry.type` | String | GeoJSON type, currently `Point` |
| `geometry.coordinates` | Number[] | GeoJSON coordinates as `[longitude, latitude]` |

When a listing is deleted, the app uses a Mongoose post middleware hook to delete all reviews referenced by that listing.

### Review Data

Defined in `models/review.js`.

| Field | Type | Description |
| --- | --- | --- |
| `comment` | String | Review text |
| `rating` | Number | Rating from 1 to 5 |
| `createdAt` | Date | Automatically defaults to the current date |
| `author` | ObjectId | Reference to the user who wrote the review |

### Seed Data

The seed data is stored in `data.js` and loaded by `init.js`.

The current seed file contains:

- 29 sample listings.
- Countries represented: United States, Italy, Mexico, Switzerland, Tanzania, Netherlands, Fiji, United Kingdom, Indonesia, Canada, Thailand, United Arab Emirates, Greece, Costa Rica, Japan, and Maldives.
- Prices from `750` to `10000`.
- Listing image URLs from Unsplash.
- Predefined GeoJSON coordinates for each listing.
- Seed listing fields: `title`, `description`, `image`, `price`, `location`, `country`, and `geometry`.

Seed listing titles:

1. Cozy Beachfront Cottage
2. Modern Loft in Downtown
3. Mountain Retreat
4. Historic Villa in Tuscany
5. Secluded Treehouse Getaway
6. Beachfront Paradise
7. Rustic Cabin by the Lake
8. Luxury Penthouse with City Views
9. Ski-In/Ski-Out Chalet
10. Safari Lodge in the Serengeti
11. Historic Canal House
12. Private Island Retreat
13. Charming Cottage in the Cotswolds
14. Historic Brownstone in Boston
15. Beachfront Bungalow in Bali
16. Mountain View Cabin in Banff
17. Art Deco Apartment in Miami
18. Tropical Villa in Phuket
19. Historic Castle in Scotland
20. Desert Oasis in Dubai
21. Rustic Log Cabin in Montana
22. Beachfront Villa in Greece
23. Eco-Friendly Treehouse Retreat
24. Historic Cottage in Charleston
25. Modern Apartment in Tokyo
26. Lakefront Cabin in New Hampshire
27. Luxury Villa in the Maldives
28. Ski Chalet in Aspen
29. Secluded Beach House in Costa Rica

Important: `init.js` clears existing users and listings before inserting seed data. Run it only when you want to reset the local database.

## Routes

### Listing Routes

Base path: `/listing`

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/listing` | Public | Show all listings |
| GET | `/listing/new` | Logged in | Render the new listing form |
| POST | `/listing` | Logged in | Create a listing, upload image, geocode location, save to MongoDB |
| GET | `/listing/:id` | Public | Show one listing with owner, reviews, and map |
| GET | `/listing/:id/edit` | Owner only | Render edit form |
| PUT | `/listing/:id` | Owner only | Update listing fields and optionally replace image |
| DELETE | `/listing/:id` | Owner only | Delete listing and its related reviews |

### Review Routes

Base path: `/listing/:id/reviews`

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| POST | `/listing/:id/reviews` | Logged in | Add a review to a listing |
| DELETE | `/listing/:id/reviews/:reviewId` | Review author only | Delete a review |

### User Routes

| Method | Route | Access | Description |
| --- | --- | --- | --- |
| GET | `/signup` | Public | Render signup form |
| POST | `/signup` | Public | Register a new user and log them in |
| GET | `/login` | Public | Render login form |
| POST | `/login` | Public | Authenticate user |
| GET | `/signout` | Logged in | Log out current user |

### Error Route

Any unmatched route is passed to the error handler and rendered with the custom `error.ejs` view.

## Validation Rules

Validation is defined in `schema.js`.

### Listing Validation

A listing must include:

- `title`
- `description`
- `location`
- `country`
- `price` greater than or equal to `0`

The `image` field may be an empty string or `null` in the Joi schema, while actual uploaded image files are handled by Multer and Cloudinary.

### Review Validation

A review must include:

- `comment`
- `rating` from `1` to `5`

## Authentication and Authorization

Roomio uses Passport Local for username/password authentication.

Authentication flow:

1. A user signs up with username, email, and password.
2. Passport Local Mongoose registers the user.
3. The user is logged in immediately after successful signup.
4. Login requests are authenticated with Passport.
5. Session state is stored in MongoDB.
6. Flash messages show success or error feedback.

Authorization rules:

- Only logged-in users can create listings.
- Only listing owners can edit or delete their listings.
- Only logged-in users can create reviews.
- Only review authors can delete their reviews.

## Image Upload Flow

Image uploads are configured in `CloudConfig.js`.

1. The listing form sends `multipart/form-data`.
2. Multer reads the uploaded file from `listing[image]`.
3. `multer-storage-cloudinary` sends the image to Cloudinary.
4. Cloudinary returns a hosted image URL and filename.
5. Roomio stores the image data inside the listing document.

Cloudinary configuration uses:

- `CLOUD_NAME`
- `CLOUD_API_KEY`
- `CLOUD_API_SECRET`

Uploaded files are stored in the Cloudinary folder named `rommio_DEV`.

## Map and Geocoding Flow

Roomio uses Mapbox in two places:

1. The backend uses `@mapbox/mapbox-sdk` to geocode a listing location when a new listing is created.
2. The frontend uses Mapbox GL JS to render a map on the listing detail page.

Map data flow:

1. User enters a location in the new listing form.
2. The listing controller sends the location to Mapbox forward geocoding.
3. The first geocoding result is saved as `geometry`.
4. The show page embeds the coordinates in a hidden data element.
5. `public/JS/map.js` reads the coordinates and renders the marker and popup.

## Environment Variables

Create a `.env` file in the project root for local development.

```env
LINK=your_mongodb_connection_string
SECRET=your_session_secret
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
MAP_TOKEN=your_mapbox_access_token
```

Do not commit real `.env` values. The project `.gitignore` already excludes `.env` and `node_modules`.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/aazmeer-official/Roomio.git
cd Roomio
```

### 2. Install dependencies

```bash
npm install
```

The project includes `.npmrc` with:

```text
legacy-peer-deps=true
```

### 3. Configure environment variables

Create `.env` and add the required MongoDB, session, Cloudinary, and Mapbox values.

### 4. Start MongoDB

Use either a local MongoDB server or a hosted MongoDB Atlas connection string.

For the main app, set `LINK` in `.env`.

Example local value:

```env
LINK=mongodb://127.0.0.1:27017/roomio
```

### 5. Seed the database

Optional, but useful for a fresh local setup:

```bash
node init.js
```

Warning: this script deletes existing users and listings before inserting the sample data.

### 6. Run the app

```bash
node app.js
```

Then open:

```text
http://localhost:8080/listing
```

The root route `/` redirects to `/listing`.

## Main Pages

| Page | View File | Description |
| --- | --- | --- |
| Listings index | `views/listings/listing.ejs` | Shows listing cards, category filters, and GST price toggle |
| Listing details | `views/listings/show.ejs` | Shows listing data, owner actions, reviews, and map |
| New listing | `views/listings/new.ejs` | Form for creating a listing with image upload |
| Edit listing | `views/listings/edit.ejs` | Form for updating listing details and image |
| Signup | `views/users/signup.ejs` | User registration form |
| Login | `views/users/login.ejs` | User login form |
| Error | `views/error.ejs` | Error display page |

## Current Project Notes

- The app is currently a listing and review platform. It does not include a completed booking, payment, or reservation model.
- The navbar includes a search form UI, but there is no search route implemented yet.
- The `test` script in `package.json` is still a placeholder.
- `init.js` connects to `mongodb://127.0.0.1:27017/roomio` directly, while the main app uses the `LINK` environment variable.
- The app listens on port `8080`.

## Possible Future Improvements

- Add a booking model and reservation flow.
- Implement search and category filtering on the backend.
- Add pagination for listings and reviews.
- Add automated tests for routes, models, and middleware.
- Add image deletion from Cloudinary when listings are deleted or images are replaced.
- Add stronger production security settings for cookies and session handling.
- Add a `start` script to `package.json`.

## Summary

Roomio demonstrates a full-stack rental listing application with server-rendered frontend pages, an Express backend, MongoDB persistence, authentication, authorization, image uploads, geocoding, interactive maps, reviews, and seed data. It is a practical MVC-based Node.js project that shows how frontend views, backend routes, database models, middleware, and external services work together in one application.
