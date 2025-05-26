import { useForm } from 'react-hook-form';
import { TicketFormData } from '../../api/ticketApi';

interface TicketFormProps {
  onSubmit: (data: TicketFormData) => Promise<void>;
  isSubmitting: boolean;
}

const TicketForm = ({ onSubmit, isSubmitting }: TicketFormProps) => {
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TicketFormData>();



  const onFormSubmit = async (data: TicketFormData) => {
    try {
      await onSubmit({
        ...data,
      });
      
      reset();
    } catch (error) {
      console.error('Error submitting ticket:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div>
        <label htmlFor="subject" className="form-label">
          Subject
        </label>
        <input
          id="subject"
          type="text"
          {...register('subject', { required: 'Subject is required' })}
          className="form-input"
        />
        {errors.subject && (
          <p className="form-error">{errors.subject.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <select
            id="category"
            {...register('category', { required: 'Category is required' })}
            className="form-input"
          >
            <option value="">Select a category</option>
            <option value="technical">Technical Support</option>
            <option value="billing">Billing</option>
            <option value="account">Account</option>
            <option value="general">General Inquiry</option>
          </select>
          {errors.category && (
            <p className="form-error">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="priority" className="form-label">
            Priority
          </label>
          <select
            id="priority"
            {...register('priority', { required: 'Priority is required' })}
            className="form-input"
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && (
            <p className="form-error">{errors.priority.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          rows={5}
          {...register('description', { required: 'Description is required' })}
          className="form-input"
        />
        {errors.description && (
          <p className="form-error">{errors.description.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </div>
    </form>
  );
};

export default TicketForm;