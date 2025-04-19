# ATS Project

## Project Structure

The ATS project is organized into several key directories:

- **AspireApp/**: Contains the main application host and service defaults.
- **ATS.Interviews.API/**: Hosts the API layer, including controllers and configuration files.
- **ATS.Interviews.Business/**: Contains business logic and services.
- **ATS.Interviews.Data/**: Manages data access, models, and migrations.
- **ATS.Interviews.Frontend/**: Frontend application built with TypeScript and Vite.

## Environment Variables

The project requires the following environment variables to integrate with the ATS API:

- `ATS_CLIENT_ID`: The client ID for authenticating with the ATS API.
- `ATS_CLIENT_SECRET`: The client secret for authenticating with the ATS API.
- `ATS_USERNAME`: The username (email) for authenticating with the ATS API.
- `ATS_PASSWORD`: The password for authenticating with the ATS API.

These variables should be defined in a `.env` file located at the root of the project. An example `.env` file is as follows:

```
ATS_CLIENT_ID=your_client_id_here
ATS_CLIENT_SECRET=your_client_secret_here
ATS_USERNAME=your_username_here
ATS_PASSWORD=your_password_here
```

Ensure that the `.env` file is not committed to version control to protect sensitive information.