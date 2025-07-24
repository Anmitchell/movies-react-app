import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

// Path to your frontend build directory (e.g., Vite or React build)
const distPath = path.join(__dirname, '../../dist');

// Register middleware:
// - CORS for cross-origin requests
// - JSON body parsing for incoming requests
// - Serve static files from the dist directory
app.use(cors(), express.json(), express.static(distPath));

// Health check endpoint for monitoring or testing
app.get('/api/health', (_: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Catch-all route to serve your SPA (index.html for React Router or similar)
app.use((_: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Global error handler for uncaught errors in routes or middleware
app.use((err: Error, _: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
