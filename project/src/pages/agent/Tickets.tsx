import { useState } from 'react';
import { useQuery } from 'react-query';
import { Filter, AlertCircle } from 'lucide-react';
import { ticketApi,TicketStatus,TicketPriority } from '../../api/ticketApi';
import TicketCard from '../../components/tickets/TicketCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Tickets = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const { data: tickets, isLoading, error } = useQuery(
    ['agentTickets', statusFilter, priorityFilter],
    () =>
      ticketApi.getAgentTickets({
        status: statusFilter !== 'all' ? (statusFilter as TicketStatus) : undefined,
        priority: priorityFilter !== 'all' ? (priorityFilter as TicketPriority) : undefined,
      }),
    {
      refetchInterval: 30000,
    }
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Assigned Tickets</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center mb-4 sm:mb-0">
            <Filter className="mr-2 h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter Tickets
            </span>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
            <select
              className="form-input text-sm py-1"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            <select
              className="form-input text-sm py-1"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
          <p className="text-red-600 dark:text-red-400">
            Failed to load tickets. Please try again later.
          </p>
        </div>
      ) : tickets && tickets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} linkPrefix="/support/tickets" />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            No tickets have been assigned to you yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tickets;
