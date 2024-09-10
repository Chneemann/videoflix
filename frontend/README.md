# Frontend

## Environment Configuration

In order to manage different configurations for development and production environments, Angular uses the `environment.ts` and `environment.prod.ts` files.

### Step 1: Creating environment files

You need to create the following files in the `src/environments/` directory:

- `environment.ts` for development
- `environment.prod.ts` for production

### Step 2: Add baseUrl and guest account

In the `environment.ts` & `environment.prod.ts` file, add the following content:

```typescript
export const environment = {
  production: false,
  baseUrl: "YOUR_API_URL_HERE",

  // Guest account
  guestMail: "YOUR_GUEST_EMAIL_HERE",
  guestPassword: "YOUR_GUEST_PASSWORD_HERE",
};
```
