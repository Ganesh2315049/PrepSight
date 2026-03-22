# PrepSight - Placement Intelligence System

PrepSight is a full-stack application for managing placement experiences with authentication, admin features, and dashboard.

## Tech Stack

**Backend:** Spring Boot 3.3.4 (Java 17) + Maven + MySQL + JWT + OAuth2  
**Frontend:** React 18 (Create React App)  
**Database:** MySQL

## Quick Start

### Backend
```bash
cd backend
mvn spring-boot:run
```
Default: http://localhost:8080

### Frontend
```bash
cd frontend
npm install
npm start
```
Default: http://localhost:3000

### Database
Update `backend/src/main/resources/application.properties` with MySQL credentials.

## Features
- User authentication (JWT + OAuth2/Google)
- Admin user management
- Experience CRUD
- Dashboard
- Multi-language support (Google Translate)

## API Docs
See backend controllers: AuthController, AdminUserController, ExperienceController
