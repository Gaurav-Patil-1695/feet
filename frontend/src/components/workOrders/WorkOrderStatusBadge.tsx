import React from 'react';
import Badge from '../ui/Badge';

interface WorkOrderStatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'neutral'; icon: string }
> = {
  open: {
    label: 'Open',
    variant: 'warning',
    icon: '🔧',
  },
  closed: {
    label: 'Closed',
    variant: 'success',
    icon: '✅',
  },
};

const WorkOrderStatusBadge: React.FC<WorkOrderStatusBadgeProps> = ({
  status,
  className,
}) => {
  const config = statusConfig[status.toLowerCase()] ?? {
    label: status,
    variant: 'neutral' as const,
    icon: '❓',
  };

  return (
    <Badge
      variant={config.variant}
      className={className}
      aria-label={`Work order status: ${config.label}`}
    >
      <span className="work-order-status-badge__icon" aria-hidden="true">
        {config.icon}
      </span>
      <span className="work-order-status-badge__label">{config.label}</span>
    </Badge>
  );
};

export default WorkOrderStatusBadge;
