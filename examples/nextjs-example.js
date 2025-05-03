// pages/api/protected.js
import { withAuthAPI } from 'universal-auth-kit/next';

function handler(req, res) {
  // req.user is available here
  res.status(200).json({ 
    message: 'This is a protected API route', 
    user: req.user 
  });
}

export default withAuthAPI(handler);

// pages/protected.js
import { withAuthSSR } from 'universal-auth-kit/next';
import { useAuth } from 'universal-auth-kit/client';

function ProtectedPage({ user }) {
  const { logout } = useAuth();
  
  return (
    <div>
      <h1>Protected Page</h1>
      <p>Hello, {user.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export const getServerSideProps = withAuthSSR();

export default ProtectedPage;
