import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Table from '../components/ui/Table';
import VehicleStatusBadge from '../components/vehicles/VehicleStatusBadge';
import WorkOrderStatusBadge from '../components/workOrders/WorkOrderStatusBadge';
import { useAuth } from '../hooks/useAuth';
import { vehicleService } from '../services/vehicleService';
import { workOrderService } from '../services/workOrderService';
import { dashboardService } from '../services/dashboardService';
import type { Vehicle } from '../types/vehicle';
import type { WorkOrder } from '../types/workOrder';

interface ServiceDue {
  vehicle_id: number;
  next_service_due_date: string | null;
  next_service_due_odometer_km: number | null;
  km_until_service: number | null;
  days_until_service: number | null;
  is_overdue: boolean;
}

type LoadState = 'idle' | 'loading' | 'not-found' | 'error' | 'loaded';

const VehicleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [serviceDue, setServiceDue] = useState<ServiceDue | null>(null);
  const [workOrdersError, setWorkOrdersError] = useState(false);
  const [serviceDueError, setServiceDueError] = useState(false);

  const isTechnician = user?.role === 'technician';

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const loadAll = async () => {
      setLoadState('loading');
      try {
        const vehicleData = await vehicleService.getVehicle(Number(id));
        if (cancelled) return;
        setVehicle(vehicleData);

        const [woResult, sdResult] = await Promise.allSettled([
          workOrderService.getWorkOrders({ vehicle_id: Number(id) }),
          dashboardService.getServiceDue(Number(id)),
        ]);

        if (cancelled) return;

        if (woResult.status === 'fulfilled') {
          setWorkOrders(Array.isArray(woResult.value) ? woResult.value : (woResult.value as { items?: WorkOrder[] }).items ?? []);
          setWorkOrdersError(false);
        } else {
          setWorkOrdersError(true);
        }

        if (sdResult.status === 'fulfilled') {
          setServiceDue(sdResult.value as ServiceDue);
          setServiceDueError(false);
        } else {
          setServiceDueError(true);
        }

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

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const workOrderColumns = [
    {
      key: 'id',
      header: 'ID',
      render: (wo: WorkOrder) => (
        <Link
          to={`/work-orders/${wo.id}`}
          style={{
            color: 'var(--color-primary)',
            fontWeight: 'var(--font-weight-medium)',
            textDecoration: 'none',
          }}
        >
          #{wo.id}
        </Link>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (wo: WorkOrder) => wo.description ?? '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (wo: WorkOrder) => <WorkOrderStatusBadge status={wo.status} />,
    },
    {
      key: 'opened_at',
      header: 'Opened',
      render: (wo: WorkOrder) =>
        wo.opened_at
          ? new Date(wo.opened_at).toLocaleDateString()
          : '—',
    },
    {
      key: 'assigned_to_name',
      header: 'Assigned To',
      render: (wo: WorkOrder) => (wo as WorkOrder & { assigned_to_name?: string }).assigned_to_name ?? '—',
    },
  ];

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
            Vehicle not found
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-muted)',
              marginBottom: 'var(--space-6)',
            }}
          >
            The vehicle you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/vehicles"
            style={{
              color: 'var(--color-primary)',
              fontWeight: 'var(--font-weight-medium)',
              textDecoration: 'none',
            }}
          >
            Back to Vehicles
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
            Unable to load vehicle details — please try again.
          </Alert>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <Link
              to="/vehicles"
              style={{
                color: 'var(--color-primary)',
                fontSize: 'var(--font-size-sm)',
                textDecoration: 'none',
              }}
            >
              Back to Vehicles
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!vehicle) return null;

  const hasServiceSchedule =
    serviceDue !== null &&
    (serviceDue.next_service_due_date !== null ||
      serviceDue.next_service_due_odometer_km !== null);

  return (
    <AppLayout>
      <div
        style={{
          padding: 'var(--space-6)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Header row */}
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
                onClick={() => navigate('/vehicles')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-muted)',
                  textDecoration: 'none',
                }}
              >
                Vehicle list
              </button>
              <span style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)' }}>{'/'}</span>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)' }}>
                {vehicle.registration_number}
              </span>
            </div>
            <PageHeading>{vehicle.registration_number}</PageHeading>
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {!isTechnician && (
              <Button
                variant="ghost"
                onClick={() => navigate(`/vehicles/${vehicle.id}/edit`)}
              >
                ✏️ Edit Vehicle
              </Button>
            )}
            <Button
              variant="primary"
              onClick={() => navigate(`/vehicles/${vehicle.id}/odometer/new`)}
            >
              Record Odometer
            </Button>
            {!isTechnician && (
              <Button
                variant="secondary"
                onClick={() => navigate(`/work-orders/new?vehicle=${vehicle.id}`)}
              >
                + Create Work Order
              </Button>
            )}
          </div>
        </div>

        {/* Main grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {/* Vehicle Details Card */}
          <Card>
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
                  color: 'var(--color-ink)',
                  margin: 0,
                }}
              >
                Vehicle Details
              </h2>
              <VehicleStatusBadge status={vehicle.status} />
            </div>

            <dl
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-4) var(--space-6)',
                margin: 0,
              }}
            >
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
                  Registration
                </dt>
                <dd
                  style={{
                    fontSize: 'var(--font-size-md)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-body)',
                    margin: 0,
                    fontFamily: 'var(--font-family-mono)',
                  }}
                >
                  {vehicle.registration_number}
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
                  Type
                </dt>
                <dd
                  style={{
                    fontSize: 'var(--font-size-md)',
                    color: 'var(--color-body)',
                    margin: 0,
                  }}
                >
                  {(vehicle as Vehicle & { vehicle_type_name?: string }).vehicle_type_name ?? '—'}
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
                  Make
                </dt>
                <dd
                  style={{
                    fontSize: 'var(--font-size-md)',
                    color: 'var(--color-body)',
                    margin: 0,
                  }}
                >
                  {vehicle.make ?? '—'}
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
                  Model
                </dt>
                <dd
                  style={{
                    fontSize: 'var(--font-size-md)',
                    color: 'var(--color-body)',
                    margin: 0,
                  }}
                >
                  {vehicle.model ?? '—'}
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
                  Year
                </dt>
                <dd
                  style={{
                    fontSize: 'var(--font-size-md)',
                    color: 'var(--color-body)',
                    margin: 0,
                  }}
                >
                  {vehicle.year ?? '—'}
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
                  Depot
                </dt>
                <dd
                  style={{
                    fontSize: 'var(--font-size-md)',
                    color: 'var(--color-body)',
                    margin: 0,
                  }}
                >
                  {(vehicle as Vehicle & { depot_name?: string }).depot_name ?? '—'}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Odometer & Service Clock Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Latest Odometer Card */}
            <Card>
              <h2
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-ink)',
                  margin: '0 0 var(--space-4) 0',
                }}
              >
                Latest Odometer
              </h2>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 'var(--space-2)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-ink)',
                    fontFamily: 'var(--font-family-mono)',
                  }}
                >
                  {vehicle.current_odometer_km != null
                    ? vehicle.current_odometer_km.toLocaleString()
                    : '—'}
                </span>
                {vehicle.current_odometer_km != null && (
                  <span
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-muted)',
                    }}
                  >
                    km
                  </span>
                )}
              </div>
              {vehicle.last_odometer_reading_at && (
                <p
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--color-muted)',
                    margin: 0,
                  }}
                >
                  Last recorded:{' '}
                  {new Date(vehicle.last_odometer_reading_at).toLocaleString()}
                </p>
              )}
              <div style={{ marginTop: 'var(--space-4)' }}>
                <Button
                  variant="ghost"
                  onClick={() => navigate(`/vehicles/${vehicle.id}/odometer/new`)}
                >
                  + Record Reading
                </Button>
              </div>
            </Card>

            {/* Service Clock Card */}
            <Card>
              <h2
                style={{
                  fontSize: 'var(--font-size-lg)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-ink)',
                  margin: '0 0 var(--space-4) 0',
                }}
              >
                Service Schedule
              </h2>

              {serviceDueError ? (
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-error)',
                    margin: 0,
                  }}
                >
                  Unable to load service schedule.
                </p>
              ) : !hasServiceSchedule ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-3)',
                    background: 'var(--color-warning-light)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <span style={{ fontSize: 'var(--font-size-lg)' }}>⚠️</span>
                  <p
                    style={{
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-body)',
                      margin: 0,
                    }}
                  >
                    Service schedule not yet calculated
                  </p>
                </div>
              ) : (
                <dl
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-4) var(--space-6)',
                    margin: 0,
                  }}
                >
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
                      Next Service Date
                    </dt>
                    <dd
                      style={{
                        fontSize: 'var(--font-size-md)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: serviceDue?.is_overdue
                          ? 'var(--color-error)'
                          : 'var(--color-body)',
                        margin: 0,
                      }}
                    >
                      {serviceDue?.next_service_due_date
                        ? new Date(serviceDue.next_service_due_date).toLocaleDateString()
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
                      Next Service (km)
                    </dt>
                    <dd
                      style={{
                        fontSize: 'var(--font-size-md)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: serviceDue?.is_overdue
                          ? 'var(--color-error)'
                          : 'var(--color-body)',
                        margin: 0,
                        fontFamily: 'var(--font-family-mono)',
                      }}
                    >
                      {serviceDue?.next_service_due_odometer_km != null
                        ? serviceDue.next_service_due_odometer_km.toLocaleString()
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
                      km Until Service
                    </dt>
                    <dd
                      style={{
                        fontSize: 'var(--font-size-md)',
                        color: 'var(--color-body)',
                        margin: 0,
                        fontFamily: 'var(--font-family-mono)',
                      }}
                    >
                      {serviceDue?.km_until_service != null
                        ? serviceDue.km_until_service.toLocaleString()
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
                      Days Until Service
                    </dt>
                    <dd
                      style={{
                        fontSize: 'var(--font-size-md)',
                        color: 'var(--color-body)',
                        margin: 0,
                      }}
                    >
                      {serviceDue?.days_until_service != null
                        ? serviceDue.days_until_service
                        : '—'}
                    </dd>
                  </div>

                  {serviceDue?.is_overdue && (
                    <div style={{ gridColumn: '1 / -1' }}>
                      <Badge variant="error">Overdue</Badge>
                    </div>
                  )}
                </dl>
              )}
            </Card>
          </div>
        </div>

        {/* Work Orders Section */}
        <section>
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
                color: 'var(--color-ink)',
                margin: 0,
              }}
            >
              Work Orders
            </h2>
            {!isTechnician && (
              <Button
                variant="primary"
                onClick={() => navigate(`/work-orders/new?vehicle=${vehicle.id}`)}
              >
                + Create Work Order
              </Button>
            )}
          </div>

          {workOrdersError ? (
            <Alert variant="error">
              Unable to load work orders for this vehicle.
            </Alert>
          ) : workOrders.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: 'var(--space-10) 0',
                color: 'var(--color-muted)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              No work orders linked to this vehicle.
            </div>
          ) : (
            <Table
              columns={workOrderColumns}
              data={workOrders}
              rowKey={(wo) => String(wo.id)}
            />
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default VehicleDetailPage;
