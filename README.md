# Invoice & Compliance Management System

A multi-tenant web application for managing invoices and compliance documents with role-based access control.

## Tech Stack

**Frontend:**
- React.js 18
- Custom CSS (no frameworks)
- Axios for API calls
- React Hot Toast for notifications

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- bcrypt for password hashing

**Features:**
- Multi-tenant architecture
- Role-based access (Admin, Auditor, Vendor)
- Document upload and review workflow
- Activity logging and reporting
- Email reminder system

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Test-Assignment
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. **Setup database**
```bash
cd backend
npm run seed
```

4. **Start the application**
```bash
# Start backend (in one terminal)
cd backend
npm run dev

# Start frontend (in another terminal)
cd frontend
npm start
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Test Credentials

**Admin Account:**
- Email: admin@test.com
- Password: admin123

**Auditor Account:**
- Email: auditor@test.com
- Password: auditor123

**Vendor Accounts:**
- Email: vendor@test.com / Password: vendor123
- Email: vendor2@test.com / Password: vendor123

## Testing Workflows

### Admin Flow
1. Login with admin credentials
2. Create new users (auditors and vendors)
3. Create assignments between auditors and vendors
4. View all system documents and activities

### Auditor Flow
1. Login with auditor credentials
2. View assigned vendors
3. Review uploaded documents
4. Approve/reject documents
5. Send reminders to vendors
6. Generate activity reports

### Vendor Flow
1. Login with vendor credentials
2. Upload documents (invoices, certificates, etc.)
3. View document status
4. Track approval/rejection history

## Project Structure

```
Test-Assignment/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.js
│   ├── seeds/
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── styles/
│   └── package.json
└── README.md
```

## Hosted URL

*Note: This is a local development setup. For production deployment, the application can be hosted on:*
- Frontend: Vercel, Netlify
- Backend: Render, Railway, Heroku
- Database: MongoDB Atlas

## Key Features

**Multi-tenant Architecture:**
- Each tenant has isolated data
- Role-based access control
- Secure authentication with JWT

**Document Management:**
- File upload with validation
- Status tracking (pending → under review → approved/rejected)
- Activity logging for audit trails

**User Roles:**
- Admin: Full system control
- Auditor: Review documents from assigned vendors
- Vendor: Upload and track documents

## Environment Configuration

The backend uses environment variables in `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/invoice_compliance
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## Troubleshooting

**MongoDB Connection Issues:**
- Ensure MongoDB is running locally
- Check connection string in .env file
- Verify MongoDB service is started

**Port Conflicts:**
- Backend runs on port 5000
- Frontend runs on port 3000
- Kill existing processes if ports are in use

**Common Issues:**
- Clear browser cache if login issues occur
- Restart both servers if API calls fail
- Check console for error messages
