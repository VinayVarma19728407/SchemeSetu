# Admin Dataflow

The following diagram illustrates the dataflow and operations available to an Administrator within the SchemeSetu platform.

```mermaid
flowchart TD
    A([Start]) --> B[Admin Login Portal]
    
    B --> C{Authenticate}
    C -- Failure --> B
    C -- Success --> D[Admin Dashboard]
    
    D --> E[View System Analytics]
    E --> F[(analytics/ logs/)]
    
    D --> G[Manage Schemes]
    
    G --> H{Action}
    
    H -- Add --> I[Create New Scheme]
    I --> J[Input Scheme Details & Eligibility Rules]
    J --> K[(categories/ schemes data)]
    
    H -- Edit --> L[Update Existing Scheme]
    L --> M[Modify Details/Rules]
    M --> K
    
    H -- Delete --> N[Remove Scheme]
    N --> K
    
    D --> O([Logout])
    O --> A
```

### Key Processes:
1. **Admin Authentication**: Administrators log in using specific credentials verified against `admin.json`.
2. **Dashboard & Analytics**: Admins can view platform usage statistics and metrics fetched from the `analytics` data folder.
3. **Scheme Management**: The core admin function. Admins can perform CRUD (Create, Read, Update, Delete) operations on the central scheme repository, updating the underlying JSON data files so that changes instantly reflect on the user-facing portal.
