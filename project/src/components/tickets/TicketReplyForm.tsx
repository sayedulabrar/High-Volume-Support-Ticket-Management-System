import { useForm } from 'react-hook-form';
import { TicketReplyFormData } from '../../api/ticketApi';

interface TicketReplyFormProps {
  onSubmit: (data: TicketReplyFormData) => Promise<void>;
  isSubmitting: boolean;
}

const TicketReplyForm = ({ onSubmit, isSubmitting }: TicketReplyFormProps) => {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TicketReplyFormData>();

  const onFormSubmit = async (data: TicketReplyFormData) => {
    try {
      await onSubmit({
        ...data,
      });
      
      reset();
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="mt-6">
      <div>
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea
          id="message"
          rows={3}
          {...register('message', { required: 'Message is required' })}
          placeholder="Type your reply..."
          className="form-input"
        />
        {errors.message && (
          <p className="form-error">{errors.message.message}</p>
        )}
      </div>

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reply'}
        </button>
      </div>
    </form>
  );
};

export default TicketReplyForm;