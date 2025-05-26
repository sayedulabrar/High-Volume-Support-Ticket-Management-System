import { cn } from '../../utils/cn';

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
  className?: string;
}

const priorityClasses = {
  'low': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'high': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const PriorityBadge = ({ priority, className }: PriorityBadgeProps) => {
  return (
    <span 
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
        priorityClasses[priority],
        className
      )}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;