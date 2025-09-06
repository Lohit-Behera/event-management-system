# Event Management System

A comprehensive full-stack event management system built with FastAPI (backend) and Next.js (frontend), featuring timezone support, pagination, and modern UI components.

## 🌐 Live Demo

- **Frontend App**: [https://event-management-system-ifab.vercel.app](https://event-management-system-ifab.vercel.app)
- **Backend API**: [https://event-management-system-blush-five.vercel.app](https://event-management-system-blush-five.vercel.app)
- **API Documentation**: [https://event-management-system-blush-five.vercel.app/docs](https://event-management-system-blush-five.vercel.app/docs)

## 🚀 Features

### Backend (FastAPI)

- **Event Management**: Create, list, and manage events
- **Attendee Registration**: Register attendees with duplicate prevention
- **Timezone Support**: Full timezone management with IST as default
- **Pagination**: Efficient pagination for large attendee lists
- **Data Validation**: Comprehensive input validation and error handling
- **Database**: PostgreSQL with direct psycopg2 connections
- **Health Monitoring**: Comprehensive health check endpoints
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

### Frontend (Next.js)

- **Modern UI**: Built with Shadcn UI components
- **Responsive Design**: Mobile-first responsive design
- **Dark/Light Mode**: Theme switching capability
- **Real-time Updates**: Dynamic event and attendee management
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

### Backend

- **FastAPI** - Modern, fast web framework
- **psycopg2** - PostgreSQL database adapter for Python
- **PostgreSQL** - Robust relational database
- **Pydantic** - Data validation using Python type annotations
- **Pytz** - Timezone handling
- **python-dotenv** - Environment variable management

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - Modern component library
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+
- **PostgreSQL** 12+
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Lohit-Behera/event-management-system
cd event-management-system
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv myenv

# Activate virtual environment
# On Windows:
myenv\Scripts\activate
# On macOS/Linux:
source myenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create .env file with your database credentials:
# user=your_username
# password=your_password
# host=localhost
# port=5432
# dbname=event_management

# Start the backend server
python main.py
```

The backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
user=your_username
password=your_password
host=localhost
port=5432
dbname=event_management
```

### Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE event_management;
```

2. Database tables are created automatically on startup - no migrations needed!

## 📚 API Documentation

### Interactive Documentation

- **Live API Docs**: [https://event-management-system-blush-five.vercel.app/docs](https://event-management-system-blush-five.vercel.app/docs)
- **ReDoc**: [https://event-management-system-blush-five.vercel.app/redoc](https://event-management-system-blush-five.vercel.app/redoc)

For local development:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Core Endpoints

#### Events

- `POST /events` - Create a new event
- `GET /events` - List all events (with pagination)
- `GET /events/{event_id}` - Get event details with attendees
- `GET /events/{event_id}/timezone` - Get event with timezone conversion

#### Attendees

- `POST /events/{event_id}/register` - Register an attendee
- `GET /events/{event_id}/attendees` - Get event attendees (with pagination)
- `GET /events/{event_id}/attendees/count` - Get attendee count

#### Utilities

- `GET /timezones` - Get supported timezones

#### Health & Monitoring

- `GET /` - API root endpoint
- `GET /health` - Basic API health check (no database required)
- `GET /health/db` - Database connection health check with detailed information
- `GET /health/full` - Comprehensive health check including API and database status

### Sample API Requests

#### Create Event

```bash
curl -X POST "http://localhost:8000/events" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2024",
    "location": "Convention Center, Mumbai",
    "start_time": "2024-06-15T09:00:00",
    "end_time": "2024-06-15T17:00:00",
    "max_capacity": 500,
    "timezone": "IST"
  }'
```

#### Register Attendee

```bash
curl -X POST "http://localhost:8000/events/1/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com"
  }'
```

#### Get Events with Pagination

```bash
curl -X GET "http://localhost:8000/events?skip=0&limit=10"
```

#### Get Attendees with Pagination

```bash
curl -X GET "http://localhost:8000/events/1/attendees?skip=0&limit=20"
```

#### Health Check Examples

```bash
# Basic API health check
curl -X GET "https://event-management-system-blush-five.vercel.app/health"

# Database connection health check
curl -X GET "https://event-management-system-blush-five.vercel.app/health/db"

# Full system health check
curl -X GET "https://event-management-system-blush-five.vercel.app/health/full"
```

## 🌍 Advanced Timezone Support

The system provides comprehensive timezone management with IST as the default, supporting 8 major timezones worldwide:

### Supported Timezones

| Abbreviation | Full Name                                           | UTC Offset | Region        |
| ------------ | --------------------------------------------------- | ---------- | ------------- |
| **IST**      | Indian Standard Time (Asia/Kolkata)                 | +05:30     | India         |
| **UTC**      | Coordinated Universal Time                          | +00:00     | Global        |
| **EST**      | Eastern Standard Time (America/New_York)            | -05:00     | US East Coast |
| **PST**      | Pacific Standard Time (America/Los_Angeles)         | -08:00     | US West Coast |
| **GMT**      | Greenwich Mean Time (Europe/London)                 | +00:00     | UK            |
| **CET**      | Central European Time (Europe/Paris)                | +01:00     | Europe        |
| **JST**      | Japan Standard Time (Asia/Tokyo)                    | +09:00     | Japan         |
| **AEST**     | Australian Eastern Standard Time (Australia/Sydney) | +10:00     | Australia     |

### Timezone Features

- **Automatic UTC Conversion**: All times are stored in UTC in the database for consistency
- **Real-time Conversion**: Times are converted to user's preferred timezone for display
- **Timezone Validation**: Only supported timezones are accepted
- **Dynamic Offset Calculation**: UTC offsets are calculated dynamically for DST changes
- **Frontend Integration**: Seamless timezone handling in the React frontend

### Timezone API Endpoints

#### Get Supported Timezones

```bash
curl -X GET "https://event-management-system-blush-five.vercel.app/timezones"
```

Response:

```json
[
  {
    "timezone": "Asia/Kolkata",
    "display_name": "IST (Asia/Kolkata)",
    "utc_offset": "+05:30"
  },
  {
    "timezone": "UTC",
    "display_name": "UTC (UTC)",
    "utc_offset": "+00:00"
  }
]
```

#### Get Event with Timezone Conversion

```bash
# Get event times in different timezones
curl -X GET "https://event-management-system-blush-five.vercel.app/events/1/timezone?timezone=EST"
curl -X GET "https://event-management-system-blush-five.vercel.app/events/1/timezone?timezone=UTC"
curl -X GET "https://event-management-system-blush-five.vercel.app/events/1/timezone?timezone=PST"
```

Response:

```json
{
  "id": 1,
  "name": "Tech Conference 2024",
  "location": "Convention Center, Mumbai",
  "start_time": "2024-06-15T09:00:00Z",
  "end_time": "2024-06-15T17:00:00Z",
  "max_capacity": 500,
  "attendee_count": 25,
  "timezone": "IST",
  "start_time_local": "2024-06-14 23:30:00 EST",
  "end_time_local": "2024-06-15 07:30:00 EST",
  "timezone_display": "EST (America/New_York)"
}
```

### Frontend Timezone Integration

The frontend provides comprehensive timezone utilities:

- **Automatic Detection**: Detects user's local timezone
- **Formatting Functions**: Format dates/times in any supported timezone
- **Timezone Selection**: Dropdown with all supported timezones
- **Real-time Updates**: Times update automatically when timezone changes
- **Duration Calculation**: Calculate event duration across timezones

### Creating Events with Timezone

```bash
# Create event in IST (default)
curl -X POST "http://localhost:8000/events" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2024",
    "location": "Convention Center, Mumbai",
    "start_time": "2024-06-15T09:00:00",
    "end_time": "2024-06-15T17:00:00",
    "max_capacity": 500,
    "timezone": "IST"
  }'

# Create event in EST
curl -X POST "http://localhost:8000/events" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "US Tech Summit",
    "location": "New York Convention Center",
    "start_time": "2024-06-15T09:00:00",
    "end_time": "2024-06-15T17:00:00",
    "max_capacity": 300,
    "timezone": "EST"
  }'
```

## 📊 Database Schema

### Events Table

```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    max_capacity INTEGER NOT NULL,
    timezone VARCHAR NOT NULL DEFAULT 'IST'
);
```

### Attendees Table

```sql
CREATE TABLE attendees (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    event_id INTEGER NOT NULL REFERENCES events(id)
);
```

## 🧪 Testing

### Backend Testing

```bash
cd backend
# Install dependencies
pip install -r requirements.txt

# Test database connection
python -c "from database import test_connection; test_connection()"

# Start the application
python main.py
```

### Frontend Testing

```bash
cd frontend
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Backend Deployment

1. **Using Docker**:

```bash
cd backend
docker build -t event-management-api .
docker run -p 8000:8000 event-management-api
```

2. **Using Gunicorn**:

```bash
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker
```

### Frontend Deployment

1. **Build for production**:

```bash
cd frontend
npm run build
```

2. **Deploy to Vercel/Netlify**:

```bash
# The build output in .next/ can be deployed to any static hosting service
```

## 📁 Project Structure

```
event-management-system/
├── backend/
│   ├── myenv/                   # Python virtual environment
│   ├── main.py                  # FastAPI application
│   ├── models.py                # Python dataclass models
│   ├── schemas.py               # Pydantic schemas
│   ├── crud.py                  # Database operations with psycopg2
│   ├── database.py              # PostgreSQL connection management
│   ├── config.py                # Application configuration
│   ├── timezone_utils.py        # Timezone utilities
│   ├── requirements.txt         # Python dependencies
│   └── API_DOCUMENTATION.txt    # API documentation
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js app directory
│   │   ├── components/          # React components
│   │   └── lib/                 # Utility functions
│   ├── public/                  # Static assets
│   ├── package.json             # Node.js dependencies
│   └── next.config.ts           # Next.js configuration
└── README.md                    # This file
```

## 🔒 Security Features

- **Input Validation**: Comprehensive validation using Pydantic
- **SQL Injection Prevention**: Parameterized queries with psycopg2
- **CORS Configuration**: Properly configured CORS middleware
- **Error Handling**: Detailed error messages without sensitive information
- **Data Sanitization**: Email validation and data cleaning
- **Health Monitoring**: Comprehensive health check endpoints for production monitoring

## 🚨 Error Handling

The API provides detailed error responses:

- **400 Bad Request**: Invalid input data or business rule violations
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server-side errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [Live API Documentation](https://event-management-system-blush-five.vercel.app/docs)
2. Review the [Issues](https://github.com/Lohit-Behera/event-management-system/issues) page
3. Create a new issue with detailed information

## 🎯 Future Enhancements

- [ ] User authentication and authorization
- [ ] Event categories and tags
- [ ] Email notifications
- [ ] Event analytics and reporting
- [ ] Mobile app support
- [ ] Real-time updates with WebSockets
- [ ] File upload for event images
- [ ] Event search and filtering
- [ ] Calendar integration
- [ ] Multi-language support

---

**Built with ❤️ using FastAPI and Next.js**
