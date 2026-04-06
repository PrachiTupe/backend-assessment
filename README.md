#  Finance Dashboard System (Full Stack)

##  Overview
This project is a Finance Dashboard System built with Role-Based Access Control (RBAC). It allows different types of users to manage and view financial data securely based on their roles.

Tech Used:
- Backend: Node.js + Express + MongoDB
- Frontend: Next.js (API Testing Playground)
- Authentication: JWT Tokens
- Security: Bcrypt Password Hashing

Roles in system:
- Admin
- Manager
- User
- Viewer



## Live Project Links
Backend API: https://backend-assessment-u4zg.onrender.com/  
Frontend (API Testing UI): https://finance-dashboard-azure-rho.vercel.app/



##  Authentication & Security
- User Registration & Login
- Password hashing using Bcrypt
- JWT-based authentication
- Token required for all protected routes

Validations:
- User already exists
- Invalid password
- User not found
- Unauthorized access



##  Role-Based Access Control

### Admin
- Register & Login
- Create Manager
- Assign Manager to User
- Get all users
- View summaries (user, overall, category)
- Change password

### Manager
- View assigned users & viewers
- Get assigned user transactions
- View summaries
- Change password

### User
- Create Transaction
- Get Transactions
- Update Transaction
- Soft Delete Transaction
- Add Viewer
- Delete Viewer
- View summaries
- Change password

### Viewer
- View assigned user transactions
- View summaries
- Change password

---

##  Tech Stack
Frontend: Next.js, Tailwind CSS  
Backend: Node.js, Express  
Database: MongoDB  
Auth: JWT  
Security: Bcrypt  
Deployment: Render & Vercel  


## Folder Structure
backend/
- routes/
-controllers/
- models/
-middleware/
- config/
-server.js



## Run Locally

1. Clone repo
git clone <your-repo-link>
cd backend

2. Install dependencies
npm install

3. Create .env file
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
PORT=5000

4. Start server
npm run dev

Server: http://localhost:5000



## API Testing

Option 1 (Recommended):
Use frontend → https://finance-dashboard-azure-rho.vercel.app/

Option 2 (Postman):
1. Login → get token  
2. Add header:
Authorization: Bearer <token>


## APIs Included
- Auth APIs (Register/Login)
- User APIs
- Manager APIs
- Transaction APIs
- Summary APIs



## Notes
- All routes protected using JWT
- Role-based access implemented
- Transactions support soft delete
- Fully deployed and working