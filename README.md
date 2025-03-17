🚀 React Check-In App - Node API

Welcome to the React Check-In App - Node API! This is the backend
service that powers the check-in system, providing authentication, user
management, and admin control functionalities. Built with Node.js,
Express, and MongoDB, it ensures a secure and efficient API for the
consuming application.

📌 Features

✅ RESTful API for seamless integration with the frontend.

✅ User Check-Ins - Users can submit and retrieve their check-ins.

✅ Admin Controls - Admins can manage check-ins (create, update, delete,
publish, unpublish) and retrieve analytical data.

✅ Authentication & Authorization using Auth0.

✅ MongoDB Atlas for scalable and reliable data storage.

✅ Secure API Calls with Auth0 token validation.

📡 API Endpoints

🔹 User Endpoints

Handles user-specific check-ins.

POST /api/user/submitCheckIn ➝ Submits a check-in for the user logged
in.

GET /api/user/answeredCheckIn ➝ Retrieve a published check-in for the
user if it is answered.

GET /api/user/getAllSubmittedCheckIn ➝ Retrieve all user answered
check-ins.

🔹 Admin Endpoints

Manages all admin-related functionalities.

POST /api/admin/check-in ➝ Create a new check-in.

PUT /api/admin/check-in/:id ➝ Update an existing check-in.

DELETE /api/admin/check-in/:id ➝ Remove a check-in.

PATCH /api/admin/check-in/:id/publish ➝ Publish a check-in.

PATCH /api/admin/check-in/:id/unpublish ➝ Unpublish a check-in.

GET /api/admin/analytics ➝ Retrieve analytical data.

🔹 Authentication Endpoints

Handles user authentication and registration.

POST /api/auth/register ➝ Registers a user in MongoDB.

POST /api/auth/users ➝ Fetches a user from MongoDB.

🛠️ Tech Stack

Backend: Node.js, Express

Database: MongoDB (Hosted on MongoDB Atlas)

Authentication: Auth0

Hosting: AWS EC2 (GitHub Runner for CI/CD)

Packaged: Docker using Docker Hub

🚀 Getting Started

1️⃣ Clone the Repository

git clone https://github.com/yourusername/react-check-in-app-node.git cd
react-check-in-app-node

2️⃣ Install Dependencies

npm install

3️⃣ Set Up Environment Variables

Create a .env file for local development:

PORT=YOUR_PORT MONGO_URL=mongodb+srv://your-dev-db-url
CORS_ORIGIN_URL=http://localhost:{PORT_OF_CONSUMING_APP}
AUTH0_DOMAIN=your-auth0-domain AUTH0_AUDIENCE=your-auth0-audience

4️⃣ Run the Application

npm start

The API will be available at http://localhost:{PORT} (or your configured
port).

🔥 Deployment

This API is deployed using GitHub Actions & AWS EC2. The deployment
pipeline ensures seamless updates with:

GitHub Runner for automated deployments.

📬 Contributing

We welcome contributions! Feel free to fork the repo and submit pull
requests.

📜 License

This project is licensed under the MIT License.
