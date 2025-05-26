import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from './ui/LoadingSpinner';

interface RoleRouteProps {
  role: string;
}

const RoleRoute = ({ role }: RoleRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || !user.roles.some(r => r.name === role)) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default RoleRoute;