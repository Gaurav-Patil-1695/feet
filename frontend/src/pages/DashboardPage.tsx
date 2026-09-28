import React, { useState } from 'react';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import DashboardSummaryBar from '../components/dashboard/DashboardSummaryBar';
import DueVehicleTable from '../components/dashboard/DueVehicleTable';
import OverdueVehicleTable from '../components/dashboard/OverdueVehicleTable';
import { useDepots } from '../hooks/useDepots';
import { useDashboard } from '../hooks/useDashboard';

const DashboardPage: React.FC = () => {
  const { depots, loading: depotsLoading, error: depotsError } = useDepots();
  const [selectedDepotId, setSelectedDepotId] = useState<string>('');

  const depotIdNum = selectedDepotId ? Number(selectedDepotId) : undefined;
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError } = useDashboard(depotIdNum);

  const handleDepotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepotId(e.target.value);
  };

  const isLoading = depotsLoading || dashboardLoading;

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
          <PageHeading>Depot Dashboard</PageHeading>

          <div style={{ minWidth: '220px' }}>
            {depotsError ? (
              <p
                style={{
                  fontSize: 'var(--font-size-sm)',
                  color: 'var(--color-error)',
                  margin: 0,
                }}
              >
                Failed to load depots.
              </p>
            ) : (
              <>
                <label
                  htmlFor="depot-select"
                  style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-body)',
                    marginBottom: 'var(--space-1)',
                  }}
                >
                  Depot
                </label>
                <Select
                  id="depot-select"
                  value={selectedDepotId}
                  onChange={handleDepotChange}
                  disabled={depotsLoading}
                >
                  <option value="">All depots</option>
                  {(depots ?? []).map((depot) => (
                    <option key={depot.id} value={String(depot.id)}>
                      {depot.name}
                    </option>
                  ))}
                </Select>
              </>
            )}
          </div>
        </div>

        {dashboardError && (
          <Alert variant="error" style={{ marginBottom: 'var(--space-6)' }}>
            Unable to load dashboard data — please try again.
          </Alert>
        )}

        {isLoading && !dashboardError ? (
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
        ) : (
          <>
            {dashboardData && (
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <DashboardSummaryBar data={dashboardData} />
              </div>
            )}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-8)',
              }}
            >
              <section>
                <h2
                  style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-ink)',
                    marginBottom: 'var(--space-4)',
                    marginTop: 0,
                  }}
                >
                  Overdue Vehicles
                </h2>
                <OverdueVehicleTable
                  depotId={depotIdNum}
                  data={dashboardData?.overdue ?? []}
                  loading={dashboardLoading}
                />
              </section>

              <section>
                <h2
                  style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: 'var(--color-ink)',
                    marginBottom: 'var(--space-4)',
                    marginTop: 0,
                  }}
                >
                  Due for Service
                </h2>
                <DueVehicleTable
                  depotId={depotIdNum}
                  data={dashboardData?.due ?? []}
                  loading={dashboardLoading}
                />
              </section>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
