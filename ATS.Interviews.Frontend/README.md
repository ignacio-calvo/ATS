# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## ATS API Integration

This project integrates with the ATS API to manage applicant tracking. The integration requires the following environment variables:

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
