import React from 'react';
import { WorkOrder } from '../../types/workOrder';
import Card from '../ui/Card';
import WorkOrderStatusBadge from './WorkOrderStatusBadge';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onClick?: (workOrder: WorkOrder) => void;
  className?: string;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({
  workOrder,
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick(workOrder);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(workOrder);
    }
  };

  const isClickable = !!onClick;

  return (
    <Card
      className={[
        'work-order-card',
        isClickable ? 'work-order-card--clickable' : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={isClickable ? handleClick : undefined}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      tabIndex={isClickable ? 0 : undefined}
      role={isClickable ? 'button' : undefined}
      aria-label={
        isClickable
          ? `View work order ${workOrder.id} for vehicle ${workOrder.vehicle?.registration_number ?? workOrder.vehicle_id}`
          : undefined
      }
    >
      <div className="work-order-card__header">
        <span className="work-order-card__id">WO #{workOrder.id}</span>
        <WorkOrderStatusBadge
          status={workOrder.status}
          className="work-order-card__status"
        />
      </div>

      <div className="work-order-card__body">
        <div className="work-order-card__vehicle">
          <span className="work-order-card__label">Vehicle</span>
          <span className="work-order-card__value">
            {workOrder.vehicle
              ? `${workOrder.vehicle.registration_number} — ${workOrder.vehicle.make} ${workOrder.vehicle.model}`
              : `Vehicle ID: ${workOrder.vehicle_id}`}
          </span>
        </div>

        {workOrder.assigned_technician && (
          <div className="work-order-card__technician">
            <span className="work-order-card__label">Technician</span>
            <span className="work-order-card__value">
              {workOrder.assigned_technician.full_name}
            </span>
          </div>
        )}

        {!workOrder.assigned_technician && (
          <div className="work-order-card__technician">
            <span className="work-order-card__label">Technician</span>
            <span className="work-order-card__value work-order-card__value--unassigned">
              Unassigned
            </span>
          </div>
        )}

        {workOrder.description && (
          <div className="work-order-card__description">
            <span className="work-order-card__label">Description</span>
            <span className="work-order-card__value work-order-card__value--description">
              {workOrder.description}
            </span>
          </div>
        )}
      </div>

      <div className="work-order-card__footer">
        <div className="work-order-card__dates">
          {workOrder.opened_at && (
            <span className="work-order-card__date">
              <span className="work-order-card__label">Opened</span>{' '}
              <span className="work-order-card__value">
                {new Date(workOrder.opened_at).toLocaleDateString()}
              </span>
            </span>
          )}
          {workOrder.closed_at && (
            <span className="work-order-card__date">
              <span className="work-order-card__label">Closed</span>{' '}
              <span className="work-order-card__value">
                {new Date(workOrder.closed_at).toLocaleDateString()}
              </span>
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WorkOrderCard;
