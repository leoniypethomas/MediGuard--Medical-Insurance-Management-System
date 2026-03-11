# MediGuard--Medical-Insurance-Management-System

Medical Insurance Management System (MIMS)
Project Overview

The Medical Insurance Management System (MIMS) is a web-based application designed to manage insurance products and streamline the process of policy selection and claim management. The system provides two types of users: customers and administrators.

Customers can browse available insurance plans, select policies, and submit insurance claims with supporting documents. Administrators can manage insurance plans, view purchased policies, and review or update claim statuses.

This system simulates a real-world medical insurance workflow, ensuring proper interaction between users, policies, and claims.

Key Features

Customer Module
Secure customer login
Browse available insurance plans
View selected policies in My Policies
Submit insurance claims for selected policies
Upload supporting documents (PDF, JPG, PNG)
Track claim status (Submitted, Under Review, Approved, Rejected, Settled)

Administrator Module

Secure administrator login
Manage insurance plans
Add new insurance products with coverage details and premium
View policies selected by customers
Review customer claim submissions
Update claim status for processing

Insurance Plans Available

The system currently includes several example insurance plans:

Basic Health Shield – Individual coverage with a limit of $50,000 and annual premium of $1,200
Premium Family Care – Family coverage with a limit of $250,000 and annual premium of $4,500
Silver Individual Plan – Individual coverage with a limit of $100,000 and annual premium of $2,200
Gold Family Plus – Family coverage with a limit of $500,000 and annual premium of $8,000

Administrators can also create additional plans dynamically.

System Workflow

Customer logs into the system
Customer browses available insurance plans
Customer selects a plan which appears in My Policies
Customer submits a claim with claim amount, description, and supporting document
Administrator reviews the claim submission
Administrator updates the claim status
Customer can track the updated claim status

Screenshots

Screenshots of the system including:
Admin creating insurance plans
Customer browsing plans
Claim submission and status tracking
are included in the screenshots folder of this repository.

Frontend
The frontend provides the user interface for both customers and administrators to interact with the system.
HTML
JavaScript
Tailwind CSS / Bootstrap (for responsive UI design)

The frontend allows users to browse insurance plans, manage policies, and submit claims through an intuitive dashboard.

Backend
The backend manages the core business logic including insurance plan management, policy tracking, and claim processing.
Python (FastAPI / Flask / Django) or Node.js (mention the one your system uses)

The backend handles:
Plan management
Policy selection
Claim submission
Claim status updates
Database

The system uses a relational database to maintain structured relationships between entities.
PostgreSQL / MySQL
Key relational entities include:
User → Policy → Claim

File Handling
The system includes a file storage mechanism for claim documents.
Customers can upload supporting documents when submitting a claim.
Supported file formats:
PDF
JPG
PNG

Uploaded files are stored and linked to the corresponding claim record in the database.
