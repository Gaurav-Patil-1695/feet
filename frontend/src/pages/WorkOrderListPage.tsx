import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import Table from '../components/ui/Table';
import WorkOrderStatusBadge from '../components/workOrders/WorkOrderStatusBadge';
import { useWorkOrders } from '../hooks/useWorkOrders';
import { useAuth } from '../hooks/useAuth';
import type { WorkOrder } from '../types/workOrder';

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'closed', label: 'Closed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const WorkOrderListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workOrders, loading, error } = useWorkOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const isTechnician = user?.role === 'technician';

  const filteredWorkOrders = useMemo(() => {
    if (!workOrders) return [];
    const q = searchQuery.trim().toLowerCase();
    return workOrders.filter((wo) => {
      const matchesStatus = statusFilter ? wo.status === statusFilter : true;
      if (!matchesStatus) return false;
      if (!q) return true;
      const id = String(wo.id).toLowerCase();
      const description = (wo.description ?? '').toLowerCase();
      const vehicleReg = ((wo as WorkOrder & { vehicle_registration?: string }).vehicle_registration ?? '').toLowerCase();
      const depotName = ((wo as WorkOrder & { depot_name?: string }).depot_name ?? '').toLowerCase();
      const assignedTo = ((wo as WorkOrder & { assigned_to_name?: string }).assigned_to_name ?? '').toLowerCase();
      return (
        id.includes(q) ||
        description.includes(q) ||
        vehicleReg.includes(q) ||
        depotName.includes(q) ||
        assignedTo.includes(q)
      );
    });
  }, [workOrders, searchQuery, statusFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleCreateWorkOrder = () => {
    navigate('/work-orders/new');
  };

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
            fontFamily: 'var(--font-family-mono)',
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
        const reg = (wo as WorkOrder & { vehicle_registration?: string; vehicle_id?: number }).vehicle_registration;
        const vehicleId = (wo as WorkOrder & { vehicle_id?: number }).vehicle_id;
        if (!reg) return '—';
        if (vehicleId) {
          return (
            <Link
              to={`/vehicles/${vehicleId}`}
              style={{
                color: 'var(--color-primary)',
                textDecoration: 'none',
              }}
            >
              {reg}
            </Link>
          );
        }
        return reg;
      },
    },
    {
      key: 'description',
      header: 'Description',
      render: (wo: WorkOrder) => {
        const desc = wo.description ?? '';
        return desc.length > 80 ? `${desc.slice(0, 80)}…` : desc || '—';
      },
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
      render: (wo: WorkOrder) =>
        (wo as WorkOrder & { assigned_to_name?: string }).assigned_to_name ?? '—',
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
        {/* Page header */}
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
          <PageHeading>Work Orders</PageHeading>

          {!isTechnician && (
            <Button variant="primary" onClick={handleCreateWorkOrder}>
              + Create Work Order
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <Alert variant="error" style={{ marginBottom: 'var(--space-6)' }}>
            Unable to load work orders — please try again.
          </Alert>
        )}

        {/* Loading */}
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
        ) : !error && workOrders && workOrders.length === 0 ? (
          /* Empty state */
          <EmptyState
            heading="No work orders found."
            body="Raise a work order from the depot dashboard or vehicle detail page."
            action={
              !isTechnician ? (
                <Button variant="primary" onClick={handleCreateWorkOrder}>
                  Create Work Order
                </Button>
              ) : undefined
            }
          />
        ) : (
          !error && (
            <>
              {/* Filters */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 'var(--space-4)',
                  marginBottom: 'var(--space-4)',
                  alignItems: 'flex-end',
                }}
              >
                <div style={{ flex: '1 1 240px', maxWidth: '360px' }}>
                  <label
                    htmlFor="wo-search"
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-body)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    Search
                  </label>
                  <Input
                    id="wo-search"
                    type="search"
                    placeholder="ID, vehicle, description, depot…"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    aria-label="Search work orders"
                  />
                </div>

                <div style={{ flex: '0 1 200px' }}>
                  <label
                    htmlFor="wo-status-filter"
                    style={{
                      display: 'block',
                      fontSize: 'var(--font-size-sm)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-body)',
                      marginBottom: 'var(--space-2)',
                    }}
                  >
                    Status
                  </label>
                  <Select
                    id="wo-status-filter"
                    value={statusFilter}
                    onChange={handleStatusChange}
                    aria-label="Filter by status"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              {/* Results count */}
              {(searchQuery || statusFilter) && (
                <p
                  style={{
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-muted)',
                    marginBottom: 'var(--space-3)',
                    marginTop: 0,
                  }}
                >
                  {filteredWorkOrders.length === 0
                    ? 'No work orders match your filters.'
                    : `${filteredWorkOrders.length} work order${filteredWorkOrders.length !== 1 ? 's' : ''} found.`}
                </p>
              )}

              {/* Table or no-match message */}
              {filteredWorkOrders.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-10) 0',
                    color: 'var(--color-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  No work orders match your filters.
                </div>
              ) : (
                <Table
                  columns={columns}
                  data={filteredWorkOrders}
                  rowKey={(wo) => String(wo.id)}
                />
              )}
            </>
          )
        )}
      </div>
    </AppLayout>
  );
};

export default WorkOrderListPage;
