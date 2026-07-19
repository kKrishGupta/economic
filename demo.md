# Demo Authentication Guide

This document explains how the demo authentication (Login/Registration) system works for testing purposes, how to log in as an Admin, and how to remove these demo bypasses before deploying to production.

## 1. How to use Demo Login

On the Login page (`/login`), you will see two new buttons at the bottom of the form:
- **Demo Admin**: Logs you in instantly as an Admin user.
- **Demo User**: Logs you in instantly as a standard Operator user.

Clicking these buttons bypasses the real backend API call and creates a fake session locally, redirecting you immediately to the dashboard.

### How Admin Login Works
When you click **Demo Admin**, the system assigns you the `ADMIN` role. 
Because of the `<RoleGuard>` component implemented in `src/routes/RoleGuard.jsx`, only users with the `ADMIN` role can see and access the **Admin Console** tab in the sidebar (`/admin`). Once you are logged in as the Demo Admin, the Admin route becomes fully unlocked.

## 2. Routes and Manual Test Credentials

If you prefer to manually test the forms instead of clicking the one-click demo buttons, you can navigate to the following routes and use these mock credentials (they will be caught by the same bypass logic):

### Standard User
- **Route / URL**: `/login`
- **Username**: `demo_user`
- **Password**: `password123` (or anything, password validation is bypassed in demo mode)

### Admin User
- **Route / URL**: `/login`
- **Username**: `demo_admin`
- **Password**: `password123` (or anything, password validation is bypassed in demo mode)

### Registration Route
- **Route / URL**: `/register`
- **Username Pattern**: Any username starting with `demo_` (e.g., `demo_john`, `demo_tester`) will automatically trigger the demo bypass and log you in.

---

## 3. How to use Demo Registration

On the Registration page (`/register`), there is a **Demo Registration** button.
Clicking this automatically submits a registration payload with a randomly generated username (e.g., `demo_user_123`) and valid mock credentials, instantly granting you access to the dashboard as a standard user.

---

## 3. How to Remove Demo Bypasses (Production Cleanup)

When you are ready to remove the demo buttons and enforce strict backend authentication, follow these exact steps to clean up the codebase.

### Step 1: Clean up `src/services/AuthService.js`
Open `src/services/AuthService.js` and delete the `// --- DEMO BYPASS ---` blocks inside the `login` and `register` methods.

**Delete this from `login()`:**
```javascript
// --- DEMO BYPASS ---
if (credentials.username === 'demo_admin') {
  const demoData = { accessToken: 'demo-token', refreshToken: 'demo-refresh', username: 'Demo Admin', role: 'ADMIN', tokenType: 'Bearer' };
  this.setSession(demoData);
  return demoData;
}
if (credentials.username === 'demo_user') {
  const demoData = { accessToken: 'demo-token', refreshToken: 'demo-refresh', username: 'Demo User', role: 'USER', tokenType: 'Bearer' };
  this.setSession(demoData);
  return demoData;
}
// -------------------
```

**Delete this from `register()`:**
```javascript
// --- DEMO BYPASS ---
if (userData.username?.startsWith('demo_')) {
  const demoData = { accessToken: 'demo-token', refreshToken: 'demo-refresh', username: userData.username, role: 'USER', tokenType: 'Bearer' };
  this.setSession(demoData);
  return demoData;
}
// -------------------
```

### Step 2: Clean up `src/pages/Login.jsx`
Open `src/pages/Login.jsx` and delete the `DEMO BUTTONS` section inside the form:

**Delete this block:**
```jsx
{/* DEMO BUTTONS */}
<div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-border/50">
  <Button
    type="button"
    variant="outline"
    className="flex-1 text-xs"
    onClick={() => onSubmit({ username: 'demo_admin', password: 'password123' })}
  >
    Demo Admin
  </Button>
  <Button
    type="button"
    variant="outline"
    className="flex-1 text-xs"
    onClick={() => onSubmit({ username: 'demo_user', password: 'password123' })}
  >
    Demo User
  </Button>
</div>
```

### Step 3: Clean up `src/pages/Register.jsx`
Open `src/pages/Register.jsx` and delete the `DEMO BUTTONS` section inside the form:

**Delete this block:**
```jsx
{/* DEMO BUTTONS */}
<div className="mt-4 pt-4 border-t border-border/50">
  <Button
    type="button"
    variant="outline"
    className="w-full text-xs"
    onClick={() => onSubmit({ username: `demo_user_${Math.floor(Math.random() * 1000)}`, email: 'demo@example.com', password: 'Password@123' })}
  >
    Demo Registration
  </Button>
</div>
```

Once these three steps are complete, your application will exclusively rely on your Spring Boot backend for all authentication and role verification.
