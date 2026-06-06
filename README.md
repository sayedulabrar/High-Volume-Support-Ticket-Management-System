# Support Ticket System

# Core Features

## 1. Authentication & Role Management

* Use Laravel Breeze or others.
* Roles:

  * Customer
  * Support Agent
  * Admin
* Use `spatie/laravel-permission` or Laravel Gates/Policies.
* Admin can assign roles to users.

## 2. Ticket Management

* Customers can create support tickets:

  * Fields:

    * Subject
    * Category
    * Priority
    * Description
    * File Attachments
* Statuses:

  * Open
  * In Progress
  * Resolved
  * Closed
* Tickets table includes:

  * `user_id`
  * `assigned_to`
  * `status`
  * `priority`
  * etc.

## 3. Ticket Reply System

* Table: `ticket_replies`
* Replies stored as thread under each ticket.
* Both customers and agents can reply.
* Attachments optional.
* Display in a clean chat-like view (UI framework optional).

## 4. Email Notifications (Laravel Mail)

* Send email on:

  * Ticket creation (to customer & agents)
  * New replies (to the other party)
* Use Laravel Mailable classes.
* All emails must be queued using Laravel Queues.

## 5. Queued Jobs (Laravel Queues)

* Configure Redis or database queue.
* Queue:

  * Email notifications
  * Future scheduled tasks (optional)

## 6. Admin Dashboard

* View and filter all tickets.
* Assign tickets to agents.
* View and manage users & roles.

## 7. Real-time Ticket Replies (Laravel + React Query)

* Enable real-time reply updates.
* Notify customers and agents when a new message is added (use same mechanism as Step 5).


This project is a full-stack Support Ticket System built with **Laravel (API backend)** and **React (frontend)**.

## 📁 Project Structure

```

.
├── project/                   # React Frontend
└── support-ticket-system2/   # Laravel API Backend

````

---

## 🚀 Setup Instructions

### ⚙️ Prerequisites

Ensure you have the following installed on your system:

- PHP >= 8.1
- Composer
- MySQL
- Node.js & npm
- Laravel CLI
- Git

---

## 🧩 Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
````

---

## 🗄️ Step 2: Set Up the MySQL Database

1. **Create a database** named `support_ticket_system` in MySQL.
2. **Import the SQL dump file** located in the GitHub repository (usually named `support_ticket_system.sql`) into the `support_ticket_system` database.

You can do this via command line or tools like phpMyAdmin.

```bash
mysql -u root -p support_ticket_system < path/to/support_ticket_system.sql
```

---

## 🧱 Step 3: Set Up the Laravel API

```bash
cd support-ticket-system2
```

### Install PHP dependencies:

```bash
composer install
```

### Create `.env` file and generate app key:

```bash
cp .env.example .env
php artisan key:generate
```

### Update the `.env` with your MySQL database credentials:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=support_ticket_system
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password

APP_URL=http://127.0.0.1:8000
FRONTEND_URL=http://localhost:5173

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io           # or your SMTP provider (e.g., smtp.gmail.com)
MAIL_PORT=2525                       # or 587/465 depending on provider
MAIL_USERNAME=your_mail_username
MAIL_PASSWORD=your_mail_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@yourdomain.com
MAIL_FROM_NAME="Support Ticket System"



```

### Run database seeders (creates roles and users):

```bash
php artisan db:seed --class=RoleSeeder
```

This will create the following default users:

| Role          | Email                                                             | Password |
| ------------- | ----------------------------------------------------------------- | -------- |
| Admin         | [sayedulabrar14045@gmail.com](mailto:sayedulabrar14045@gmail.com) | password |
| Support Agent | [modasayedul@gmail.com](mailto:modasayedul@gmail.com)             | password |
| Customer      | [munemshahriar13@gmail.com](mailto:munemshahriar13@gmail.com)     | password |

> ⚠️ You should change these passwords in a production environment.

### Start Laravel Server

```bash
php artisan serve
```

### Start Laravel Queue Worker

Open a separate terminal:

```bash
php artisan queue:work
```

---

## 💻 Step 4: Set Up the React Frontend

```bash
cd ../project
```

### Install dependencies:

```bash
npm install
```

### Start the React App

```bash
npm start
```

> Ensure the React app's `.env` or API base URL points to the Laravel API (`http://127.0.0.1:8000` by default).

---

## ✅ You're Ready!

You should now have both the React frontend and Laravel API running locally:

* React App: [http://localhost:3000](http://localhost:3000)
* Laravel API: [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## 📬 Support

If you run into issues, check:

* `.env` file configuration
* Database credentials
* Queue worker running
* CORS settings for API calls (if accessing from different ports)

---

## 📄 License

This project is for educational and assessment purposes.

```

Let me know if you'd like to add `.env` templates or scripts to automate setup.
```
