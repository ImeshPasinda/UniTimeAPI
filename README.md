# RESTful and Secure API for Simplified University Timetable Management (UniTimeAPI)


This is a Node.js-based University Timetable Management System designed to efficiently manage university timetables. The system is built using Node.js, MongoDB, and Express.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/ImeshPasinda/UniTimeAPI.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Environment Configuration

Before running the application, you need to set up your environment variables. Create a `.env` file in the root directory of the project and add the following variables:

```plaintext
MONGO="mongodb+srv://<username>:<password>@<cluster>/<database>"
JWT_SECRET=<your_jwt_secret>
```

## Usage

To run the application locally, you can use the following command:

```bash
npm run dev
```

This will start the server using nodemon, which automatically restarts the server when changes are detected.

The application will be running on [http://localhost:5000](http://localhost:5000).

## Postman Documentation

[<img src="https://assets.getpostman.com/common-share/postman-logo-horizontal-white.svg" width="200"/>](https://documenter.getpostman.com/view/24763004/2sA2xmVrA7)

For detailed API documentation and usage examples, please refer to the [Postman documentation](https://documenter.getpostman.com/view/24763004/2sA2xmVrA7).

## Routes

The following routes are available:

- `/api/auth`: Authentication routes
- `/api/course`: Course-related routes
- `/api/faculty`: Faculty-related routes
- `/api/timetable`: Timetable-related routes
- `/api/room`: Room-related routes
- `/api/booking`: Booking-related routes
- `/api/enroll`: Student enrollment-related routes
- `/api/notifications`: Notification-related routes

## Models

The following models are available:

- `User`: User Model
- `Course`: Course Model
- `Faculty`: Faculty Model
- `Timetable`: Timetable Model
- `Room`: Room Model
- `Booking`: Booking Model 
- `Enroll`: Student Enrollment Model
- `Notification`: Notification Model

## Authentication

### JWT Authentication

This project uses JWT (JSON Web Token) authentication to secure its API endpoints. With JWT:

- Users receive a token upon logging in or signing up.
- The token, containing user info, is sent with each request.
- The server verifies the token's signature to grant access.

JWT ensures secure communication and access control, making the API endpoints safe from unauthorized access.

## Testing

### Unit Testing

Unit tests are implemented using Jest. You can run unit tests for different modules using the following commands:

```bash
npm run unit-test-auth
npm run unit-test-booking
npm run unit-test-course
npm run unit-test-faculty
npm run unit-test-notification
npm run unit-test-room
npm run unit-test-studentEnroll
npm run unit-test-timetable
```

### Integration Testing

Integration tests are implemented using Jest. You can run integration tests for different modules using the following commands:

```bash
npm run intergration-test-auth
npm run intergration-test-booking
npm run intergration-test-course
npm run intergration-test-faculty
npm run intergration-test-notification
npm run intergration-test-room
npm run intergration-test-studentEnroll
npm run intergration-test-timetable
```

### Load Testing

Load testing is implemented using Artillery. You can run load tests for different functionalities using the following commands:

```bash
npm run load-test-auth
npm run load-test-booking
npm run load-test-course
npm run load-test-faculty
npm run load-test-notification
npm run load-test-studentEnroll
npm run load-test-timetable
```

### Security Testing

This project utilizes `OWASP ZAP (Zed Attack Proxy)` for security testing. OWASP ZAP is a powerful tool designed to identify vulnerabilities in web applications. By integrating OWASP ZAP into the testing workflow, this project ensures comprehensive security testing to identify and address potential security risks.

<img src="https://github.com/ImeshPasinda/UniTimeAPI/blob/main/ZAP-Report.png"/>

### Test Coverage Report

To generate a test coverage report from both integration and unit testing, you can run:

```bash
npm run test
```

This command will run both integration and unit tests and generate a coverage report which you can find in the `/coverage` directory.

## Folder Structure

### Backup Folder

In the repository, there is a folder named `/backups` which contains backup collections for the database. These backups provide snapshots of the database collections at different points in time.

The folder structure organizes files and directories for a University Timetable Management System, including controllers, models, routes, tests, and configuration files

```
UniTimeAPI/
├── backups/
│   ├── unitimeapi.booking
│   ├── unitimeapi.courses
│   ├── unitimeapi.faculties
│   ├── unitimeapi.notifications
│   ├── unitimeapi.rooms
│   ├── unitimeapi.studentenrolls
│   ├── unitimeapi.timetables
│   └── unitimeapi.users
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authController.js
│   ├── bookingController.js
│   ├── courseController.js
│   ├── facultyController.js
│   ├── notificationController.js
│   ├── roomController.js
│   ├── studentEnrollController.js
│   └── timetableController.js
│
├── middlewares/
│   └── authMiddleware.js
│
├── models/
│   ├── Auth.js
│   ├── Booking.js
│   ├── Course.js
│   ├── Faculty.js
│   ├── Notification.js
│   ├── Room.js
│   ├── StudentEnroll.js
│   └── Timetable.js
│
├── routes/
│   ├── authRoutes.js
│   ├── bookingRoutes.js
│   ├── courseRoutes.js
│   ├── facultyRoutes.js
│   ├── notificationRoutes.js
│   ├── roomRoutes.js
│   ├── studentEnrollRoutes.js
│   └── timetableRoutes.js
│
├── tests/
│   ├── integration/
│   │   ├── auth-integration.test.js
│   │   ├── booking-integration.test.js
│   │   ├── course-integration.test.js
│   │   ├── faculty-integration.test.js
│   │   ├── notification-integration.test.js
│   │   ├── room-integration.test.js
│   │   ├── studentEnroll-integration.test.js
│   │   └── timetable-integration.test.js
│   │
│   ├── performance/
│   │   ├── auth-performance-test.yml
│   │   ├── booking-performance-test.yml
│   │   ├── course-performance-test.yml
│   │   ├── faculty-performance-test.yml
│   │   ├── notification-performance-test.yml
│   │   ├── room-performance-test.yml
│   │   ├── studentEnroll-performance-test.yml
│   │   └── timetable-performance-test.yml
│   │
│   ├── unit/
│   │   ├── auth.test.js
│   │   ├── booking.test.js
│   │   ├── course.test.js
│   │   ├── faculty.test.js
│   │   ├── notification.test.js
│   │   ├── room.test.js
│   │   ├── studentEnroll.test.js
│   │   └── timetable.test.js
│   │
├── .env
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
├── Zap-Report.png
└── server.js

```


