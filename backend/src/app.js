import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import clientRoutes from './routes/client.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import noticeRoutes from './routes/notice.routes.js';
import activityRoutes from './routes/activity.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigin = process.env.FRONTEND_URL;
    if (!origin || origin.startsWith('http://localhost:') || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Base Route
app.get('/', (req, res) => {
  res.json({ message: 'HRCRM API is running' });
});

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/reports', reportsRoutes);

export default app;
