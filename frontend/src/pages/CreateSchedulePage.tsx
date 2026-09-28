import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import ScheduleForm from '../components/schedules/ScheduleForm';

const CreateSchedulePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (scheduleId: number) => {
    navigate(`/schedules/${scheduleId}`, {
      state: { toast: 'Schedule created successfully.' },
    });
  };

  const handleCancel = () => {
    navigate('/schedules');
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
          <button
            onClick={() => navigate('/schedules')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-muted)',
              marginBottom: 'var(--space-2)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-1)',
            }}
          >
            ← Schedule list
          </button>
          <PageHeading>Create schedule</PageHeading>
        </div>

        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-muted)',
            letterSpacing: 'var(--font-letter-spacing-wider)',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-4)',
            marginTop: 0,
          }}
        >
          Schedule details
        </p>

        <ScheduleForm
          mode="create"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </AppLayout>
  );
};

export default CreateSchedulePage;
