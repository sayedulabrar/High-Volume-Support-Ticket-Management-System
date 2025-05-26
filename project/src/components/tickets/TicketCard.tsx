import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Ticket } from '../../api/ticketApi';
import StatusBadge from '../ui/StatusBadge';
import PriorityBadge from '../ui/PriorityBadge';

interface TicketCardProps {
  ticket: Ticket;
  linkPrefix: string;
}

const TicketCard = ({ ticket, linkPrefix }: TicketCardProps) => {
  return (
    <div className="card transition-all hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
            {ticket.subject}
          </h3>
          <div className="flex items-center space-x-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {ticket.description}
        </p>
        
        <div className="flex justify-between items-center text-sm">
          <div className="text-gray-500 dark:text-gray-400">
            <p>Ticket #{ticket.id}</p>
            <p>Created: {format(new Date(ticket.created_at), 'MMM d, yyyy')}</p>
          </div>
          
          <Link
            to={`${linkPrefix}/${ticket.id}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            View details
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;