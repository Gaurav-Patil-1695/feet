import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import Table from '../components/ui/Table';
import VehicleStatusBadge from '../components/vehicles/VehicleStatusBadge';
import { useVehicles } from '../hooks/useVehicles';
import { useAuth } from '../hooks/useAuth';

const VehicleListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { vehicles, loading, error } = useVehicles();
  const [searchQuery, setSearchQuery] = useState('');

  const isTechnician = user?.role === 'technician';

  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) => {
      const registration = (v.registration_number ?? '').toLowerCase();
      const make = (v.make ?? '').toLowerCase();
      const model = (v.model ?? '').toLowerCase();
      const depot = (v.depot_name ?? '').toLowerCase();
      const type = (v.vehicle_type_name ?? '').toLowerCase();
      return (
        registration.includes(q) ||
        make.includes(q) ||
        model.includes(q) ||
        depot.includes(q) ||
        type.includes(q)
      );
    });
  }, [vehicles, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddVehicle = () => {
    navigate('/vehicles/new');
  };

  const columns = [
    {
      key: 'registration_number',
      header: 'Registration',
      render: (v: typeof filteredVehicles[number]) => (
        <Link
          to={`/vehicles/${v.id}`}
          style={{
            color: 'var(--color-primary)',
            fontWeight: 'var(--font-weight-medium)',
            textDecoration: 'none',
          }}
        >
          {v.registration_number}
        </Link>
      ),
    },
    {
      key: 'make',
      header: 'Make',
      render: (v: typeof filteredVehicles[number]) => v.make ?? '—',
    },
    {
      key: 'model',
      header: 'Model',
      render: (v: typeof filteredVehicles[number]) => v.model ?? '—',
    },
    {
      key: 'vehicle_type_name',
      header: 'Type',
      render: (v: typeof filteredVehicles[number]) => v.vehicle_type_name ?? '—',
    },
    {
      key: 'depot_name',
      header: 'Depot',
      render: (v: typeof filteredVehicles[number]) => v.depot_name ?? '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (v: typeof filteredVehicles[number]) => (
        <VehicleStatusBadge status={v.status} />
      ),
    },
    {
      key: 'current_odometer_km',
      header: 'Odometer (km)',
      render: (v: typeof filteredVehicles[number]) =>
        v.current_odometer_km != null
          ? v.current_odometer_km.toLocaleString()
          : '—',
    },
  ];

  return (
    <AppLayout>
      <div
        style={{
          padding: 'var(--space-6)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 'var(--space-4)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <PageHeading>Vehicles</PageHeading>

          {!isTechnician && (
            <Button variant="primary" onClick={handleAddVehicle}>
              + Add Vehicle
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="error" style={{ marginBottom: 'var(--space-6)' }}>
            Unable to load vehicles — please try again.
          </Alert>
        )}

        {loading ? (
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
        ) : !error && vehicles && vehicles.length === 0 ? (
          <EmptyState
            heading="No vehicles registered"
            body="Add the first vehicle to get started."
            action={
              !isTechnician ? (
                <Button variant="primary" onClick={handleAddVehicle}>
                  Add Vehicle
                </Button>
              ) : undefined
            }
          />
        ) : (
          !error && (
            <>
              <div style={{ marginBottom: 'var(--space-4)', maxWidth: '360px' }}>
                <label
                  htmlFor="vehicle-search"
                  style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-body)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  Search vehicles
                </label>
                <Input
                  id="vehicle-search"
                  type="search"
                  placeholder="Registration, make, model, depot…"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search vehicles"
                />
              </div>

              {filteredVehicles.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-10) 0',
                    color: 'var(--color-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  No vehicles match your search.
                </div>
              ) : (
                <Table
                  columns={columns}
                  data={filteredVehicles}
                  rowKey={(v) => String(v.id)}
                />
              )}
            </>
          )
        )}
      </div>
    </AppLayout>
  );
};

export default VehicleListPage;
