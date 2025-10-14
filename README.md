# 🚗 Ride Booking API.

A robust and type-safe backend API for ride booking application such as ride request, accept ride, after complete ride then make payment with SSL Commerz, Cancel ride functionality, view a driver earning using aggreation pipeline with mongoose, etc. functionality made in this project. To built the project, using- 
**Express.js**, 
**TypeScript**, 
**MongoDB** 
**Mongoose**.

---

## 🎯 Objective

Develop a full-featured Ride Booking System API that supports ride request, accept ride, after complete ride then make payment with SSL Commerz, Cancel ride functionality, view a driver earning using aggreation pipeline with mongoose, etc..

---

## 🛠️ Tech Stack

- **Backend Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ODM**: Mongoose
- **Runtime**: Node.js

---

## 🗂️ Project Structure
<pre>
src/
|--app
    ├── config/ # Environment Variable Config
    ├── errorhelpers/ # Custom error functionality
    ├── helpers/ # All occur error functionality
    ├── interfaces/ # All global interfaces
    ├── middleware/ # All middlewares
    ├── modules/ # All modules
    ├── routes/ # API route definitions
    ├── utils/ # All utility functionality
├── app.ts # app setup
└── server.ts # Entry point
</pre>

## 🔧 Core Features

- 🔓 User login functionality. (JWT Login and password hasing).
- 👨🏻 Role based middleware.
- 🚗 Ride request.
- ✅ Autometic give driver if they are available for give ride.
- ❌ Ride Cancelation rules.
- 💵 Payment functionality after completing a ride.
- 🔍 History of Ride

## 🌐 API Endpoints
<pre>
    Base API: 
        # https://ride-bookings.vercel.app/api/v1
    
    1. 👤 User:- 
            # /user
                # POST /register --> User Register
                # GET /all-user -->  Get All Users
                # PATCH /block/:id --> Block A Specific User
    2. 🔐 Auth:-
            # /auth
                # POST /login --> User Login
                # POST /logout --> User Logout
    3. 🚗 Ride:
            # /rides
                # POST /request --> Ride Request
                # POST /:id --> Update Ride Status
                # GET /me/:id --> Get A Specific Ride Information Using ID
                # POST /cancel/:id --> Cancel A Specific Ride
    4. 🛞 Driver:
            # /drivers
                # POST /register/:id --> Request for Driving Role
                # PATCH /approve/:id --> Accept OR Reject Drivier Application for Driving
                # GET / --> Get All Drivers Information
                # POST /setAvailability/:driverId --> Driver Can Set His Availability
                # GET /viewMyEarning/:driverId --> Driver Can View His Earning History
    5. 💵 Payment:
            # /payment
                # POST /init-payment/:rideId --> Get Payment URL
                # POST /success --> Payment Success 
                # POST /cancel --> Payment Cancel 
                # POST /failed --> Payment Failed 
                # POST /validate-payment --> IPN Payment Validate 
    
    
    
</pre>
    
    

**Getting Started**
- git clone [https://github.com/tzmehedy/ride-bookings-API.git](https://github.com/tzmehedy/ride-bookings-API.git) 
- cd ride-bookings-API**
- npm install**

**Run**
- npm run dev        # Development
- npm run build      # Build

**Live Link**
- [https://ride-bookings.vercel.app/](https://ride-bookings.vercel.app/)






