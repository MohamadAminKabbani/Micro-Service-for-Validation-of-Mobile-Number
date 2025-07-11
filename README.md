
# Mobile Number Validator App

This project is a full-stack application that allows users to validate mobile phone numbers and perform CRUD operations. It uses a microservice to parse and validate phone numbers and integrates with a MongoDB backend.

## Features

-  Mobile number validation (country code, name, operator)
-  Add, update, delete, and retrieve user information
-  React-based frontend UI
-  Node.js & Express backend with MongoDB database
-  Dialog-based error handling and confirmation

##  Technologies Used

- Frontend: React, Material UI
- Backend: Node.js, Express
- Database: MongoDB (via Mongoose)
- Phone Validation: libphonenumber-js

## 📁 Project Structure

```
backend/
├── server.js
├── database.js
├── /frontend
│   ├── src/
│   │   ├── component/
│   │   │   ├── Header.tsx
│   │   │   ├── Menu.tsx
│   │   │   └── Done.tsx
│   │   ├── Mobile_Page/
│   │   │   ├── Mobile_Page.tsx
│   │   │   └── Mobile_Page.css
│   │   └── Header.css
```

## How It Works

After the phone number is entered, it is validated using `libphonenumber-js`. If the number is valid, a default user object is created with details like name, country code, and operator name and is sent to the `/adduser` API. If the user already exists in the database, their details are retrieved. Otherwise, the default data is saved.

The user can also click on the **"Get All Users"** button (in `Header.tsx`) to retrieve all stored user data using the `/getallusers` API.

##  API Endpoints

- `POST /adduser` — Add new user after phone validation
- `PUT /edituser/:phone_nbr` — Update user by phone number
- `DELETE /deleteuser/:phone_nbr` — Delete user by phone number
- `GET /getallusers` — Get all users
- `POST /getuser/:phone_nbr` — Get user by phone number

## Microservice

The phone number validation is handled as a microservice using:
```js
import { parsePhoneNumberFromString } from 'libphonenumber-js';
```
This ensures consistent and international validation across all formats.

## Database

MongoDB is used for storing all user data. Each user's phone number is treated as a unique identifier (ID) since it naturally distinguishes one user from another.

## How to Run

### Prerequisites:
- Node.js & npm installed
- MongoDB installed and running (`sudo service mongod start`)
- React installed via Vite or CRA

### Steps:

1. Install Backend Dependencies:
```bash
cd backend
npm install
```
2. Start MongoDB: (if not using Atlas)
```bash
sudo service mongod start
```
3. Run Backend:
```bash
node server.js
```
4. Run Frontend:
```bash
cd frontend
npm install
npm run dev
```

##  Notes

- The phone number is used as the primary ID in the database because it is unique.
- Default values are shown when the number is not recognized.
- Error dialogs handle invalid inputs and failed server calls.
#   M i c r o - S e r v i c e - f o r - V a l i d a t i o n - o f - M o b i l e - N u m b e r  
 