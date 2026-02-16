# Task Management System (TMS) - Backend Service

Cloud-native Task Management System built using modern scalable
architecture.

---

# Live URLs

Frontend
https://halfliferoi.online/

Backend API
https://api.halfliferoi.online

---

# Test User

Email: malith@gmail.com

Password: MMmm11..@@

---

# Testing the Live App

1.  Go to https://halfliferoi.online/
2.  Login with test credentials provided above
3.  Click New Task button at the top right corner
4.  Enter task details (can enter tasks as a batch by selecting Upload As Batch) option
5.  Click Create Task button
6.  Go to Task List page
7.  Click a task name
8.  Click the pencil icon at the top of side bar to edit the task
9.  Add data changes or click delete at the top of the side bar
10. Click save

---

# Documentation Links

- ![Architecture Diagram](https://raw.githubusercontent.com/sanuga-lakdinu-kuruppu/tms-client/refs/heads/main/structure/high-level-architecture.png)
- ![Data Model](https://raw.githubusercontent.com/sanuga-lakdinu-kuruppu/tms-client/refs/heads/main/structure/data-model.png)
- ![Resource Model (API Endpoints)](https://raw.githubusercontent.com/sanuga-lakdinu-kuruppu/tms-client/refs/heads/main/structure/resource-model.png)
- ![User Journey (Figma Jam)](https://raw.githubusercontent.com/sanuga-lakdinu-kuruppu/tms-client/refs/heads/main/structure/user-journey.png)

---

# System Overview

- Frontend: Next.js + Tailwind CSS
- Backend: Node.js + Express
- Database: DynamoDB
- Auth: JWT (HTTP-only cookies)
- Deployment: AWS Lambda + API Gateway + Amplify
- CI/CD: GitHub Actions + Amplify Webhook
- Monitoring: CloudWatch
- DNS & WAF: Cloudflare DNS for domain management, Cloudflare WAF optional for added protection

---

# Project Structure

## Frontend (tms-client)

- ![Frontend Project Structure](https://raw.githubusercontent.com/sanuga-lakdinu-kuruppu/tms-client/refs/heads/main/structure/frontend-proj-structure.png)

## Backend (tms-service)

- ![Backend Project Structure](https://raw.githubusercontent.com/sanuga-lakdinu-kuruppu/tms-client/refs/heads/main/structure/backend-proj-structure.png)

---

# Local Setup

## Backend Setup

```bash
git clone https://github.com/sanuga-lakdinu-kuruppu/tms-service.git
```

```bash
cd tms-service
```

```bash
npm install
```

Create `.env` file and use the provided .env file for reference and add your AWS access key and secret key:

---

## DynamoDB Tables (DEV)

TMS_USER_DEV

- PK: userId
- SK: createdAt
- GSI: emailIndex (PK: email)

TMS_TASK_DEV

- PK: taskId
- SK: createdAt
- GSI: userIdCreatedAt (PK: userId, SK: createdAt)

Uncomment the following lines in the index.mjs file:

```javascript
const PORT = process.env.PORT || 6006;

app.listen(PORT, () => {
  console.log(`tms-service is up and running on port ${PORT} :)`);
});
```

And comment the following line in the index.mjs file:

```javascript
const server = awsServerlessExpress.createServer(app);
export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
```

Run backend:

```bash
npm run start:dev
```

---

## Frontend Setup

```bash
git clone https://github.com/sanuga-lakdinu-kuruppu/tms-client.git
```

```bash
cd tms-client
```

```bash
npm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_BASE_URL=Use the base URL of the backend APIS
```

Run frontend:

```bash
npm run dev
```

---

# AWS Deployment

## Backend

- Create Lambda: tms-service (Node 22+, timeout 30s)
- Attach DynamoDB access policy
- Add environment variables manually
- Create API Gateway
- Enable CORS
- Attach domain: api.halfliferoi.online
- Uncomment the following lines in the index.mjs file:

```javascript
const server = awsServerlessExpress.createServer(app);
export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
};
```

And comment the following line in the index.mjs file:

```javascript
const PORT = process.env.PORT || 6006;

app.listen(PORT, () => {
  console.log(`tms-service is up and running on port ${PORT} :)`);
});
```

- Deploy to Lambda

## Frontend

- Connect GitHub repo to Amplify
- Add env: NEXT_PUBLIC_BASE_URL=https://api.halfliferoi.online
- Enable auto deploy
- Attach domain: halfliferoi.online
- Deploy to Amplify

---

# Security

- bcrypt password hashing
- JWT (HTTP-only cookies)
- CSRF protection
- Input validation
- CORS control
- Role-based access
- CloudWatch logging

---

# CI/CD

Backend

- GitHub Actions → Deploy to Lambda

Frontend

- GitHub Webhook → Amplify

---

# Dependencies

Backend:

- express
- bcrypt
- jsonwebtoken
- @aws-sdk/lib-dynamodb
- @aws-sdk/client-dynamodb
- cors
- csurf
- express-validator
- cookie-parser
- dotenv
- nodemon
- uuid
- aws-serverless-express

Frontend:

- next
- react
- react-dom
- axios
- lucide-react
- date-fns

---

# Monitoring

- AWS CloudWatch
- Lambda metrics
- API Gateway logs

---

## Known Issues

- Rate limiting is not implemented for the backend
- Forgot password functionality is not implemented
- Dashboard is using dummy data
- Search bar and Notification icon at the navbar is not implemented
