import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 9090;

// Path to your frontend build directory
const distPath = path.join(__dirname, '../../dist');

// Register middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(distPath));

// Health check endpoint
app.get('/api/health', (_: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve index.html for all non-API routes (SPA routing)
app.get('/', (_: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.get('/search', (_: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.get('/movies', (_: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Catch-all for any other routes
app.get('*', (_: Request, res: Response) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

// Global error handler
app.use((err: Error, _: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${distPath}`);
});
