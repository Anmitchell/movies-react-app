# 🚀 Express Server for Movie App

A TypeScript Express server that serves the React movie app and provides API endpoints.

## 🛠️ Features

- **Static File Serving** - Serves the built React app
- **API Routes** - Health check and future API endpoints
- **CORS Support** - Cross-origin resource sharing enabled
- **Error Handling** - Comprehensive error middleware
- **TypeScript** - Full type safety
- **Environment Configuration** - Environment variable support

## 📦 Installation

```bash
# Install dependencies
npm install

# Install dev dependencies
npm install -D typescript @types/express @types/cors @types/node ts-node nodemon
```

## 🚀 Development

```bash
# Start development server with hot reload
npm run dev

# Build TypeScript to JavaScript
npm run build

# Start production server
npm start
```

## 🌐 API Endpoints

| Endpoint      | Method | Description                    |
| ------------- | ------ | ------------------------------ |
| `/api/health` | GET    | Server health check            |
| `/*`          | GET    | Serves React app (SPA routing) |

## 📁 Project Structure

```
server/
├── src/
│   └── server.ts          # Main server file
├── public/                # Built React app (copied from dist/)
├── dist/                  # Compiled TypeScript
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── nodemon.json          # Development configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
PORT=3000
NODE_ENV=development
```

### Build Process

1. React app is built to `dist/`
2. Built files are copied to `server/public/`
3. Express serves static files from `public/`

## 🚀 Deployment

### Local Deployment

```bash
# From root directory
npm run deploy
```

### Production Deployment

```bash
# Build React app and copy to server
npm run build:deploy

# Build and start server
cd server
npm run build
npm start
```

## 🔍 Health Check

Test the server:

```bash
curl http://localhost:3000/api/health
```

Response:

```json
{
  "status": "OK",
  "message": "Server is running"
}
```

## 📝 Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run deploy` - Build and deploy (from root)

## 🔒 Security

- CORS enabled for cross-origin requests
- Static file serving with proper headers
- Error handling middleware
- Environment variable configuration

---

**Server runs on port 3000 by default**
