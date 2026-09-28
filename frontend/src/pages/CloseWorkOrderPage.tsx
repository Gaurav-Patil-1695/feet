import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import CloseWorkOrderForm from '../components/workOrders/CloseWorkOrderForm';
import { workOrderService } from '../services/workOrderService';
import type { WorkOrder } from '../types/workOrder';

type LoadState = 'idle' | 'loading' | 'not-found' | 'error' | 'loaded';

const CloseWorkOrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoadState('loading');
      try {
        const data = await workOrderService.getWorkOrder(Number(id));
        if (cancelled) return;
        setWorkOrder(data);
        setLoadState('loaded');
      } catch (err: unknown) {
        if (cancelled) return;
        const status = (err as { status?: number })?.status;
        if (status === 404) {
          setLoadState('not-found');
        } else {
          setLoadState('error');
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSuccess = () => {
    navigate(`/work-orders/${id}`, {
      state: { toast: 'Work order closed. Service schedule has been reset.' },
    });
  };

  const handleCancel = () => {
    navigate(`/work-orders/${id}`);
  };

  if (loadState === 'idle' || loadState === 'loading') {
    return (
      <AppLayout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
          }}
        >
          <Spinner />
        </div>
      </AppLayout>
    );
  }

  if (loadState === 'not-found') {
    return (
      <AppLayout>
        <div
          style={{
            padding: 'var(--space-6)',
            maxWidth: '800px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 'var(--font-size-xl)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-ink)',
              marginBottom: 'var(--space-4)',
            }}
          >
            Work order not found
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-muted)',
              marginBottom: 'var(--space-6)',
            }}
          >
            The work order you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/work-orders"
            style={{
              color: 'var(--color-primary)',
              fontWeight: 'var(--font-weight-medium)',
              textDecoration: 'none',
            }}
          >
            Back to Work Orders
          </Link>
        </div>
      </AppLayout>
    );
  }

  if (loadState === 'error') {
    return (
      <AppLayout>
        <div
          style={{
            padding: 'var(--space-6)',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <Alert variant="error">
            Unable to load work order details — please try again.
          </Alert>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Link
              to="/work-orders"
              style={{
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-sm)',
                textDecoration: 'none',
              }}
            >
              Back to Work Orders
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!workOrder) return null;

  const isAlreadyClosed =
    workOrder.status === 'closed' || workOrder.status === 'cancelled';

  return (
    <AppLayout>
      <div
        style={{
          padding: 'var(--space-6)',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Breadcrumb */}
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
            }}
          >
            Work orders
          </button>
          <span
            style={{
              color: 'var(--color-muted)',
              fontSize: 'var(--font-size-sm)',
            }}
          >
            /
          </span>
          <button
            onClick={() => navigate(`/work-orders/${workOrder.id}`)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-muted)',
            }}
          >
            #{workOrder.id}
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
            Close
          </span>
        </div>

        <div style={{ marginBottom: 'var(--space-6)' }}>
          <PageHeading>Close Work Order</PageHeading>
        </div>

        {isAlreadyClosed ? (
          <div
            style={{
              width: '100%',
              background: 'var(--color-warning-light)',
              border: '1px solid var(--color-warning)',
              borderRadius: 'var(--radius-sm)',
              padding: 'var(--space-4) var(--space-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 'var(--space-4)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-body)',
                margin: 0,
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              This work order is already closed and cannot be modified.
            </p>
            <Link
              to={`/work-orders/${workOrder.id}`}
              style={{
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              View work order
            </Link>
          </div>
        ) : (
          <CloseWorkOrderForm
            workOrderId={workOrder.id}
            currentOdometerKm={
              (workOrder as WorkOrder & { current_odometer_km?: number })
                .current_odometer_km
            }
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default CloseWorkOrderPage;
