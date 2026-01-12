# System Notification

A real-time notification system that monitors database changes and notifies connected clients via WebSocket. Built with FastAPI, Socket.IO, RethinkDB, React, and TypeScript.

## Features

- **Real-time Protocol Monitoring**: Automatically notifies users when a specific protocol is updated
- **Socket.IO Integration**: WebSocket communication for instant updates
- **Room-based Notifications**: Only users viewing a specific protocol receive updates
- **Connection Tracking**: Real-time display of active connections
- **RethinkDB Changefeeds**: Leverages RethinkDB's built-in change detection
- **Docker Support**: Full containerization with Docker Compose

## Architecture

### Backend (FastAPI + Socket.IO)
- FastAPI server with Socket.IO integration
- RethinkDB changefeed monitoring
- Observer pattern for event distribution
- Room-based WebSocket communication

### Frontend (React + TypeScript)
- Real-time connection status
- Protocol-specific room subscription
- Automatic disconnect on protocol updates
- Axios for HTTP requests
- Socket.IO client for WebSocket

## Prerequisites

- Docker and Docker Compose (for containerized deployment)
- OR:
  - Python 3.13+
  - Node.js 20+
  - RethinkDB 2.4+

## Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd system_notification
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Start all services:
```bash
docker-compose up -d
```

4. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:9999
   - RethinkDB Admin: http://localhost:8080

## Local Development

### Backend Setup

1. Install dependencies:
```bash
# Using uv (recommended)
uv sync

# Or using pip
pip install -e .
```

2. Configure environment variables in `.env`:
```env
BACKEND_HOST=localhost
BACKEND_PORT=9999
RETHINKDB_HOST=localhost
RETHINKDB_PORT=28015
RETHINKDB_DB=process
RETHINKDB_TABLE=modified
```

3. Start RethinkDB:
```bash
rethinkdb
```

4. Run the backend:
```bash
python backend/main.py
```

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:9999
```

3. Start the development server:
```bash
npm run dev
```

## Usage

### Monitoring a Protocol

1. Navigate to `/item/{protocol_id}` (e.g., `/item/5`)
2. The client automatically joins the protocol's room
3. When the protocol is updated (via API or database), an alert appears
4. The Socket.IO connection closes after notification

### Updating a Protocol

Click the "Update" button on the protocol page, or make a POST request:

```bash
curl -X POST http://localhost:9999/protocol/5
```

### API Endpoints

- `GET /protocols` - List all protocols
- `POST /protocol/{process_id}` - Update a protocol
- `GET /connections` - Get active Socket.IO connections

### Socket.IO Events

**Client → Server:**
- `join_protocol` - Join a protocol room
- `leave_protocol` - Leave a protocol room

**Server → Client:**
- `connect` - Connection established
- `disconnect` - Connection closed
- `total_connections` - Total active connections update
- `protocol_updated` - Protocol change notification

## Project Structure

```
system_notification/
├── backend/
│   ├── app.py              # FastAPI application & routes
│   ├── background.py       # RethinkDB changefeed observer
│   ├── config.py           # Pydantic settings
│   ├── main.py             # Entry point
│   ├── rethink.py          # RethinkDB connection
│   ├── sio.py              # Socket.IO server
│   └── Dockerfile
├── frontend/
│   ├── pages/
│   │   └── item.tsx        # Protocol detail page
│   ├── libs/
│   │   ├── http.ts         # Axios client
│   │   └── socket.ts       # Socket.IO client
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## Environment Variables

### Backend
- `BACKEND_HOST` - Server host (default: localhost)
- `BACKEND_PORT` - Server port (default: 9999)
- `RETHINKDB_HOST` - RethinkDB host (default: localhost)
- `RETHINKDB_PORT` - RethinkDB port (default: 28015)
- `RETHINKDB_DB` - Database name (default: process)
- `RETHINKDB_TABLE` - Table name (default: modified)

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:9999)

## Technologies

### Backend
- **FastAPI** - Modern Python web framework
- **Socket.IO** - Real-time bidirectional communication
- **RethinkDB** - Real-time database with changefeeds
- **Pydantic** - Data validation and settings management
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Socket.IO Client** - WebSocket client
- **Axios** - HTTP client
- **TailwindCSS** - Utility-first CSS

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
