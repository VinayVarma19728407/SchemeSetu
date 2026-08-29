# SchemeSetu - Administrator Manual

Welcome to the **SchemeSetu Admin Console**. This manual outlines the procedures for platform administrators to manage schemes, view analytics, and oversee the platform's operation.

---

## 1. Accessing the Admin Console

1. Navigate to the standard login page (`/login`).
2. Enter your designated Administrator Email and Password.
3. Upon successful authentication, the system will detect your Admin role and redirect you to the **Admin Dashboard**, and an "Admin Panel" link will appear in your navigation bar.

---

## 2. The Admin Dashboard

The Admin Dashboard provides a high-level overview of the platform's status.
- **Analytics Overview**: View key metrics such as Total Active Schemes, Total Registered Users, and recent system activity.
- **Quick Links**: Immediate access to scheme management interfaces.

---

## 3. Managing Schemes

As an administrator, you are responsible for keeping the centralized repository of government schemes accurate and up to date. 

### 3.1 Viewing the Scheme Directory
1. Navigate to **Manage Schemes** from the Admin Panel.
2. You will see a tabular view of all schemes currently live on the platform, categorized by Ministry and State.

### 3.2 Adding a New Scheme
1. Click the **Add New Scheme** button.
2. Fill out the comprehensive scheme form, which includes:
   - **Basic Details**: Scheme Name, Ministry, Description.
   - **Eligibility Criteria**: Define the demographic and specific requirements a user must meet (e.g., Income thresholds, Age limits).
   - **Benefits & Documents**: List the benefits provided and documents required to apply.
   - **Application Process**: Provide step-by-step application instructions or links to the official portal.
3. Click **Publish Scheme**. The scheme data is written to the backend file system and instantly becomes searchable by users.

### 3.3 Editing an Existing Scheme
1. Locate the scheme in the directory and click the **Edit** (pencil) icon.
2. Modify the necessary details.
3. Click **Save Changes**.

### 3.4 Deleting a Scheme
1. Locate the scheme in the directory and click the **Delete** (trash) icon.
2. Confirm the deletion prompt. *Warning: This action permanently removes the scheme from the database and all user bookmark lists.*

---

## 4. System Logs & Maintenance

The backend system utilizes a file-based storage mechanism. 
- Ensure that the server environment has proper read/write permissions for the `server/data/` directory.
- Logs are automatically generated for critical events (such as logins, profile updates, and scheme modifications) and are stored securely on the server.
