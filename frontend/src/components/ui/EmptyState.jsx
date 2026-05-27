/**
 * EmptyState — friendly placeholder when no data exists.
 */
import Button from './Button';

const EmptyState = ({ icon: Icon, title, description, action, actionLabel }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    {Icon && (
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Icon size={24} className="text-slate-400" />
      </div>
    )}
    <h3 className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
    {description && <p className="text-sm text-slate-400 mb-4 max-w-xs">{description}</p>}
    {action && <Button onClick={action} size="sm">{actionLabel}</Button>}
  </div>
);

export default EmptyState;
