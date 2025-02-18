# Voucher Pool - simple Backend Service using Nestjs

## Steps to Run

### Prerequisites

- **Node.js** (version 16 or above)
- **mysql Database**

### 1. Clone the Repository

First, clone the repository to your local machine:

```bash
git clone https://github.com/your-repo/voucher-pool.git
cd voucher-pool
```

### 2. Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### 3. Configure Database

Set up your database connection by creating a `.env.development.local` file in the root directory and adding same variables that are in example.env file

### 5. Start the Application

Start the application:

```bash
npm run start
```

The API will be available at `http://localhost:3000`.

### Optional: Run with Docker

To run the application with Docker:

1. **Build the Docker image**:

   ```bash
   docker build -t voucher-pool .
   ```

2. **Run the application with Docker**:

   ```bash
   docker-compose up
   ```

This will start both the application and the database inside Docker containers.

---

Now you can access the API Documentation at `http://localhost:3000/api`

Now you can access the API at `http://localhost:3000` and interact with the Voucher Pool service!
