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

