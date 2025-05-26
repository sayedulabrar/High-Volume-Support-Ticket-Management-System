import { format } from 'date-fns';
import { TicketReply } from '../../api/ticketApi';
import { useAuth } from '../../hooks/useAuth';

interface TicketRepliesListProps {
  replies: TicketReply[];
}

const TicketRepliesList = ({ replies }: TicketRepliesListProps) => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {replies.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center py-6">
          No replies yet. Be the first to reply!
        </p>
      ) : (
        replies.map((reply) => {
          const isCurrentUser = reply.user.id === user?.id;
          
          return (
            <div
              key={reply.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg shadow p-4 max-w-[80%] ${
                  isCurrentUser
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-center mb-2">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-white ${
                      isCurrentUser ? 'bg-blue-600' : 'bg-purple-600'
                    }`}
                  >
                    {reply.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {reply.user.name}
                      {isCurrentUser && ' (You)'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {format(new Date(reply.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {reply.message}
                </div>
                
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default TicketRepliesList;