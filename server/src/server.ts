import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app build
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve React app for all other routes (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 React app will be served from: http://localhost:${PORT}`);
  console.log(`📁 Static files served from: ${publicPath}`);
}); 