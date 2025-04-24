# Videoflix API

Videoflix is a full-stack video streaming platform with a decoupled frontend and backend architecture. Built with Django, Angular, and RESTful APIs, it enables users to register, log in, browse videos by genre, and stream content in adaptive quality.

## Technologies Used

**Frontend**

- Angular / TypeScript
- HTML / SCSS

**Backend**

- Django / Django REST Framework / Python
- PostgreSQL, Redis, Django RQ

## Features

### User Authentication

Secure user management with features like registration, email verification, login, logout, and password reset.

- Secure user registration with email verification
- Login and logout with generic error messages
- Password reset via secure email workflow
- Email confirmation required before first login

### Video Dashboard

Discover and browse available videos easily with a dynamic and organized interface.

- Categorized video listings grouped by genre
- Hero section with a featured video teaser
- Responsive thumbnails and video details, dynamically loaded

### Video Playback

Stream videos in your preferred quality with intuitive controls and a smooth viewing experience.

- Manual resolution selection (360p, 720p, 1080p)
- Core video controls (play, pause, skip, fullscreen)
- Watched videos are visually marked as viewed

### Responsive Frontend

Enjoy a seamless user experience across all device types.

- Fully responsive UI for desktop, tablet, and mobile devices
- Clear navigation between registration, login, and dashboard pages
- Optimized for smooth video streaming across different screen sizes

### REST API Backend

Robust backend architecture providing scalable and efficient services to the frontend.

- Django-based API serving all frontend needs, including user management and video data
- PostgreSQL as the main database for data storage and scalability
- Redis caching layer for faster responses and performance optimization
- Django RQ for handling background tasks such as video processing
