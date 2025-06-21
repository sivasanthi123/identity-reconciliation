# Identity Reconciliation API

##  Project Purpose

This project implements an **identity reconciliation** service that helps in identifying unique users based on multiple contact identifiers (email, phone number). When provided with either or both identifiers, it links them under a primary identity and returns all associated contact information.

---

##  How to Run

1. **Install dependencies**  
   ```bash
   npm install
   
2. **Set up PostgreSQL**  

Ensure PostgreSQL is installed and running on port 5432.

Create a database named identitydb.

3. **Configure Environment Variables**

Configure environment variables

Create a .env file:

**DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/identitydb"**

Replace yourpassword with your actual PostgreSQL password.

4. **Run Prisma migrations**

npx prisma migrate dev --name init

5. **Start the server**

node index.js

or using nodemon for hot reload:

npx nodemon index.js

📡 **API Endpoint Structure**

POST /identify

**Request Body (JSON):**

{
  
  "email": "example@example.com",
  
  "phoneNumber": "1234567890"

}

**Response:**

{
 
  "primaryContactId": 1,
 
  "emails": ["example@example.com"],
  
  "phoneNumbers": ["1234567890"],
  
  "secondaryContactIds": [2, 3]

}


**Tech Stack**

Node.js – JavaScript runtime

Express – Web framework for building APIs

PostgreSQL – Relational database

Prisma – ORM for database access

dotenv – For managing environment variables

nodemon – For development auto-reloading

📁 **Project Structure**

**identity-reconciliation/**

├── prisma/

│   ├── schema.prisma

├── .env

├── .gitignore

├── index.js

├── package.json

└── README.md


📝 **Notes**

Make sure the PostgreSQL service is running before starting the API. 

If using a custom port or credentials, update the .env file accordingly.
