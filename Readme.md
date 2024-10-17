# Voucher Management System

This project is a Voucher Management System built with Node.js, Express, and MongoDB. It provides APIs for managing users, products, vouchers, promotions, and orders.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js (version 18.x or higher)
- You have a MongoDB database set up (local or cloud)
- You have npm or yarn installed

## Getting Started

To get this project up and running, follow these steps:

1. Clone the repository:
   git clone https://github.com/your-username/voucher-management.git

2. Navigate to the project directory:
   cd voucher-management

3. Install dependencies:
   npm install

4. Create a `.env` file in the root directory and add the following environment variables:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   MONGO_URI_TEST=your_test_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

5. Start the server:
   npm start

The server should now be running on `http://localhost:5000`.

## Project Structure

The project follows this folder structure:
voucher-management/
├── src/
│ ├── config/
│ ├── controllers/
│ ├── docs/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── tests/
│ ├── utils/
│ ├── app.ts
│ └── server.ts
├── dist/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md

## API Documentation

This project uses Swagger for API documentation. After starting the server, you can access the API documentation at:
http://localhost:5000/api-docs

This will provide you with a detailed, interactive documentation of all available endpoints.

## Rate Limiting

Rate limiting has been implemented to prevent abuse of the API. The current configuration is:

- 10 requests per minute per IP address

If this limit is exceeded, the API will return a 429 (Too Many Requests) status code.

## Logging

A custom logger has been implemented that logs errors to an `error.log` file. This helps in monitoring and debugging the application.

## Testing

The tests cover various aspects of the application including:

### Order Service Tests (`order.test.ts`)

- Creating an order successfully
- Handling errors for non-existent products
- Checking for insufficient stock
- Applying voucher discounts correctly
- Validating expired vouchers
- Validating expired promotions
- Checking promotion applicability to product categories
- Enforcing maximum discount limits
- Validating voucher usage limits
- Checking minimum order value for vouchers
- Correctly applying and updating promotions

### Rate Limiter Middleware Tests (`rateLimiter.test.ts`)

- Allowing 10 requests within the time window
- Blocking requests that exceed the rate limit
- Resetting the limit after the specified time period

These comprehensive tests ensure the robustness of the order creation process, the correct application of vouchers and promotions, and the effectiveness of the rate limiting middleware.

## Additional Features

- JWT-based authentication
- MongoDB for data persistence
- TypeScript for type safety
- Express for routing and middleware
- Rate limiting to prevent API abuse
- Comprehensive error logging

## License

This project is licensed under the MIT License
