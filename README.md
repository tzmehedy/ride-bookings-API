🚖 Ride Booking API

A secure, scalable, and role-based backend API for a ride booking system (like Uber, Pathao) built with Express.js and Mongoose.

This system allows riders to request rides, drivers to accept and complete rides, and admins to manage the overall platform.

🎯 Project Overview

Key Features:

🔐 Authentication – JWT-based login with hashed passwords (bcrypt).

🎭 Role-based Authorization – Admin, Rider, and Driver.

🧍 Rider Features – Request/cancel rides, view ride history.

🚗 Driver Features – Accept/reject rides, update status, earnings history.

🛠 Admin Features – Manage users, approve/suspend drivers, monitor rides.

📦 Clean Modular Architecture – Organized, production-ready folder structure.

📌 Function

✅ Riders

Request a ride (pickup & destination).

Cancel a ride (within allowed window).

View ride history.

✅ Drivers

Accept/reject ride requests.

Update ride status: requested → accepted → picked_up → in_transit → completed.


✅ Admins

View/manage all users, drivers, rides.

Approve/suspend drivers.

Block/unblock users.

✅ General

Secure password hashing (bcrypt).

Role-based route protection (JWT + middleware).

Complete ride history tracking.

📂 Project Structure
src/
├── App/
| |-modules/
│ |   ├── auth/        
│ |   ├── user/        
│ |   ├── driver/      
│ |   ├── ride/        
| | middlewares/     
| |-config/          
| |-utils/           
├── app.ts 
├── server.ts          

⚙️ Setup Instructions
1️⃣ Clone the repository
git clone https://github.com/tzmehedy/ride-bookings-API.git
cd ride-booking-api

2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables

Create a .env file in the project root:


4️⃣ Run the server
npm run dev   # development mode
npm run build # build for production
npm start     # production mode

🚀 API Endpoints
🔐 Auth

POST /auth/register – Register (admin/rider/driver).

POST /auth/login – Login & get JWT.

🧍 Rider

POST /rides/request – Request a ride.

PATCH /rides/cancel/:id – Cancel a ride.

GET /rides/me – View ride history.

🚗 Driver
POST /driver/request - Register driver

PATCH /rides/approve/:id – Accept a ride.

PATCH /rides/:id/status – Update ride status.
 
🛠 Admin

GET /users – View all users.

PATCH /drivers/approve/:id – Approve/suspend driver.

PATCH /users/block/:id – Block/unblock user.

GET /rides – View all rides.
