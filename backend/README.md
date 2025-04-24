# Backend

## Env Configuration

To configure your backend application, you need to create an `.env` file in the videoflix folder of your project. This file contains various environment-specific settings, including email, security, and monitoring configuration.

### Step 1: Create the `.env` file

Create a file named `.env` inside the videoflix folder of your project:

```
/your-project-root/
└── videoflix/
    ├── .env_example
    └── .env  ← create this file
```

You can also simply rename or copy the existing `.env_example` file:

```bash
cp videoflix/.env_example videoflix/.env
```

Then open `videoflix/.env` and adjust the values according to your environment.

### Step 2: Add the required configuration

Open the `.env` file and include the following lines according to your needs:

```env
# General settings
DEBUG=False
SECRET_KEY=your_secret_key_here

# Email settings
EMAIL_HOST_USER=your_email_user
EMAIL_HOST_PASSWORD=your_email_password

# Sentry settings
SENTRY_DSN=your_sentry_dsn
```
