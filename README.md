# Frontend

## Environment Configuration

In order to manage different configurations for development and production environments, Angular uses the `environment.ts` and `environment.prod.ts` files.

### Step 1: Creating environment files

You need to create the following files in the `src/environments/` directory:

- `environment.ts` for development
- `environment.prod.ts` for production

### Step 2: Add baseUrl and guest account

In the `environment.ts` & `environment.prod.ts` file, add the following content:

````typescript
export const environment = {
  production: false,
  baseUrl: 'YOUR_API_URL_HERE',

  // Guest account
  guestMail: 'YOUR_GUEST_EMAIL_HERE',
  guestPassword: 'YOUR_GUEST_PASSWORD_HERE',
};
````

# Backend

## Env Configuration

To set the mail configuration for the backend, you must create an `.env` file in the root directory of your project. This file should have the following content:

### Step 1: Creating the `.env` file

Create a file named `.env` in the root directory of the project.

### Step 2: Add the e-mail configuration

Open the `.env` file and add the following lines:

````env
EMAIL_HOST_USER=example@gmail.com
EMAIL_HOST_PASSWORD=password

````
