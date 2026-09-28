import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import WorkOrderForm from '../components/workOrders/WorkOrderForm';

const CreateWorkOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const vehicleParam = searchParams.get('vehicle');
  const preselectedVehicleId = vehicleParam ? Number(vehicleParam) : undefined;

  const handleSuccess = (workOrderId: number) => {
    navigate(`/work-orders/${workOrderId}`, {
      state: { toast: 'Work order created successfully.' },
    });
  };

  const handleCancel = () => {
    if (preselectedVehicleId) {
      navigate(`/vehicles/${preselectedVehicleId}`);
    } else {
      navigate('/work-orders');
    }
  };

  return (
    <AppLayout>
      <div
        style={{
          padding: 'var(--space-6)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginBottom: 'var(--space-2)',
            }}
          >
            <button
              onClick={() => navigate('/work-orders')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
              }}
            >
              Work Orders
            </button>
            <span
              style={{
                color: 'var(--color-muted)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              /
            </span>
            <span
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-body)',
              }}
            >
              Create Work Order
            </span>
          </div>

          <PageHeading>Create Work Order</PageHeading>

          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-muted)',
              letterSpacing: 'var(--font-letter-spacing-wider)',
              textTransform: 'uppercase',
              marginTop: 'var(--space-4)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Vehicle details
          </p>
        </div>

        <WorkOrderForm
          preselectedVehicleId={preselectedVehicleId}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </AppLayout>
  );
};

export default CreateWorkOrderPage;
