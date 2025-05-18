# Citizen Complaint & Feedback Management System

A role-based platform for managing citizen complaints in Rwanda, enabling transparency, trackable, and efficient multi-level resolution.

## Overview

- Citizens submit complaints related to public services
- Routed by organization ->  district -> sector
- Sector, District, and Org Admins manage resolution
- Escalation and feedback ensure accountability



## User Roles

| Role            | Permissions |
|------------------|-------------|
| **Super Admin**  | Creates orgs, assigns org admins |
| **Org Admin**    | Manages districts,  handle org-wide complaints |
| **District Admin** | Manages sectors, handles district-level complaints  escalates if needed |
| **Sector Admin** | Handles local complaints, escalates if needed |
| **Citizen**      | Submits complaints, tracks status, adds feedback,  escalates if needed |


##  Complaint Flow

Citizen submits ->
Sector Admin handles-> 
Escalate to District Admin if needed->
Escalate to Org Admin if needed->
Citizen confirms resolution or escalate if not satisified


## Implemented MVP Features

###  Complaint Management
- Citizen complaint submission (requires login)
- Select organization, district, sector, and service
- File attachments and descriptive input

###  Escalation Logic
- Citizens can escalate complaints manually with a reason on creation or unsatisified on resolution or rejection 
- Admins can escalate complaints they cannot resolve

### Admin Interfaces
- **Sector Admin**: views local complaints, updates status, escalates, dashboard overview
- **District Admin**: sees escalated complaints, full dashboard
- **Org Admin**: top-level complaint manager with analytics
- **super admin**: management of organization and summary overview

###  Complaint Timeline
- View status history (pending -> in-progress ->requested-moreinfo(if any) -> resolved || rejection)
- All actions (comments, escalations, add attachemnt) logged
- Comments visible as threaded discussions

### Feedback System
- Citizens must **confirm resolution**
- Feedback added as comments

###  Notifications
- Every action triggers:
  - A comment
  - A notification 
- Tracked types: status_change, comment, escalation, resolution

### Authentication
- JWT-based auth
- Role-based routes
- Forgot password flow (reset via token)



## non-MVP(coming soon) Features

### Complaint Tagging
- Citizens can tag multiple entities (orgs or admins)
- For cross-agency issues

### SMS Notifications
 - SMS alerts for:
    - Complaint submitted
    - Complaint resolved
    - Complaint escalated

###  Smart Features
- Category auto-suggestion using NLP
- Citizen feedback scoring and rating
- Admin-level analytics dashboard 

###  Analytics & Insights
- Complaint breakdown by category and region
- Escalation frequency
- Heatmaps and team performance tracking

### Mobile-first PWA
- Offline support
- Push notifications
## performance

 - caching using
 - multi language
 - theme switcher



##  Hackathon Requirement Mapping

| Requirement                              |  Notes 
|------------------------------------------|------------------|
| Complaint/Feedback submission            | Citizens submit with routing |
| Routing to correct agency                | Via organization -> district -> sector |
| Complaint status tracking                | Citizens can track using ticket ID or other info, see updates/comments
| Admin interface for managing tickets     | Sector, District, Org dashboards |
| Feedback and escalation options          | Confirmations + escalation reasons |
| RBAC + structured system                 | JWT + role mapping |
| Documentation & UX                       | Clean UI + Markdown docs |
| Responsiveness
| api versioning                           
| environment variables for security 
|  performance                             | implimented ACID principles to request with morethan one databse operation (update,delete and create)  
| CORS orgin for securing API


##  Tech Stack

- **Frontend:** Next.js, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express, MongoDB (Mongoose),TypeScript
- **Auth:** JWT, bcrypt
- **Notifications:** In-app + Email
- **Deployment:** Vercel (Frontend), Render (Backend)
- **version control**:Git and GitHub
- **File store**:Cloudinary with rod-fileupload (npm package that made by me)
- **Backend hosted on**:Render
- **Frontend**:Vercel



## Project Setup

## Backend

   ### Prerequisites
      - Node.js 
      - MongoDB
      - npm or yarn package manager

  ### Installation
      1. Clone the repository
```bash
git clone https://github.com/rodriguecyber/Citizen-engagement-bn
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env
# Edit .env with your configuration


4. Start the development server
```bash
npm run dev
```

### Environment Variables
Required environment variables are documented in `.env.example`. Key variables include:

- `CLOUDINARY_CLOUD_NAME`= cloudinary cloud name
- `CLOUDINARY_API_KEY`= cloudinary cloud api key
- `CLOUDINARY_API_SECRET`= cloudinary spi secret
- `NODE_ENV` = node environment
- `FRONT-END_URL` = to use in password reset and Cross orgin 
- `SMTP_FROM_NAM` = name of sender
- `SMTP_FROM_EMAIL` = sender email
- `PORT` = server port
- `MONGODB_URI` =`mongodb connetction string with database name like mongodb://localhost:27017/citizen-engagement
- `JWT_SECRET` = JWT secret 
- `SMTP_HOST` =  smt host
- `SMTP_PORT`= smtp port
- `SMTP_USER`= smtp user
- `SMTP_PASSWORD`=smtp password


## Frontend

   ### Prerequisites
      - Node.js (v14 or higher)
      - npm or yarn package manager

  ### Installation
      1. Clone the repository
```bash
git clone https://github.com/rodriguecyber/Citizen-engagement-fn
```

2. Install dependencies
```bash
npm install or npm install --force or yarn install
```

3. Configure environment variables
```bash
cp .env
# Edit .env with your configuration


4. Start the development server
```bash
npm run dev
```

### Environment Variables
Required environment variables are documented in `.env`. Key variables include:

- `NEXT_PUBLIC_API_URL`= base api url

##  Author

**RWIGARA Rodrigue**  
Software Engineer | Kigali, Rwanda  
Focused on civic innovation and scalable systems.

Get In touch with me
Github: https://github.com/rodriguecyber
email: rodrirwigara@gmail.com
Portfolio: https://rodrigue.xcooll.com
 


## Use Cases (Testing Guide)

This section outlines key use cases to help testers verify the core functionality of the system.

 
###  Use Case 1: Super admin

1. Login using this credential 

 ```bash
`Email`:rodrirwigara@gmail.com
`Password`:ChangeMe123!
```
2. click on organization page
3. add new organization 
4. organization admin will use the email you used to create organization and password: `ChangeMe123!`


###  Use Case 2: Organization Admin - Final Resolution

1. Login as Org Admin using credential
```bash
`Email`:email super admin asssigned to you
`Password`:ChangeMe123!
```
2. add District where organization operates
3. Resolve org-level complaints
4. Finalize decisions
6. View org-wide analytics


###  Use Case 3: District Admin - Handle Escalations

1. Login as District Admin using this credentials

```bash
`Email`:email organization admin asssigned to you
`Password`:ChangeMe123!
```
2. add sectors where organization operates
3. View escalated complaints
4. Respond, resolve, or escalate to organization
5. View district-level dashboard stats


###  Use Case 4: Sector Admin - Handle Local Complaints

1. Login as Sector Admin using this credential
 ```bash
`Email`:email districtn asssigned to you
`Password`:ChangeMe123!
```
2. View complaints in dashboard
3. Update status, add comment, or escalate to district
4. Upload optional attachments (not implememted yet)
5. every changes visible to citizen


###  Use Case 5: Citizen - Submit & Track Complaint

1. Register a new citizen account  and password.
2. Login and click "New complaint" button page.
3. Select organization, district, sector, and service
4. Fill description and attach file
5. Submit complaint
6. Track via "My Complaints"
7. Confirm resolution or escalate if needed


### Use Case 6: Forgot Password

1. Click "Forgot Password" on login page
2. Submit email
3. Receive link and click on it
4. Enter new password submit
5. Login again



###  Use Case 6: Notifications

1. Submit complaint as citizen
2. Add comment/status as admin
3. Verify notification received


### Planned production deployment 

 - realtime database backup with mongodb replicaSet
 - npm audit for  finding ourdated packages
 - logging error and monitoring server health
 - DevOps for testing and deployment
 - caching and load balance to handle server slowdowns


## NB:
  - due hosting on free plan of render it may slowdown the backend operation to 50s as render says
  - responsiveness on mobile phone is not implemented well on all pages so better Test on Computer
  - some pages containing dummy datas for display reasons especialy on dashboard pages 
  - for citizen registration please choos kigali -  gasabo district becaouse is the one with its repective sectors so far
 