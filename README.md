# PrepSight

PrepSight is a full-stack placement interview tracking system.
It provides authentication, experience CRUD, analytics dashboards, and admin user management.

## Verified Status

The project was checked on this workspace with the following results:

- Backend build: success (`mvn clean test`, `mvn clean package`)
- Backend runtime: success (`java -jar target/prepsight-backend-0.0.1-SNAPSHOT.jar`, listening on `8080`)
- Frontend install: success (`npm install`)
- Frontend build: success (`npm run build`)
- Frontend runtime: success (`npm start`, listening on `3000`)
- Frontend tests: no test files currently present (`npx react-scripts test --watchAll=false --passWithNoTests`)

## Tech Stack

### Backend
- Java 17
- Spring Boot 3.3.4
- Spring Security + JWT
- OAuth2 (Google login)
- Spring Data JPA
- MySQL
- Maven

### Frontend
- React 18 (Create React App)
- React Router DOM
- Axios
- Framer Motion
- React Hot Toast

## Project Structure

```text
PrepSight/
	backend/
		src/main/java/com/prepsight/
			config/        # security and bootstrap config
			controller/    # REST API controllers
			dto/           # request/response DTOs
			model/         # JPA entities and enums
			repository/    # Spring Data repositories
			security/      # JWT filter/service and OAuth handlers
			service/       # business logic
		src/main/resources/
			application.properties
		pom.xml

	frontend/
		src/
			components/    # reusable UI components
			pages/         # route-level screens
			api.js         # API calls
			App.js         # route/app wiring
			App.css        # styling
		package.json

	.env              # backend environment values
	README.md
```

## Prerequisites

Install these before running:

- Java JDK 17
- Maven 3.9+
- Node.js 18+ and npm
- MySQL 8+

## Environment Variables

Backend reads variables from root `.env` via:

`spring.config.import=optional:file:../.env[.properties]`

Required keys in root `.env`:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `FRONTEND_URL`
- `JWT_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Frontend `.env` (`frontend/.env`):

- `REACT_APP_API_URL` (example: `http://localhost:8080/api`)

## How To Run

### 1. Start Backend

```bash
cd backend
mvn clean package
java -jar target/prepsight-backend-0.0.1-SNAPSHOT.jar
```

Backend URL: `http://localhost:8080`

### 2. Start Frontend

```bash
cd frontend
npm install
npm start
```

Frontend URL: `http://localhost:3000`

## Build And Test Commands

### Backend

```bash
cd backend
mvn clean test
mvn clean package
```

### Frontend

```bash
cd frontend
npm install
npm run build
npx react-scripts test --watchAll=false --passWithNoTests
```

## Main Functional Areas

- Authentication
	- Username/password login
	- Google OAuth login
	- JWT-based authorization
- Experience Management
	- Add, edit, delete, search interview experiences
- Dashboard
	- Topic and difficulty analytics
- Admin Panel
	- User creation/update/delete and status management

## Important Runtime Note

If `mvn spring-boot:run` fails on Windows path encoding environments, use:

```bash
mvn clean package
java -jar target/prepsight-backend-0.0.1-SNAPSHOT.jar
```

This path is already verified in this project.

## Security Note

If any real credentials were previously committed to git history, rotate them (DB password, JWT secret, OAuth client secret) before production use.
