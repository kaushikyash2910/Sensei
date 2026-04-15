# Full Stack AI Career Coach with Next JS, Neon DB, Tailwind, Prisma, Inngest, Shadcn UI Tutorial 🔥🔥



### Make sure to create a `.env` file with following variables -




```
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

GEMINI_API_KEY=
```
### Installation and Setup

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yashkaushik/sensei.git
    cd sensei
    ```

2. **Install Dependencies**:
    Ensure you have Node.js installed. Then, run:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory and add the required variables as shown above.

4. **Run Database Migrations**:
    Use Prisma to apply migrations:
    ```bash
    npx prisma migrate dev
    ```

5. **Start the Development Server**:
    ```bash
    npm run dev
    ```

6. **Access the Application**:
    Open your browser and navigate to `http://localhost:3000`.

---

### Packages Used

- **Next.js**: React framework for building server-side rendered and static web applications.
- **Neon DB**: Serverless PostgreSQL database for modern applications.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Prisma**: ORM for database management.
- **Inngest**: Event-driven workflows for serverless applications.
- **Shadcn UI**: Pre-built UI components for Tailwind CSS.
- **Clerk**: Authentication and user management.

---

### Scripts

- **Start Development Server**:
  ```bash
  npm run dev
  ```
- **Build for Production**:
  ```bash
  npm run build
  ```
- **Run Production Server**:
  ```bash
  npm start
  ```
- **Run Prisma Studio**:
  ```bash
  npx prisma studio
  ```

---

### Folder Structure

```
/components       # Reusable React components
/pages            # Next.js pages
/prisma           # Prisma schema and migrations
/public           # Static assets
/styles           # Global styles
```

---

### Deployment

1. **Build the Application**:
    ```bash
    npm run build
    ```

2. **Deploy to Vercel**:
    - Connect your GitHub repository to Vercel.
    - Set up environment variables in the Vercel dashboard.
    - Deploy the application.

3. **Database Hosting**:
    - Use Neon DB for hosting your PostgreSQL database.
    - Update the `DATABASE_URL` in your `.env` file with the Neon DB connection string.

---

### Additional Notes

- Refer to the official documentation of each package for advanced configurations.
- Ensure your `.env` file is not committed to version control for security reasons.
