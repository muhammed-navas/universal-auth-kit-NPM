# Universal Auth Kit

A universal authentication kit for React, Node.js, and Next.js applications.

## Features

- JWT-based authentication
- Support for React applications
- Support for Node.js/Express applications
- Support for Next.js applications
- TypeScript support

## Installation

```bash
npm install universal-auth-kit
# or
yarn add universal-auth-kit
# or
pnpm add universal-auth-kit
```

## Usage

### React Client

```jsx
import { AuthProvider, useAuth } from 'universal-auth-kit/client';

// Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}

// Use the auth hook in your components
function LoginForm() {
  const { login } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    await login(username, password);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" type="text" />
      <input name="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### Express Server

```js
import express from 'express';
import cookieParser from 'cookie-parser';
import { authMiddleware, authRoutes } from 'universal-auth-kit/server';

const app = express();

app.use(cookieParser());
app.use('/auth', authRoutes);

// Protected route
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Next.js

```jsx
// pages/api/protected.js
import { withAuthAPI } from 'universal-auth-kit/next';

function handler(req, res) {
  // req.user is available here
  res.json({ message: 'This is a protected API route', user: req.user });
}

export default withAuthAPI(handler);

// pages/protected.js
import { withAuthSSR } from 'universal-auth-kit/next';

function ProtectedPage({ user }) {
  return <div>Hello, {user.username}!</div>;
}

export const getServerSideProps = withAuthSSR();

export default ProtectedPage;
```

## License

MIT
