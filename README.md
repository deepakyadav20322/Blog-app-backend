# BlogWrite Backend – Server Side

Backend server for **BlogWrite**, a full-stack blog platform built with **Node.js, Express.js, MongoDB, and Socket.io**.
This backend handles authentication, authorization, blog management, user interactions, admin controls, and real-time features.

(Your current README is still the default Express template , so replacing it with this project-specific one will make your repo look much more professional.)

---

## 🚀 Features

* Secure **Authentication & Authorization** using JWT
* User registration and login system
* Blog creation, editing, deletion, and management
* Like, Comment, and Share functionality
* Follow / Unfollow users
* User and Admin dashboards support
* Role-based access control
* Real-time features using **Socket.io**
* Optimized backend architecture for scalable performance

---

## 🛠 Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Socket.io
* Cloudinary (if used)
* Multer (if used)
* bcrypt.js
* dotenv

---

## 🔗 Repository Link

### Backend Repository

Actual repo:
https://github.com/deepakyadav20322/Blog-app-backend

---

## 📦 Installation

### Clone the Repository

```bash id="n9x6s1"
git clone https://github.com/deepakyadav20322/Blog-app-backend.git
cd Blog-app-backend
```

---

## Install Dependencies

```bash id="j3f7k2"
npm install
```

---

## Environment Variables

Create a `.env` file in the root folder:

```env id="v8p4m5"
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=your_frontend_url
EMAIL = your_email_id
EMAIL_APP_PASS = your_email_app_password

```

(Keep only the variables you actually use.)

---

## Run the Server

### Development Mode

```bash id="q2r8t4"
npm run dev
```

### Production Mode

```bash id="z7w1x9"
npm start
```

Server runs on:

```bash id="m5c8p2"
http://localhost:5000
```

---

## API Highlights

### Authentication

* Register User
* Login User
* JWT Protected Routes
* Profile

### Blog Management

* Create Blog
* Update Blog
* Delete Blog
* Fetch Blogs

### Social Features

* Like / Unlike
* Comment System
* Follow / Unfollow Users

### Admin Controls

* User Management
* Content Moderation
* Dashboard Access

---

## 📁 Project Structure

```text id="f6k3n7"
controllers/
models/
routes/
middleware/
config/
utils/
server.js
package.json
```

---

## 👨‍💻 Author

**Deepak Yadav**

* GitHub: https://github.com/deepakyadav20322
---

If you found this project useful, feel free to ⭐ the repository.
