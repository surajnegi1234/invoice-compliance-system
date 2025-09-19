const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const {tenantMiddleware} = require('./middleware/tenant');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const documentRoutes = require('./routes/documents');
const assignmentRoutes = require('./routes/assignments');
const activityRoutes = require('./routes/activities');
const tenantRoutes = require('./routes/tenants');

const app = express();

// db connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('mongodb connected'))
  .catch(err => {
    console.error('db connection failed:', err);
    process.exit(1);
  });

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID']
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: 'Too many requests, please try again later'
  }
});
app.use(limiter);

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working', timestamp: new Date().toISOString() });
});

app.use(tenantMiddleware);

app.use('/api/tenants', tenantRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/activities', activityRoutes);




app.use((err,req,res,next) => {
  console.error('error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' && {stack: err.stack})
  });
});


app.use('*', (req,res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/api/auth/login', '/api/tenants', '/test']
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` server running on port ${PORT}`);
});