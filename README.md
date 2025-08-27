# Nursery Admin Management Backend

A robust backend service that extends an existing Firebase infrastructure for the Nursery Admin Management system, built with TypeScript and Express.js.

## Overview

Nursery Admin Management is a comprehensive backend solution that integrates with a pre-existing Firebase database originally developed for a mobile application. This volunteer-driven project extends the existing infrastructure to provide enhanced functionality for managing child care facilities, including class management, attendance tracking, and user management for administrators, nannies, and parents.

## Integration Details

- Built on top of existing Firebase infrastructure
- Extended database schema with additional fields for enhanced functionality
- Carefully designed payload structures for optimal frontend-backend communication
- Maintained compatibility with existing mobile application data structure

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Firebase Admin
- **Architecture**: Layered Architecture with Repository Pattern
- **Dependency Management**: Dependency Injection (di-container)

## Key Features

- 👥 User Management (Admin, Nanny, Parent roles)
- 👶 Children Profile Management
- 📚 Class Management and Assignment
- 📊 Attendance Tracking
- 📱 Push Notifications
- 🔐 Secure API with Admin API Key middleware
- ✅ Input Validation and Error Handling

## Project Structure

```
src/
├── controllers/     # Request handlers
├── services/       # Business logic
├── repositories/   # Data access layer
├── middlewares/    # Custom middlewares
├── dtos/          # Data transfer objects
├── schemas/       # Data validation schemas
├── types/         # TypeScript type definitions
└── utils/         # Helper functions
```

## Security Features

- Firebase Admin integration for secure authentication
- Role-based access control
- Admin API key validation
- Input validation and sanitization
- Error handling middleware

## API Endpoints

The API includes endpoints for:
- User management (admin, nanny, parent)
- Children management
- Class management
- Attendance tracking
- Notifications

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the application:
   - Set up ADMIN_API_KEY in environment variables
   - Place your Firebase Admin SDK service account key in `config/ServiceAccountKey.json`
   
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

- Uses TypeScript for type safety
- Implements layered architecture principles with clear separation of concerns
- Follows repository pattern for data access abstraction
- Includes comprehensive error handling
- Features middleware for authentication and authorization
