import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import VehicleForm from '../components/vehicles/VehicleForm';

const AddVehiclePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (vehicleId: number) => {
    navigate(`/vehicles/${vehicleId}`, {
      state: { toast: 'Vehicle added successfully.' },
    });
  };

  const handleCancel = () => {
    navigate('/vehicles');
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
            onClick={() => navigate('/vehicles')}
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
            ← Vehicle list
          </button>
          <PageHeading>Add Vehicle</PageHeading>
        </div>

        <VehicleForm
          mode="create"
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </AppLayout>
  );
};

export default AddVehiclePage;
