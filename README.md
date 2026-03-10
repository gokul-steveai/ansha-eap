# ANSA EAP

ANSA EAP is a web application built with **Next.js** and **PostgreSQL**.

This repository contains the application code and the database schema required to run the project locally or in a fresh environment.

---

## Tech Stack

- **Frontend / Backend**: Next.js  
- **Database**: PostgreSQL  
- **Language**: TypeScript  
- **Deployment**: VPS (recommended)

---

## Prerequisites

Make sure you have the following installed:

- Node.js 18+  
- PostgreSQL 14+  
- npm / pnpm / yarn  
- `psql` and `pg_dump` available in your PATH  

---

### Third-Party Services

This project integrates with several third-party services to provide additional functionality:

- **Uploadcare** — used for handling file uploads and media management.  
- **Elastic Email** — used for sending transactional and notification emails.  

Make sure to configure the necessary environment variables for these services in your `.env` file, such as `UPLOADCARE_SECRET_KEY` for Uploadcare and `ELASTIC_API_KEY` for Elastic Email.

---

## Project Setup

### 1. Get the project files

Download the project ZIP file and extract it to a preferred location.  
Navigate to the project folder in your terminal:


cd ansa-eap

### 2. Install dependencies

Install the required Node.js packages:

```bash
npm install
```
or

```bash
pnpm install
```

### 3. Database Setup

The database schema is provided as a **schema-only SQL file**.

#### a. Create the PostgreSQL user (if not exists)

If the user `ansaadmin` does not exist yet, run:

```bash
psql -U postgres
```
Inside the psql prompt:

- Create the user
```sql
CREATE USER ansaadmin WITH PASSWORD 'welcometoansa2025';
```
*If you replace the password, make sure to also update the DATABASE_URL inside .env file*

- Allow the user to create databases
```sql
ALTER USER ansaadmin CREATEDB;
```

*Optional: for local development, allow superuser (be careful in production)*

*ALTER USER ansaadmin WITH SUPERUSER;*

- Exit psql
```sql
\q
```

#### b. Create the database

Create the database owned by `ansaadmin`:

```bash
createdb -U ansaadmin ansa_eap
```
> If you need to specify host or port:

```bash
createdb -h localhost -p 5432 -U ansaadmin ansa_eap
```

#### c. Install the schema

Run the schema SQL file to create tables, enums, constraints, and indexes:

```bash
psql -U ansaadmin -d ansa_eap -f db/schema.sql
```
> No data is inserted during this step.

#### d. Verify the installation

Connect to the database:

```bash
psql -U ansaadmin -d ansa_eap
```
Inside `psql`, list all tables:

```sql
\dt
```
---

## Environment Variables for Database Connection

```env
DATABASE_URL=postgresql://ansaadmin:welcometoansa2025@localhost:5432/ansa_eap
```
Adjust the values according to your local and production setup.


---
## Running the Application

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at:

```
http://localhost:3000
```

### Production with PM2

If you want to run the application in production using PM2, follow these steps:

1. Build the application:

```bash
npm run build
```

2. Install PM2 globally (if not installed):

```bash
npm install -g pm2
```

3. Start the production server with PM2:

```bash
pm2 start npm --name "ansa-eap" -- run start
```

4. Check PM2 status:

```bash
pm2 status
```

5. Restart the app after changes:

```bash
pm2 restart ansa-eap
```

6. Stop the app:

```bash
pm2 stop ansa-eap
```

7. Enable auto-start on server reboot:

```bash
pm2 startup
pm2 save
```

---


### Database Schema Management

The database schema is maintained in `db/schema.sql`.

To regenerate the schema from an existing database:

```bash
pg_dump --schema-only --no-owner --no-privileges ansa_eap > db/schema.sql
```
---

## Notes

- The production environment is already in the project folder as `.env.production`. Use only this file for production — do not use `.env.local`.

- This setup installs schema only (no seed data).
- Schema changes should be documented and committed.
- Avoid committing real database credentials.
- PostgreSQL must be running before setup.


---
