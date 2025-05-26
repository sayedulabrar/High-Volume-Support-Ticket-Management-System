import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TicketFormData, ticketApi } from '../../api/ticketApi';
import TicketForm from '../../components/tickets/TicketForm';

const CreateTicket = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (data: TicketFormData) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      await ticketApi.createTicket(data);
      navigate('/tickets');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'An error occurred while creating the ticket. Please try again.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/tickets" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Tickets
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Create New Support Ticket</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md p-4 text-sm">
          {error}
        </div>
      )}
      
      <div className="card p-6">
        <TicketForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </div>
  );
};

export default CreateTicket;