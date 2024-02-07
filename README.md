# DevOps-ExpendiTrack

## Overview:

ExpenseTracker is an ambitious project aiming to leverage the Spring Boot framework, MySQL database, and React to create a robust web application dedicated to seamless budgeting and expense tracking. This comprehensive solution provides an intuitive user experience and efficient financial management. The project comprises various components and tasks that collectively contribute to its functionality.

### Components:

**Agile-Board:**

- Jira OR GitHub Issues

**Front-End:**

- ReactJS

**Middle-Ware:**

- Spring Boot (Java-based framework for building APIs)
  - Facilitates Database Interactions (CRUD Operations)
  - Manages Authentication Requests
  - Sends Responses to the Front-End with the necessary data

**Backend:**

- Java (Spring Boot)

**Database:**

- MySQL

### CI/CD Pipeline:

- Code Repository: GitHub

- Testing:
  - **Unit Testing, Integration Test:**
    - Backend -> JUnit (run Tests on Each commit, and pull request)
    - Frontend -> Jest and React Testing Library
  - **End to end testing (E2E):**
    - Cypress

- Build Tools: Maven for Spring Boot, npm for React

- Container: Docker

- Image/Artifact Repository: Artifactory

- Build Automation: GitHub Actions(OR Jenkins)

- Deployment Server:
  - Front-End: GitHub
  - Backend: Azure

- Additional:
  - Notifications (Pass/Fail)
  - Handling Failed Deployments(Send email through GitHub actions OR Create a Jira ticket and confluence issue and send email notification)

## Screenshots/Preview

## Usage

## Steps

### MILESTONE 0 - PLAN AND IMPORTANT NOTES

- Select a project idea and technologies and outline how they will be utilized (consider creating a diagram). Seek approval for the chosen stack throughout the project.
- Create wireframes and flowcharts.
- Develop stories and epics.
- Assign tasks to the team.
- Begin building early, considering integration with the company's CI/CD pipeline.
- Follow Test-Driven Development (TDD) principles, building test cases before writing code.
- Adopt an iterative process, keeping team leads updated on project progress and incorporating feedback.
- Prepare a presentation (possibly with charts) during demos.
- Keep meticulous track of project progress.

### MILESTONE 1 - BUILD THE BASIC APP

- [ ] GitHub actions for Testing
  - [ ] Avoid running the action when updating only the readme
- [ ] Spring Boot Controllers & API Endpoints
  - [ ] Set up environment variables
  - [ ] Implement POST /api/budgets to create a new budget.
  - [ ]  Implement GET /api/budgets to retrieve all existing budgets.
    - [ ] Test it
  - [ ] Implement GET /api/budgets/:id to retrieve a single budget by its ID.
  - [ ] Implement GET /api/budgets/:id/expenses to retrieve all expenses associated with a specific budget.
  - [ ] Implement PATCH /api/budgets/:id to update the details of a single budget, including its associated expenses.
  - [ ] Implement DELETE /api/budgets/:id to delete a single budget and all its associated expenses.
  - [ ] Implement GET /api/expenses to retrieve all existing expenses.
  - [ ] Implement POST /api/expenses to create a new expense.
  - [ ] Implement GET /api/expenses/:id to retrieve a single expense by its ID.
  - [ ] Implement PATCH /api/expenses/:id to update the details of a single expense.
  - [ ] Implement DELETE /api/expenses/:id to delete a single expense.
- [ ] Test Spring Boot server and API endpoints using JUnit, Postman, and RestAssured.
  - [ ] Include tests for error scenarios.
- [ ] MySQL Database & Hibernate
- [ ] Models & Entities
- [ ] Controllers (part 1)
- [ ] Creating a React App
- [ ] Fetching Data
- [ ] New Expense Form
- [ ] Adding React Context
- [ ] Deleting Data
- [ ] Handling Error Responses
- [ ] Completing Milestone 1
  - [ ] Unit Testing, Integration Test: JUnit, Jest and React Testing Library (run Tests on Each commit, pull request)

### MILESTONE 2 - ADD AUTHENTICATION

- [ ] Introduction & Starter Project
- [ ] User Routes, Controller & Model
- [ ] User Registration & Password Hashing
- [ ] Email & Password Validation
- [ ] JSON Web Tokens (theory)
- [ ] Generating and Validating Tokens
- [ ] User Login
- [ ] React Auth Context
- [ ] Login & Signup Forms
- [ ] Developing a useSignup Hook
- [ ] Developing a useLogout Hook
- [ ] Developing a useLogin Hook
- [ ] Setting the Initial Auth Status
- [ ] Securing API Routes
- [ ] Making Authorized Requests
- [ ] Securing React Routes
- [ ] Associating Expenses with Users
  - [ ] Unit Testing, Integration Test: JUnit, Jest and React Testing Library  (run Tests on Each commit, pull request)
  - [ ] End to end testing (E2E): Cypress

### MILESTONE 3 - DOCKERIZE APP

- [ ] Dockerize React client
- [ ] Dockerize MySQL database
- [ ] Dockerize Spring Boot API server
- [ ] Set up Docker Compose

### MILESTONE 4 - BUILD CI/CD PIPELINE

- [ ] GitHub actions for continuous integration and delivery
- [ ] Send Email Notifications of Pipeline Status

## Future Changes

- Deploy App (render, netlify, Azure/internally etc)
- javadocs or swagger docs(API Testing docs) for basically everything(specially tests)
- pipeline as github action, on each PR(sprint1 OR sprint2) and only approve if all tests pass(backend and frontend)
- decide to separate backend and backend for CI/CD pipeline testing 
- Document tests in excel,etc.
- link jira to confluence for documentation(Documentation of Agile)

## Resources
