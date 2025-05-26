import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { format } from 'date-fns';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { TicketReplyFormData, ticketApi } from '../../api/ticketApi';
import StatusBadge from '../../components/ui/StatusBadge';
import PriorityBadge from '../../components/ui/PriorityBadge';
import TicketRepliesList from '../../components/tickets/TicketRepliesList';
import TicketReplyForm from '../../components/tickets/TicketReplyForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const ticketId = parseInt(id || '0', 10);
  
  const [error, setError] = useState<string | null>(null);
  
  // Get ticket details
  const {
    data: ticket,
    isLoading: isLoadingTicket,
    error: ticketError,
  } = useQuery(
    ['customerTicket', ticketId],
    () => ticketApi.getCustomerTicket(ticketId),
    {
      enabled: !!ticketId,
    }
  );
  
  // Get ticket replies
  const {
    data: replies,
    isLoading: isLoadingReplies,
    error: repliesError,
  } = useQuery(
    ['ticketReplies', ticketId],
    () => ticketApi.getTicketReplies(ticketId, 'Customer'),
    {
      enabled: !!ticketId,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  );
  
  // Add reply mutation
  const addReplyMutation = useMutation(
    (data: TicketReplyFormData) => ticketApi.createTicketReply(ticketId, data, 'Customer'),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['ticketReplies', ticketId]);
        setError(null);
      },
      onError: (err: any) => {
        setError(
          err.response?.data?.message || 'An error occurred while sending your reply. Please try again.'
        );
      },
    }
  );
  
  const handleReplySubmit = async (data: TicketReplyFormData) => {
    await addReplyMutation.mutateAsync(data);
  };
  
  if (isLoadingTicket) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  if (ticketError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-2" />
        <div>
          <p className="text-red-600 dark:text-red-400 font-medium">
            Failed to load ticket
          </p>
          <p className="text-red-600 dark:text-red-400 mt-1">
            Please try again later or go back to your tickets.
          </p>
          <Link to="/tickets" className="mt-4 btn-outline inline-block">
            Back to My Tickets
          </Link>
        </div>
      </div>
    );
  }
  
  if (!ticket) {
    return null;
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/tickets" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Tickets
        </Link>
      </div>

      <div className="card mb-6">
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <h1 className="text-2xl font-bold mb-2 md:mb-0">{ticket.subject}</h1>
            <div className="flex space-x-2">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Ticket ID</p>
              <p className="font-medium">#{ticket.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Category</p>
              <p className="font-medium capitalize">{ticket.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
              <p className="font-medium">{format(new Date(ticket.created_at), 'PPp')}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Assigned To</p>
              <p className="font-medium">
                {ticket.assigned_to ? ticket.assigned_agent?.name : 'Not assigned yet'}
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>
          
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Conversation</h2>
        
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md p-3 text-sm">
            {error}
          </div>
        )}
        
        {isLoadingReplies ? (
          <div className="py-8 flex justify-center">
            <LoadingSpinner />
          </div>
        ) : repliesError ? (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md">
            <p className="text-red-600 dark:text-red-400">
              Failed to load replies. Please refresh the page to try again.
            </p>
          </div>
        ) : (
          <>
            <TicketRepliesList replies={replies || []} />
            
            {ticket.status !== 'closed' && (
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-medium mb-3">Add Reply</h3>
                <TicketReplyForm
                  onSubmit={handleReplySubmit}
                  isSubmitting={addReplyMutation.isLoading}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;