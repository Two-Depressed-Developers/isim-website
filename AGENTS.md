# General Rules

- Avoid adding comments, unless they are strictly necessary for understanding.
- Strictly use types instead of interfaces unless you are defining a public API.
- Name type for properties should always be Props.
- Copy should be in Polish.

# Data Fetching and State Management

- Use Next.js API routes ONLY for auth, emails and python service integration.
- Use react query (located in data/queries) for data fetching and mutations.
- Create react query functions in data/loaders.ts
- Use axios

# i18n

- on the auth group dont use i18n, it should be in polish
- on the public group use i18n for both pl and en locales
