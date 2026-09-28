import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import Table from '../components/ui/Table';
import WorkOrderStatusBadge from '../components/workOrders/WorkOrderStatusBadge';
import { workOrderService } from '../services/workOrderService';
import type { WorkOrder } from '../types/workOrder';

type LoadState = 'idle' | 'loading' | 'error' | 'loaded';

const MyWorkOrdersPage: React.FC = () => {
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoadState('loading');
      try {
        const result = await workOrderService.getMyWorkOrders();
        if (cancelled) return;
        const items = Array.isArray(result)
          ? result
          : (result as { items?: WorkOrder[] }).items ?? [];
        setWorkOrders(items);
        setLoadState('loaded');
      } catch {
        if (cancelled) return;
        setLoadState('error');
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const columns = [
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
      key: 'vehicle_registration',
      header: 'Vehicle',
      render: (wo: WorkOrder) => {
        const reg = (wo as WorkOrder & { vehicle_registration?: string }).vehicle_registration;
        const vehicleId = (wo as WorkOrder & { vehicle_id?: number }).vehicle_id;
        if (reg && vehicleId) {
          return (
            <Link
              to={`/vehicles/${vehicleId}`}
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
                fontFamily: 'var(--font-family-mono)',
              }}
            >
              {reg}
            </Link>
          );
        }
        return reg ?? '—';
      },
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
      key: 'depot_name',
      header: 'Depot',
      render: (wo: WorkOrder) =>
        (wo as WorkOrder & { depot_name?: string }).depot_name ?? '—',
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
          <PageHeading>My Work Orders</PageHeading>
        </div>

        {loadState === 'error' && (
          <Alert variant="error" style={{ marginBottom: 'var(--space-6)' }}>
            Unable to load your work orders — please try again.
          </Alert>
        )}

        {(loadState === 'idle' || loadState === 'loading') && (
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
        )}

        {loadState === 'loaded' && workOrders.length === 0 && (
          <EmptyState
            heading="No work orders found."
            body="You have no work orders assigned to you at this time."
          />
        )}

        {loadState === 'loaded' && workOrders.length > 0 && (
          <Table
            columns={columns}
            data={workOrders}
            rowKey={(wo) => String(wo.id)}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default MyWorkOrdersPage;
