# Software Requirements Specification (SRS)
**Project Name:** SchemeSetu  
**Version:** 1.0  

---

## 1. Introduction

### 1.1 Purpose
The purpose of this Software Requirements Specification (SRS) is to document the complete requirements of the SchemeSetu application. It describes the system's architecture, features, and non-functional requirements to serve as a comprehensive guide for developers, administrators, and stakeholders.

### 1.2 Scope
SchemeSetu is a centralized web platform designed to help Indian citizens discover, filter, and verify their eligibility for various Central Government welfare schemes. The system solves the problem of information fragmentation by providing a unified portal where users can input their demographic data and receive tailored scheme recommendations.

### 1.3 System Overview
The platform consists of a user-facing portal and an administrator console. Users can register, manage their profiles, bookmark schemes, and check eligibility. Administrators can manage the repository of schemes and view system analytics.

---

## 2. Overall Description

### 2.1 Product Perspective
SchemeSetu is a standalone web application utilizing a modern JavaScript stack. It is designed to be lightweight and easy to deploy, utilizing local file-based JSON storage instead of a traditional relational database, making it highly portable.

### 2.2 User Classes and Characteristics
- **Standard User**: Citizens looking for government schemes. They require an intuitive interface, clear information, and data privacy.
- **Administrator**: Government officials or platform managers who maintain the scheme repository. They require tools for CRUD operations on schemes.

### 2.3 Operating Environment
- **Frontend**: Compatible with all modern web browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile devices.
- **Backend**: Node.js runtime environment.

---

## 3. System Features

### 3.1 User Authentication
- **Description**: Users and admins can securely register and log in.
- **Requirements**: The system shall utilize bcrypt for password hashing and JSON Web Tokens (JWT) for stateless session management.

### 3.2 Demographic Profile Management
- **Description**: Users can build a profile detailing their socioeconomic status.
- **Requirements**: The system shall capture age, gender, occupation, income, state, and social category to be used by the eligibility engine.

### 3.3 Scheme Directory and Filtering
- **Description**: A comprehensive search interface for schemes.
- **Requirements**: The system shall allow searching by keyword and filtering by ministry, category, and state.

### 3.4 Eligibility Engine ("Find Schemes for Me")
- **Description**: An automated matching system.
- **Requirements**: The system shall compare the user's demographic profile against the required eligibility criteria of all active schemes and return a list of recommended matches.

### 3.5 Bookmarking System
- **Description**: Users can save schemes.
- **Requirements**: The system shall persist bookmarks across sessions tied to the user's ID.

### 3.6 Admin Scheme Management
- **Description**: CRUD interface for schemes.
- **Requirements**: The system shall allow admins to securely add, edit, and delete scheme records.

---

## 4. Data Requirements

The system utilizes a portable, JSON-file-based datastore located in the `server/data/` directory.
- `users/users.json`: Stores core user credentials and metadata.
- `users/profiles.json`: Stores demographic data linked to user IDs.
- `users/bookmarks.json`: Stores array of bookmarked scheme IDs per user.
- `admin/admin.json`: Stores administrator credentials.
- `categories/` & `metadata/`: Stores scheme categorizations and detailed scheme JSON structures.

---

## 5. Non-Functional Requirements

### 5.1 Performance
- The UI shall be highly responsive, with pages loading in under 2 seconds under normal network conditions.
- The eligibility engine shall evaluate profile matches against the database in real-time.

### 5.2 Security
- Passwords must be hashed using bcrypt before storage; plain text passwords must never be logged or saved.
- All protected API routes must require a valid JWT bearer token.
- API endpoints shall implement rate-limiting to prevent brute-force attacks.

### 5.3 Usability
- The frontend shall be built with a mobile-first responsive design, ensuring complete functionality on smartphones.
- The interface shall follow accessibility best practices, ensuring high contrast text and intuitive navigation.

### 5.4 Maintainability
- The codebase shall follow a strict separation of concerns (MVC pattern on the backend, Component-based architecture on the frontend).
- Data files shall be isolated in a dedicated `data/` directory to simplify backups and migrations.

---

## 6. System Architecture

SchemeSetu follows a typical client-server architecture:
1. **Frontend**: Built with React.js (via Vite), utilizing Context API for global state management (Auth and Bookmarks), and React Router for client-side routing. Styled with custom CSS.
2. **Backend**: Built with Express.js (Node.js). Features custom middleware for JWT validation, request logging, and rate limiting. Services (e.g., `AuthService`, `SchemeService`) handle business logic and file I/O operations.
3. **Storage**: File-based datastore using standard Node.js `fs` module to read/write JSON arrays and objects.
