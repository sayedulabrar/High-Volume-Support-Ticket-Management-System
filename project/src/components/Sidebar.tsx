import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TicketCheck, 
  Users, 
  Plus, 
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  onClose: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    onClose();
  };

  return (
    <div className="h-0 flex-1 flex flex-col bg-blue-700 dark:bg-blue-900">
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-blue-800 dark:bg-blue-950">
        <h2 className="text-xl font-bold text-white">
          Help Desk System
        </h2>
      </div>
      <div className="flex-1 h-0 overflow-y-auto">
        <nav className="flex-1 px-2 py-4 space-y-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-blue-800 dark:bg-blue-950 text-white'
                  : 'text-blue-100 hover:bg-blue-600 dark:hover:bg-blue-800'
              }`
            }
            onClick={onClose}
          >
            <LayoutDashboard className="mr-3 h-5 w-5 text-blue-300" />
            Dashboard
          </NavLink>

          {/* Admin Links */}
          {user?.roles.some(r => r.name === 'Admin') && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-800 dark:bg-blue-950 text-white'
                      : 'text-blue-100 hover:bg-blue-600 dark:hover:bg-blue-800'
                  }`
                }
                onClick={onClose}
              >
                <LayoutDashboard className="mr-3 h-5 w-5 text-blue-300" />
                Admin Dashboard
              </NavLink>
              
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-800 dark:bg-blue-950 text-white'
                      : 'text-blue-100 hover:bg-blue-600 dark:hover:bg-blue-800'
                  }`
                }
                onClick={onClose}
              >
                <Users className="mr-3 h-5 w-5 text-blue-300" />
                User Management
              </NavLink>
            </>
          )}

          {/* Customer Links */}
          {user?.roles.some(r => r.name === 'Customer') && (
            <>
              <NavLink
                to="/tickets"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-800 dark:bg-blue-950 text-white'
                      : 'text-blue-100 hover:bg-blue-600 dark:hover:bg-blue-800'
                  }`
                }
                onClick={onClose}
              >
                <TicketCheck className="mr-3 h-5 w-5 text-blue-300" />
                My Tickets
              </NavLink>
              
              <NavLink
                to="/tickets/create"
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-blue-800 dark:bg-blue-950 text-white'
                      : 'text-blue-100 hover:bg-blue-600 dark:hover:bg-blue-800'
                  }`
                }
                onClick={onClose}
              >
                <Plus className="mr-3 h-5 w-5 text-blue-300" />
                New Ticket
              </NavLink>
            </>
          )}

          {/* Support Agent Links */}
          {user?.roles.some(r => r.name === 'Support Agent') && (
            <NavLink
              to="/support/tickets"
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-blue-800 dark:bg-blue-950 text-white'
                    : 'text-blue-100 hover:bg-blue-600 dark:hover:bg-blue-800'
                }`
              }
              onClick={onClose}
            >
              <TicketCheck className="mr-3 h-5 w-5 text-blue-300" />
              Assigned Tickets
            </NavLink>
          )}

          {/* Common Links */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                isActive
                  ? 'bg-blue-800 dark:bg-blue-950 text-white'
                  : 'text-blue-100 hover:bg-blue-600 dark:hover:bg-blue-800'
              }`
            }
            onClick={onClose}
          >
            <Settings className="mr-3 h-5 w-5 text-blue-300" />
            Profile Settings
          </NavLink>
          
          <button
            onClick={handleLogout}
            className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-blue-100 hover:bg-blue-600 dark:hover:bg-blue-800"
          >
            <LogOut className="mr-3 h-5 w-5 text-blue-300" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;