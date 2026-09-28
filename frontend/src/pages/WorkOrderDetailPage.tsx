import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import Card from '../components/ui/Card';
import WorkOrderStatusBadge from '../components/workOrders/WorkOrderStatusBadge';
import { useAuth } from '../hooks/useAuth';
import { workOrderService } from '../services/workOrderService';
import type { WorkOrder } from '../types/workOrder';

type LoadState = 'idle' | 'loading' | 'not-found' | 'error' | 'loaded';

const WorkOrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);

  const isTechnician = user?.role === 'technician';
  const isClosed =
    workOrder?.status === 'closed' || workOrder?.status === 'cancelled';

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

  const wo = workOrder as WorkOrder & {
    vehicle_registration?: string;
    vehicle_id?: number;
    assigned_to_name?: string;
    depot_name?: string;
    completion_notes?: string;
    post_service_odometer_km?: number | null;
    closed_at?: string | null;
  };

  return (
    <AppLayout>
      <div
        style={{
          padding: 'var(--space-6)',
          maxWidth: '1000px',
          margin: '0 auto',
        }}
      >
        {/* Breadcrumb + Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                marginBottom: 'var(--space-1)',
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
                #{wo.id}
              </span>
            </div>
            <PageHeading>Work Order #{wo.id}</PageHeading>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 'var(--space-3)',
              flexWrap: 'wrap',
              alignItems: 'center',
            }}
          >
            {!isClosed && !isTechnician && (
              <Button
                variant="ghost"
                onClick={() =>
                  navigate(`/work-orders/${wo.id}/close`)
                }
              >
                ✓ Close Work Order
              </Button>
            )}
            {!isClosed && !isTechnician && (
              <Button
                variant="secondary"
                onClick={() =>
                  navigate(`/work-orders/${wo.id}/close`)
                }
              >
                Edit / Reassign
              </Button>
            )}
          </div>
        </div>

        {/* Main detail card */}
        <Card style={{ marginBottom: 'var(--space-6)' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-4)',
            }}
          >
            <h2
              style={{
                fontSize: 'var(--font-size-lg)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-body)',
                margin: 0,
              }}
            >
              Work Order Details
            </h2>
            <WorkOrderStatusBadge status={wo.status} />
          </div>

          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-4) var(--space-6)',
              margin: 0,
            }}
          >
            {/* Vehicle */}
            <div>
              <dt
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--font-letter-spacing-wider)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Vehicle
              </dt>
              <dd
                style={{
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--color-body)',
                  margin: 0,
                }}
              >
                {wo.vehicle_id ? (
                  <Link
                    to={`/vehicles/${wo.vehicle_id}`}
                    style={{
                      color: 'var(--color-primary)',
                      fontWeight: 'var(--font-weight-medium)',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-family-mono)',
                    }}
                  >
                    {wo.vehicle_registration ?? `#${wo.vehicle_id}`}
                  </Link>
                ) : (
                  '—'
                )}
              </dd>
            </div>

            {/* Depot */}
            <div>
              <dt
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--font-letter-spacing-wider)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Depot
              </dt>
              <dd
                style={{
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--color-body)',
                  margin: 0,
                }}
              >
                {wo.depot_name ?? '—'}
              </dd>
            </div>

            {/* Assigned To */}
            <div>
              <dt
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--font-letter-spacing-wider)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Assigned To
              </dt>
              <dd
                style={{
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--color-body)',
                  margin: 0,
                }}
              >
                {wo.assigned_to_name ?? '—'}
              </dd>
            </div>

            {/* Opened At */}
            <div>
              <dt
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--font-letter-spacing-wider)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Opened At
              </dt>
              <dd
                style={{
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--color-body)',
                  margin: 0,
                }}
              >
                {wo.opened_at
                  ? new Date(wo.opened_at).toLocaleString()
                  : '—'}
              </dd>
            </div>

            {/* Description — full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <dt
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--font-letter-spacing-wider)',
                  marginBottom: 'var(--space-1)',
                }}
              >
                Description
              </dt>
              <dd
                style={{
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--color-body)',
                  margin: 0,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {wo.description ?? '—'}
              </dd>
            </div>

            {/* Closed state fields */}
            {isClosed && (
              <>
                <div style={{ gridColumn: '1 / -1' }}>
                  <dt
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--font-letter-spacing-wider)',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    Completion Notes
                  </dt>
                  <dd
                    style={{
                      fontSize: 'var(--font-size-md)',
                      color: 'var(--color-body)',
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {wo.completion_notes ?? '—'}
                  </dd>
                </div>

                <div>
                  <dt
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--font-letter-spacing-wider)',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    Post-Service Odometer (km)
                  </dt>
                  <dd
                    style={{
                      fontSize: 'var(--font-size-md)',
                      color: 'var(--color-body)',
                      margin: 0,
                      fontFamily: 'var(--font-family-mono)',
                    }}
                  >
                    {wo.post_service_odometer_km != null
                      ? wo.post_service_odometer_km.toLocaleString()
                      : '—'}
                  </dd>
                </div>

                <div>
                  <dt
                    style={{
                      fontSize: 'var(--font-size-xs)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: 'var(--font-letter-spacing-wider)',
                      marginBottom: 'var(--space-1)',
                    }}
                  >
                    Closed At
                  </dt>
                  <dd
                    style={{
                      fontSize: 'var(--font-size-md)',
                      color: 'var(--color-body)',
                      margin: 0,
                    }}
                  >
                    {wo.closed_at
                      ? new Date(wo.closed_at).toLocaleString()
                      : '—'}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </Card>

        {/* Action footer links */}
        <div
          style={{
            display: 'flex',
            gap: 'var(--space-4)',
            alignItems: 'center',
            flexWrap: 'wrap',
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
            ← Back to Work Orders
          </button>

          {wo.vehicle_id && (
            <Link
              to={`/vehicles/${wo.vehicle_id}`}
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-primary)',
                textDecoration: 'none',
              }}
            >
              View Vehicle
            </Link>
          )}

          {!isClosed && !isTechnician && (
            <Button
              variant="primary"
              onClick={() => navigate(`/work-orders/${wo.id}/close`)}
            >
              ✓ Close Work Order
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default WorkOrderDetailPage;
