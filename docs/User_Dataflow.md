# User Dataflow

The following diagram illustrates the typical dataflow and user journey within the SchemeSetu platform for a standard user.

```mermaid
flowchart TD
    A([Start]) --> B[Landing Page]
    
    B --> C{Registered User?}
    C -- No --> D[Registration / Signup]
    D --> E[(users.json)]
    D --> F[Login]
    C -- Yes --> F
    
    F --> G{Authenticate}
    G -- Success --> H[User Dashboard]
    G -- Failure --> F
    
    H --> I[My Profile]
    I --> J[Update Demographic Details]
    J --> K[(profiles.json)]
    
    H --> L[Browse Schemes]
    L --> M[View Scheme Directory]
    M --> N[Filter/Search Schemes]
    
    H --> O[Find Schemes for Me]
    O --> P{Profile Complete?}
    P -- No --> I
    P -- Yes --> Q[System matches profile against eligibility criteria]
    Q --> R[Display Recommended Schemes]
    
    N --> S[View Scheme Details]
    R --> S
    
    S --> T[Bookmark Scheme]
    T --> U[(bookmarks.json)]
    
    H --> V[Bookmarks Page]
    V --> S
    
    H --> W([Logout])
    W --> A
```

### Key Processes:
1. **Authentication Flow**: Users register or log in. Their credentials are saved and verified against the JSON-based datastore (`users.json`).
2. **Profile Management**: Users can update their demographic details (age, gender, income, state, etc.), which are saved in `profiles.json` and used for eligibility checks.
3. **Scheme Discovery**: Users can manually browse schemes or use the "Find Schemes for Me" feature, which calculates matches based on their profile and dynamically generated questionnaires.
4. **Bookmarking**: Users can save schemes of interest to their bookmarks, which persist across sessions via `bookmarks.json`.
