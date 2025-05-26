import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine where to redirect based on user role
    if (user) {
      setLoading(false);
      
      if (user.roles.some(r => r.name === 'Admin')) {
        navigate('/admin/dashboard');
      } else if (user.roles.some(r => r.name === 'Support Agent')) {
        navigate('/support/tickets');
      } else if (user.roles.some(r => r.name === 'Customer')) {
        navigate('/tickets');
      }
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return null; // This component will redirect, so no need to render anything
};

export default Dashboard;