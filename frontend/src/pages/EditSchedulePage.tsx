import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import ScheduleForm from '../components/schedules/ScheduleForm';
import { scheduleService } from '../services/scheduleService';
import type { Schedule } from '../types/schedule';

type LoadState = 'idle' | 'loading' | 'not-found' | 'error' | 'loaded';

const EditSchedulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [schedule, setSchedule] = useState<Schedule | null>(null);

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

  const handleSuccess = (scheduleId: number) => {
    navigate(`/schedules/${scheduleId}`, {
      state: { toast: 'Schedule updated' },
    });
  };

  const handleCancel = () => {
    navigate(`/schedules/${id}`);
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
          }}
        >
          <Alert variant="error">
            Schedule not found
          </Alert>
          <div
            style={{
              marginTop: 'var(--space-4)',
              display: 'flex',
              gap: 'var(--space-4)',
            }}
          >
            <button
              onClick={() => navigate(`/schedules/${id}`)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-primary)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Back to Schedule
            </button>
            <span style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)' }}>|</span>
            <button
              onClick={() => navigate('/schedules')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-primary)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Back to Schedules
            </button>
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
          <Alert variant="error">
            Unable to load schedule details — please try again
          </Alert>
          <div
            style={{
              marginTop: 'var(--space-4)',
              display: 'flex',
              gap: 'var(--space-4)',
            }}
          >
            <button
              onClick={() => {
                setLoadState('idle');
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-primary)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Retry
            </button>
            <span style={{ color: 'var(--color-muted)', fontSize: 'var(--font-size-sm)' }}>|</span>
            <button
              onClick={() => navigate('/schedules')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-primary)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              Back to Schedules
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!schedule) return null;

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
              Schedule list
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
              onClick={() => navigate(`/schedules/${schedule.id}`)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-muted)',
              }}
            >
              Schedule #{schedule.id}
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
              Edit
            </span>
          </div>

          <PageHeading>Edit Schedule</PageHeading>

          <h2
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-body)',
              marginBottom: 'var(--space-1)',
              marginTop: 'var(--space-2)',
            }}
          >
            Service schedule details
          </h2>
        </div>

        <ScheduleForm
          mode="edit"
          initialData={schedule}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </AppLayout>
  );
};

export default EditSchedulePage;
