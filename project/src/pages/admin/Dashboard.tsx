import { useQuery } from 'react-query';
import { Ticket as TicketIcon, Circle, Users, Clock } from 'lucide-react';
import { ticketApi,Ticket } from '../../api/ticketApi';
import { adminApi ,User} from '../../api/adminApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Dashboard = () => {
  // Get all tickets for statistics
  const {
    data: tickets,
    isLoading: isLoadingTickets,
  } = useQuery(['adminTickets'], () => ticketApi.getAdminTickets({}));
  
  // Get users for statistics
  const {
    data: users,
    isLoading: isLoadingUsers,
  } = useQuery<User[]>(['adminUsers'], () => adminApi.getUsers());
  

  // Calculate ticket statistics
  const ticketStats = {
    total: tickets?.length || 0,
    open: tickets?.filter(t => t.status === 'open').length || 0,
    inProgress: tickets?.filter(t => t.status === 'in progress').length || 0,
    resolved: tickets?.filter(t => t.status === 'resolved').length || 0,
    closed: tickets?.filter(t => t.status === 'closed').length || 0,
    highPriority: tickets?.filter(t => t.priority === 'high').length || 0,
    unassigned: tickets?.filter(t => !t.assigned_to).length || 0
  };
  
  // Calculate user statistics
  const userStats = {
    total: users?.length || 0,
    customers: users?.filter(u => u.roles.some(r => r.name === 'Admin')).length || 0,
    agents: users?.filter(u => u.roles.some(r => r.name === 'Support Agent')).length || 0,
    admins: users?.filter(u => u.roles.some(r => r.name === 'Customer')).length || 0
  };
  
  const isLoading = isLoadingTickets || isLoadingUsers;

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm">Total Tickets</p>
              <p className="text-3xl font-bold mt-1">{ticketStats.total}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <TicketIcon className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-br from-red-600 to-red-700 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-red-100 text-sm">High Priority</p>
              <p className="text-3xl font-bold mt-1">{ticketStats.highPriority}</p>
            </div>
            <div className="bg-red-500 p-3 rounded-lg">
              <Circle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-br from-purple-600 to-purple-700 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm">Total Users</p>
              <p className="text-3xl font-bold mt-1">{userStats.total}</p>
            </div>
            <div className="bg-purple-500 p-3 rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="card p-6 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-yellow-50 text-sm">Unassigned</p>
              <p className="text-3xl font-bold mt-1">{ticketStats.unassigned}</p>
            </div>
            <div className="bg-yellow-400 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Ticket Status</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${(ticketStats.open / ticketStats.total) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 w-16 text-right font-medium text-sm">
                {ticketStats.open} Open
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-yellow-500 h-4 rounded-full"
                  style={{ width: `${(ticketStats.inProgress / ticketStats.total) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 w-16 text-right font-medium text-sm">
                {ticketStats.inProgress} In Progress
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full"
                  style={{ width: `${(ticketStats.resolved / ticketStats.total) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 w-16 text-right font-medium text-sm">
                {ticketStats.resolved} Resolved
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-gray-500 h-4 rounded-full"
                  style={{ width: `${(ticketStats.closed / ticketStats.total) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 w-16 text-right font-medium text-sm">
                {ticketStats.closed} Closed
              </span>
            </div>
          </div>
        </div>
        
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-teal-500 h-4 rounded-full"
                  style={{ width: `${(userStats.customers / userStats.total) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 w-16 text-right font-medium text-sm">
                {userStats.customers} Customers
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-purple-500 h-4 rounded-full"
                  style={{ width: `${(userStats.agents / userStats.total) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 w-16 text-right font-medium text-sm">
                {userStats.agents} Agents
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${(userStats.admins / userStats.total) * 100}%` }}
                ></div>
              </div>
              <span className="ml-4 w-16 text-right font-medium text-sm">
                {userStats.admins} Admins
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;