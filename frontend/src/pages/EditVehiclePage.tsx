import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import VehicleForm from '../components/vehicles/VehicleForm';
import { vehicleService } from '../services/vehicleService';
import type { Vehicle } from '../types/vehicle';

type LoadState = 'idle' | 'loading' | 'not-found' | 'error' | 'loaded';

const EditVehiclePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      setLoadState('loading');
      try {
        const data = await vehicleService.getVehicle(Number(id));
        if (cancelled) return;
        setVehicle(data);
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

  const handleSuccess = (vehicleId: number) => {
    navigate(`/vehicles/${vehicleId}`, {
      state: { toast: 'Vehicle updated successfully.' },
    });
  };

  const handleCancel = () => {
    navigate(`/vehicles/${id}`);
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
          <button
            onClick={() => navigate('/vehicles')}
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
            Back to Vehicles
          </button>
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
            <button
              onClick={() => navigate('/vehicles')}
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
              Back to Vehicles
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!vehicle) return null;

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
              onClick={() => navigate('/vehicles')}
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
              Vehicle list
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
              onClick={() => navigate(`/vehicles/${vehicle.id}`)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-muted)',
              }}
            >
              {vehicle.registration_number}
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

          <PageHeading>Edit Vehicle</PageHeading>

          <h2
            style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-body)',
              margin: '0 0 var(--space-1) 0',
            }}
          >
            Vehicle details
          </h2>
        </div>

        <VehicleForm
          mode="edit"
          initialData={vehicle}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </AppLayout>
  );
};

export default EditVehiclePage;
