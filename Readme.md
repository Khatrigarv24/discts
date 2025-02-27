<div align="center">
  <h1>🚀 DISCTS - Inventory Management System</h1>
  <p><strong>A modern inventory management solution powered by React and Hono</strong></p>
  
  ![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=for-the-badge&logo=react)
  ![Hono](https://img.shields.io/badge/Hono-4.6.16-blue?style=for-the-badge)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=for-the-badge&logo=typescript)
  ![DynamoDB](https://img.shields.io/badge/DynamoDB-AWS-FF9900?style=for-the-badge&logo=amazondynamodb)
  ![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge)
</div>

## 📋 Overview

DISCTS is a full-stack inventory management application that allows businesses to track products, manage stock levels, and streamline inventory operations. Built with modern technologies, it provides a responsive and intuitive user interface with secure authentication.

<table>
  <tr>
    <td width="50%">
      <h3 align="center">🌐 Frontend Features</h3>
      <ul>
        <li>React UI with Tailwind CSS styling</li>
        <li>Clerk authentication system</li>
        <li>Responsive design for all devices</li>
        <li>Real-time inventory management</li>
        <li>Dark mode support</li>
      </ul>
    </td>
    <td width="50%">
      <h3 align="center">⚙️ Backend Features</h3>
      <ul>
        <li>Hono API server with TypeScript</li>
        <li>DynamoDB integration for data storage</li>
        <li>RESTful endpoints for CRUD operations</li>
        <li>Secure with CORS, CSRF protection</li>
        <li>AWS SDK integration</li>
      </ul>
    </td>
  </tr>
</table>

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- AWS account with DynamoDB access
- Clerk account for authentication

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Abhijat05/discts.git
cd discts

2. Install dependencies:

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

3. Configure environment variables:

  For backend (.env file in backend directory):

AWS_ACCESS_KEY=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_SESSION_TOKEN=your_session_token
AWS_REGION=your_aws_region

  For frontend (.env.local file in frontend directory):
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

4. Start the development servers:

# Start backend server (in backend directory)
npm run dev

# Start frontend server (in frontend directory)
npm run dev


🏗️ Project Structure

discts/
├── backend/                # Backend server code
│   ├── src/
│   │   ├── api/            # API routes and controllers
│   │   │   ├── inventory/  # Inventory management endpoints
│   │   │   └── users/      # User management endpoints
│   │   ├── utils/          # Utility functions
│   │   └── index.ts        # Main entry point
│   ├── .env                # Environment variables (not in repo)
│   └── package.json        # Backend dependencies
├── frontend/               # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API service integration
│   │   └── App.jsx         # Main React component
│   ├── .env.local          # Environment variables (not in repo)
│   └── package.json        # Frontend dependencies
└── README.md               # Project documentation