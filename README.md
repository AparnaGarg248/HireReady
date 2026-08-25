# HireReady AI: An Intelligent Placement Readiness and Career Analytics Platform

HireReady AI is a comprehensive placement preparation and student performance analytics platform designed to streamline campus recruitment readiness. It empowers students with centralized resume management, standardized timed aptitude assessments across quantitative, logical, and verbal reasoning domains, automatic score calculations, assessment history logging, and visual performance tracking.

---

## 🌟 Core Modules & Features

1. **Student Authentication & Session Security**:
   - Secure student registration and login.
   - Password hashing using `bcryptjs`.
   - Stateless JWT (JSON Web Token) token generation and verification middleware.
   - Protected dashboard, assessment, and resume routes.

2. **Student Dashboard**:
   - Personalized welcome banner and academic details.
   - Real-time resume status verification badge.
   - Key performance indicators: Total Attempts, Latest Score, Highest Score, and Average Score.
   - Interactive visual performance trend curve powered by `Chart.js`.
   - Summary table of recent test attempts.

3. **Resume Management Module**:
   - Multipart file upload using `Multer`.
   - File format validation (PDF, DOC, DOCX) and size restrictions (up to 5 MB).
   - Document metadata tracking (original file name, file size, upload timestamp).
   - Direct download and file replacement capabilities.

4. **Aptitude Assessment Module**:
   - Categorized tests:
     - **Quantitative Aptitude**: Percentages, Profit & Loss, Time & Work, Ratios, Simple Interest, Averages.
     - **Logical Reasoning**: Number Series, Coding-Decoding, Blood Relations, Directions, Logical Patterns.
     - **Verbal Ability**: Vocabulary, Grammar, Sentence Correction, Synonyms, Antonyms.
     - **Comprehensive Assessment**: Mixed recruitment-style evaluation.
   - Timed test interface with countdown warning alerts.
   - Question navigator palette indicating answered and unanswered questions.
   - Unattempted questions warning modal on submission to prevent accidental submissions.

5. **Score Generation & Performance Analytics**:
   - Automatic score calculation generated directly from the student's actual responses.
   - Metrics calculated: Total Questions, Attempted Questions, Correct Answers, Incorrect Answers, Raw Score, and Percentage.
   - Persistent test records stored in MongoDB Atlas via Mongoose models.
   - Interactive `Chart.js` line/bar visualizations tracking student progress across multiple assessment attempts.
   - Detailed question-by-question review with official solutions and step-by-step explanations.

6. **Student Profile**:
   - Student academic details (Full Name, College, Branch/Department, Graduation Year, Contact).
   - Quick overview of resume status and aptitude assessment statistics.
   - Editable profile form with instant database updates.

---

## 🛠️ Technology Stack

### Frontend (Aastha)
- **HTML5**: Semantic markup for landing page, authentication, dashboard, test interface, results, and profile.
- **CSS3**: Professional Blue & White theme, custom CSS variables, responsive Flexbox and Grid layouts, cards, and modal dialogs.
- **JavaScript (ES6+)**: Client-side form validation, asynchronous API communication via `fetch()`, DOM manipulation, timer management, and test navigation state.
- **Chart.js**: Dynamic graphical rendering of student aptitude scores and historical progression curves.

### Backend (Aparna)
- **Node.js & Express.js**: RESTful API server, modular routing, controller architecture, and static asset delivery.
- **JWT (jsonwebtoken)**: Secure token creation and route protection middleware.
- **bcryptjs**: One-way cryptographic password hashing for student credentials.
- **Multer**: Multipart form-data parser and disk storage engine for resume uploads.
- **CORS & Dotenv**: Cross-origin resource sharing and environment variable management.

### Database
- **MongoDB Atlas**: Cloud-hosted NoSQL document database.
- **Mongoose**: Object Data Modeling (ODM) schemas and models for `User`, `Resume`, and `AptitudeResult`.

---

## 👥 Team Responsibilities

### AASTHA — Frontend Lead
Responsible for the client-side architecture:
- User Interface design and responsive Blue & White styling (`public/css/style.css`, `public/css/auth.css`, `public/css/dashboard.css`, `public/css/assessment.css`).
- Client-side validation and interactive forms (`public/js/auth.js`, `public/js/profile.js`).
- Timed assessment engine, question navigator, and results review (`public/js/aptitude.js`).
- Visual analytics integration using Chart.js (`public/js/dashboard.js`).
- Fetch API asynchronous communication with backend endpoints (`public/js/main.js`).

### APARNA — Backend Lead
Responsible for the server-side architecture:
- Express server configuration and middleware pipeline (`backend/server.js`).
- MongoDB Atlas database connectivity with Mongoose ODM (`backend/config/db.js`).
- Data schemas and models (`backend/models/User.js`, `backend/models/Resume.js`, `backend/models/AptitudeResult.js`).
- Controller business logic and score calculation algorithms (`backend/controllers/`).
- JWT authentication middleware and Multer file upload handlers (`backend/middleware/`).
- RESTful route definitions (`backend/routes/`).

---

## 📁 Project Directory Structure

```text
HireReady-AI/
│
├── public/
│   ├── css/
│   │   ├── style.css           # Global typography, colors, layout
│   │   ├── auth.css            # Login & registration styling
│   │   ├── dashboard.css       # Dashboard metrics & cards layout
│   │   └── assessment.css      # Test engine, timer & results review
│   │
│   ├── js/
│   │   ├── main.js             # Auth session, toasts, navbar helper
│   │   ├── auth.js             # Client login & register handlers
│   │   ├── dashboard.js        # Dashboard metrics & Chart.js graph
│   │   ├── resume.js           # Multer upload & resume management
│   │   ├── aptitude.js         # Timed test engine & score review
│   │   └── profile.js          # Profile view & update handlers
│   │
│   ├── index.html              # Homepage & features overview
│   ├── login.html              # Student login portal
│   ├── register.html           # Student registration portal
│   ├── dashboard.html          # Main student dashboard
│   ├── resume.html             # Resume upload & management
│   ├── aptitude.html           # Aptitude assessment portal
│   ├── results.html            # Detailed score & answer review
│   └── profile.html            # Student profile & academic details
│
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB Atlas connection setup
│   │
│   ├── controllers/
│   │   ├── authController.js       # Register, login, profile APIs
│   │   ├── resumeController.js     # Resume upload & download APIs
│   │   ├── aptitudeController.js   # Questions, submit, analytics APIs
│   │   └── dashboardController.js  # Dashboard aggregation API
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT verification middleware
│   │   └── uploadMiddleware.js # Multer file upload configuration
│   │
│   ├── models/
│   │   ├── User.js             # Student user Mongoose schema
│   │   ├── Resume.js           # Resume metadata Mongoose schema
│   │   └── AptitudeResult.js   # Test results Mongoose schema
│   │
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth routes
│   │   ├── resumeRoutes.js     # /api/resume routes
│   │   ├── aptitudeRoutes.js   # /api/aptitude routes
│   │   └── dashboardRoutes.js  # /api/dashboard routes
│   │
│   ├── data/
│   │   └── questions.js        # Quantitative, logical, verbal question bank
│   │
│   └── server.js               # Express application entry point
│
├── uploads/
│   └── resumes/                # Uploaded resume files directory
│
├── .env.example                # Environment configuration template
├── package.json                # Project dependencies and start scripts
└── README.md                   # Project documentation
```

---

## 🚀 Installation & Setup

1. **Clone or navigate to the project directory**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example`:
   ```env
   PORT=3000
   MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
   JWT_SECRET=your_secure_jwt_secret_key_2026
   ```

3. **Run the Application**:
   ```bash
   npm start
   ```

4. **Access the Platform**:
   Open `http://localhost:3000` in your web browser.
