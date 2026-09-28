import React from 'react';
import { DashboardVehicleRow } from '../../types/dashboard';
import { Table } from '../ui/Table';
import { Badge } from '../ui/Badge';
import { EmptyState } from '../ui/EmptyState';

interface DueVehicleTableProps {
  rows: DashboardVehicleRow[];
  isLoading?: boolean;
}

const DueVehicleTable: React.FC<DueVehicleTableProps> = ({ rows, isLoading = false }) => {
  if (!isLoading && rows.length === 0) {
    return (
      <EmptyState
        title="No vehicles due"
        description="There are currently no vehicles due for service."
      />
    );
  }

  return (
    <Table
      isLoading={isLoading}
      columns={[
        {
          key: 'registration',
          header: 'Registration',
          render: (row: DashboardVehicleRow) => (
            <span className="due-vehicle-table__registration">{row.registration}</span>
          ),
        },
        {
          key: 'fleet_number',
          header: 'Fleet No.',
          render: (row: DashboardVehicleRow) => row.fleet_number ?? '—',
        },
        {
          key: 'vehicle_type',
          header: 'Vehicle Type',
          render: (row: DashboardVehicleRow) => row.vehicle_type_name ?? '—',
        },
        {
          key: 'depot',
          header: 'Depot',
          render: (row: DashboardVehicleRow) => row.depot_name ?? '—',
        },
        {
          key: 'service_type',
          header: 'Service Type',
          render: (row: DashboardVehicleRow) => row.service_type ?? '—',
        },
        {
          key: 'due_date',
          header: 'Due Date',
          render: (row: DashboardVehicleRow) =>
            row.due_date
              ? new Date(row.due_date).toLocaleDateString('en-GB')
              : '—',
        },
        {
          key: 'due_mileage',
          header: 'Due Mileage',
          render: (row: DashboardVehicleRow) =>
            row.due_mileage != null
              ? row.due_mileage.toLocaleString()
              : '—',
        },
        {
          key: 'status',
          header: 'Status',
          render: (row: DashboardVehicleRow) => (
            <Badge variant="warning">{row.status}</Badge>
          ),
        },
      ]}
      rows={rows}
      rowKey={(row: DashboardVehicleRow) => row.vehicle_id}
    />
  );
};

export default DueVehicleTable;
