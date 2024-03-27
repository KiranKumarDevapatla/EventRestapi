# Event Finder API

This is a RESTful API for finding events based on location and date.

## Tech Stack and Database Choice

This project uses Node.js and Express for the backend, MongoDB as the database, and Mongoose as the ODM (Object Data Modeling) library. 

Node.js and Express were chosen for their simplicity and efficiency in building fast and scalable network applications. MongoDB was chosen for its flexibility and scalability, as it allows us to store our data in a flexible, JSON-like format which can be easily modified as requirements change.

The project also uses axios for making HTTP requests to external APIs, and csv-parser for parsing CSV data.

## Setup and Running the Project

1. Clone the repository.
2. Install the dependencies with `npm install`.
3. Set up your environment variables in a `.env` file in the root of your project:
    ```
    MONGODB_URI=<your_mongodb_uri>
    OPENWEATHERMAP_API_KEY=<your_openweathermap_api_key>
    DISTANCEMATRIX_API_KEY=<your_distancematrix_api_key>
    PORT=3000
    ```
4. Run the server with `npm start`.

## API Endpoints

### POST /events

Uploads a CSV file of events.

Request format: CSV file

Response format: JSON

Error codes: 400 (Bad Request), 500 (Internal Server Error)

### GET /events

Gets all events.

Request format: None

Response format: JSON

Error codes: 500 (Internal Server Error)

### GET /events/find

Finds events based on location and date.

Request format: Query parameters (latitude, longitude, date, page, pageSize)

Response format: JSON

Error codes: 400 (Bad Request), 500 (Internal Server Error)
