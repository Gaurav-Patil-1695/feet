import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { scheduleService } from '../services/scheduleService';
import { useAuth } from '../hooks/useAuth';
import type { Schedule } from '../types/schedule';

type LoadState = 'idle' | 'loading' | 'not-found' | 'error' | 'loaded';

const ScheduleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [schedule, setSchedule] = useState<Schedule | null>(null);

  const isTechnician = user?.role === 'technician';

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoadState('loading');
      try {
        const data = await scheduleService.getSchedule(Number(id));
        if (cancelled) return;
        setSchedule(data);
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
            padding: 'var(--space-6)',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {/* Page title shimmer */}
          <div
            style={{
              height: '32px',
              width: '260px',
              background: 'var(--color-surface-raised)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--space-6)',
            }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
            }}
          >
            {/* Vehicle type badge shimmer */}
            <div
              style={{
                height: '24px',
                width: '140px',
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-full)',
              }}
            />
            {/* km interval shimmer */}
            <div
              style={{
                height: '20px',
                width: '200px',
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
            {/* month interval shimmer */}
            <div
              style={{
                height: '20px',
                width: '180px',
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
            {/* effective-from shimmer */}
            <div
              style={{
                height: '20px',
                width: '220px',
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
            {/* effective-to shimmer */}
            <div
              style={{
                height: '20px',
                width: '220px',
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
            {/* Edit Schedule button shimmer */}
            <div
              style={{
                height: '40px',
                width: '140px',
                background: 'var(--color-surface-raised)',
                borderRadius: 'var(--radius-sm)',
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px',
            }}
          >
            <Spinner />
          </div>
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
          }}
        >
          <div
            style={{
              background: 'var(--color-error)',
              color: 'var(--color-on-error)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4) var(--space-6)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 'var(--font-weight-semibold)',
                margin: '0 0 var(--space-2) 0',
              }}
            >
              Schedule not found
            </p>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--color-on-error)',
                  textDecoration: 'underline',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Retry
              </button>
              <Link
                to="/schedules"
                style={{
                  color: 'var(--color-on-error)',
                  textDecoration: 'underline',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Back to Schedules
              </Link>
            </div>
          </div>
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
          <div
            style={{
              background: 'var(--color-error)',
              color: 'var(--color-on-error)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4) var(--space-6)',
              marginBottom: 'var(--space-4)',
            }}
          >
            <p
              style={{
                fontSize: 'var(--font-size-md)',
                fontWeight: 'var(--font-weight-semibold)',
                margin: '0 0 var(--space-2) 0',
              }}
            >
              Unable to load schedule details — please try again
            </p>
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                fontSize: 'var(--font-size-sm)',
              }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: 'var(--color-on-error)',
                  textDecoration: 'underline',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Retry
              </button>
              <Link
                to="/schedules"
                style={{
                  color: 'var(--color-on-error)',
                  textDecoration: 'underline',
                  fontSize: 'var(--font-size-sm)',
                }}
              >
                Back to Schedules
              </Link>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!schedule) return null;

  const vehicleTypeName =
    (schedule as Schedule & { vehicle_type_name?: string }).vehicle_type_name ?? null;

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
            onClick={() => navigate('/schedules')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-muted)',
            }}
          >
            Schedules
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
            Schedule #{schedule.id}
          </span>
        </div>

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
            <p
              style={{
                fontSize: 'var(--font-size-xs)',
                color: 'var(--color-muted)',
                fontFamily: 'var(--font-family-mono)',
                letterSpacing: 'var(--font-letter-spacing-wide)',
                margin: '0 0 var(--space-1) 0',
                textTransform: 'uppercase',
              }}
            >
              SCHEDULE DETAIL
            </p>
            <PageHeading>Schedule #{schedule.id}</PageHeading>
          </div>

          {!isTechnician && (
            <Button
              variant="primary"
              onClick={() => navigate(`/schedules/${schedule.id}/edit`)}
              style={{
                background: 'var(--color-primary-dark)',
                color: 'var(--color-on-primary-dark)',
              }}
            >
              Edit Schedule
            </Button>
          )}
        </div>

        {/* Schedule Details Card */}
        <Card>
          <h2
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-ink)',
              margin: '0 0 var(--space-6) 0',
            }}
          >
            Schedule Details
          </h2>

          {/* Vehicle Type Badge */}
          {vehicleTypeName && (
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <p
                style={{
                  fontSize: 'var(--font-size-xs)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--font-letter-spacing-wider)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                Vehicle Type
              </p>
              <Badge variant="info">{vehicleTypeName}</Badge>
            </div>
          )}

          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--space-6)',
              margin: 0,
            }}
          >
            {/* Vehicle Type ID (if name not available) */}
            {!vehicleTypeName && (
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
                  Vehicle Type
                </dt>
                <dd
                  style={{
                    fontSize: 'var(--font-size-md)',
                    color: 'var(--color-body)',
                    margin: 0,
                  }}
                >
                  {schedule.vehicle_type_id != null ? `Type #${schedule.vehicle_type_id}` : '—'}
                </dd>
              </div>
            )}

            {/* KM Interval */}
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
                KM Interval
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
                {schedule.interval_km != null
                  ? `${schedule.interval_km.toLocaleString()} km`
                  : '—'}
              </dd>
            </div>

            {/* Month Interval */}
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
                Month Interval
              </dt>
              <dd
                style={{
                  fontSize: 'var(--font-size-md)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-body)',
                  margin: 0,
                }}
              >
                {schedule.interval_months != null
                  ? `${schedule.interval_months} month${schedule.interval_months !== 1 ? 's' : ''}`
                  : '—'}
              </dd>
            </div>

            {/* Effective From */}
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
                Effective From
              </dt>
              <dd
                style={{
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--color-body)',
                  margin: 0,
                }}
              >
                {schedule.effective_from
                  ? new Date(schedule.effective_from).toLocaleDateString()
                  : '—'}
              </dd>
            </div>

            {/* Effective To */}
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
                Effective To
              </dt>
              <dd
                style={{
                  fontSize: 'var(--font-size-md)',
                  color: 'var(--color-body)',
                  margin: 0,
                }}
              >
                {(schedule as Schedule & { effective_to?: string | null }).effective_to
                  ? new Date(
                      (schedule as Schedule & { effective_to?: string | null }).effective_to!
                    ).toLocaleDateString()
                  : '—'}
              </dd>
            </div>
          </dl>
        </Card>

        {/* Actions footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 'var(--space-6)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
          }}
        >
          <button
            onClick={() => navigate('/schedules')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-muted)',
            }}
          >
            ← Back to Schedules
          </button>

          {!isTechnician && (
            <Button
              variant="ghost"
              onClick={() => navigate(`/schedules/${schedule.id}/edit`)}
            >
              ✏️ Edit Schedule
            </Button>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ScheduleDetailPage;
