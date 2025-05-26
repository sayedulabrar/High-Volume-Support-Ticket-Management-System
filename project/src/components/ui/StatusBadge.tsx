import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: 'open' | 'in progress' | 'resolved' | 'closed';
  className?: string;
}

const statusClasses = {
  'open': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'in progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'resolved': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'closed': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        statusClasses[status],
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;