import React from 'react';
import Badge from '../ui/Badge';
import type { Vehicle } from '../../types/vehicle';

type ServiceStatus = 'ok' | 'due' | 'overdue';

interface VehicleStatusBadgeProps {
  status: ServiceStatus;
}

const STATUS_CONFIG: Record<
  ServiceStatus,
  { label: string; variant: 'success' | 'warning' | 'error'; icon: string }
> = {
  ok: {
    label: 'OK',
    variant: 'success',
    icon: '✓',
  },
  due: {
    label: 'Service Due',
    variant: 'warning',
    icon: '⚠',
  },
  overdue: {
    label: 'Overdue',
    variant: 'error',
    icon: '✕',
  },
};

const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status];

  return (
    <Badge variant={config.variant}>
      <span className="inline-flex items-center gap-1">
        <span aria-hidden="true">{config.icon}</span>
        <span>{config.label}</span>
      </span>
    </Badge>
  );
};

export type { ServiceStatus };
export default VehicleStatusBadge;
