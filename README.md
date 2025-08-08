# Basic CRUD

A full-stack CRUD for employees and departments. Built using React, Redux Toolkit, Node.js, Express, Sequelize, MySQL, and Docker.

---

## 🛠 Tech Stack

### Frontend
- React (TypeScript)
- Redux Toolkit
- React Router 
- Ant Design

### Backend
- Node.js (Express)
- Sequelize ORM
- MySQL
- REST API

### Tooling & DevOps
- Docker (multi-stage builds)
- Docker Compose
- GitHub Actions (CI/CD)

---

## 🚀 Features

- 📁 **Department Management**
  - Create, edit, delete departments
  - Support for parent-child structure
  - View number of employees in each department

- 👤 **Employee Management**
  - Create, edit, delete employees
  - Assign employees to departments

- 🔍 **Search & Filters**
  - Search employees by name
  - Filter employees by:
    - Age range
    - Department
  - Filter departments by:
    - Employee count (min & max)

- 📄 **Pagination**
  - Paged views for employees and departments
  - Adjustable page sizes

- ⚙️ **Seeding Support**
  - Seed the database with sample employees and departments manually

- 🔐 **No Authentication Required**

---

## 🐳 Run with Docker

```bash
docker-compose up --build
```
**(Optional) Seed the Database**

After the containers are up and running, you can seed the database with sample data using:
```bash
docker-compose exec backend npx sequelize-cli db:seed:all
```
<img width="1684" height="730" alt="image" src="https://github.com/user-attachments/assets/52adff9e-4501-4260-86d4-4ecdc55f3945" />
<img width="1245" height="876" alt="image" src="https://github.com/user-attachments/assets/43c5c00a-0704-43a6-b2fc-10349bc34170" />
<img width="1237" height="908" alt="image" src="https://github.com/user-attachments/assets/507b4098-30d1-4805-8de7-3b26ca5eb3d9" />


