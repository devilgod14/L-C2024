News Aggregation System
This is a full-stack application consisting of a robust backend server and an interactive command-line client. The system is designed to aggregate news from multiple external sources, provide a personalized and moderated news feed to users, and offer a full suite of administrative tools for content management.

The entire project was built with a strong focus on professional software architecture, including a layered design, SOLID principles, clean code practices, and a comprehensive test suite.

Features
User Features
Secure Authentication: Users can sign up for a new account and log in using a secure, token-based (JWT) session system.

Personalized News Feed: The main headlines feed is personalized for each user. A recommendation engine scores and sorts articles based on the user's saved articles, liked articles, read history, and configured notification preferences.

Dynamic Headlines & Filtering: View news headlines for today or a custom date range, with the ability to filter by dynamically fetched categories.

Advanced Search & Sorting: Full-text search for articles. Search results can be sorted by relevance, date, or the number of likes/dislikes.

Article Interaction: Users can like, dislike, and report articles.

Saved Articles: Users can save articles to a personal list for later reading and can view and delete from this list.

Configurable Notifications: A dedicated menu allows users to enable/disable notifications for specific categories and add keywords to follow. The backend engine automatically sends email alerts for matching new articles.

Admin Features
Role-Based Access: A distinct "Admin" role with access to a separate, secure admin panel.

Content Moderation:

Report Management: View a list of all user-reported articles and hide any inappropriate content from public view.

Automatic Hiding: Articles are automatically hidden if they cross a predefined report threshold.

Category Management: Admins can hide or unhide entire news categories.

Keyword Filtering: Admins can manage a global blocklist of keywords to filter out articles containing them.

Source Management: View the status of all external API sources and securely update their API keys.

Category Creation: Admins can add new news categories to the system, which then become dynamically available to all users.

Technical Architecture & Design
This project was built to adhere to high-quality software engineering standards.

Project Layering: The backend uses a strict Layered Architecture, separating concerns into api (routes), services (business logic), repositories (data access abstraction), and models. The client also follows a layered structure with api, flows, and ui directories.

SOLID Principles:

Single Responsibility: Every class has a single, well-defined purpose (e.g., AuthService, NewsService, AdminService).

Open/Closed: The design allows for extension without modification (e.g., adding a new news source only requires extending the NewsService adapter).

Dependency Inversion: The background job uses Dependency Injection to receive the EmailService, decoupling the modules.

Boundaries: Clean boundaries were created to isolate the application from external dependencies. The NewsService acts as an adapter for the external news APIs, and the client's ui classes act as a boundary to the inquirer library.

Exception Handling: The application features a robust, centralized error handling system. The server uses a dedicated error handler middleware to catch all errors and send clean, formatted JSON responses, preventing crashes. The client wraps all API calls in try...catch blocks to gracefully handle server errors.

Logging: A professional winston logger is implemented on the server for structured logging to both the console and files. The test environment automatically disables console logging for a clean output.

Tech Stack
Backend: Node.js, Express.js, TypeScript

Database: MongoDB with Mongoose

Authentication: JSON Web Tokens (JWT), bcryptjs

Client: Node.js, TypeScript, Inquirer, Axios

Testing: Jest, Supertest, ts-jest, MongoDB Memory Server

Background Jobs: node-cron

Email: Nodemailer with Ethereal.email for testing

Setup and Installation
Prerequisites
Node.js (LTS version recommended)

npm

Git

MongoDB (A local instance or a cloud service like MongoDB Atlas)

Backend Setup
Clone the repository:

git clone <your-repo-url>

Navigate to the server directory:

cd news-aggregator-server

Install dependencies:

npm install

Create the environment file:

Rename the .env.example file to .env.

Open the .env file and add your MongoDB connection string and your API keys for NewsAPI and The News API.

Seed the database:

Run this command to populate the database with the initial API source data.

npm run seed

Build and Run:

To run in development mode (with auto-restarting):

npm run dev

To build for production and run:

npm run build
npm start

The server will be running on http://localhost:3000.

Client Setup
Navigate to the client directory:

cd ../news-aggregator-client

Install dependencies:

npm install

Run the application:

Make sure the backend server is running first.

In a new terminal, run:

npm start

The interactive console application will now start.