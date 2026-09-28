import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import PageHeading from '../components/ui/PageHeading';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import Alert from '../components/ui/Alert';
import EmptyState from '../components/ui/EmptyState';
import Table from '../components/ui/Table';
import { useSchedules } from '../hooks/useSchedules';
import { useAuth } from '../hooks/useAuth';
import type { Schedule } from '../types/schedule';

const ScheduleListPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { schedules, loading, error } = useSchedules();
  const [searchQuery, setSearchQuery] = useState('');

  const isTechnician = user?.role === 'technician';

  const filteredSchedules = useMemo(() => {
    if (!schedules) return [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return schedules;
    return schedules.filter((s) => {
      const typeName = ((s as Schedule & { vehicle_type_name?: string }).vehicle_type_name ?? '').toLowerCase();
      const kmInterval = String(s.interval_km ?? '').toLowerCase();
      const monthInterval = String(s.interval_months ?? '').toLowerCase();
      return (
        typeName.includes(q) ||
        kmInterval.includes(q) ||
        monthInterval.includes(q)
      );
    });
  }, [schedules, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateSchedule = () => {
    navigate('/schedules/new');
  };

  const columns = [
    {
      key: 'vehicle_type_name',
      header: 'Vehicle Type',
      render: (s: Schedule) => (
        <Link
          to={`/schedules/${s.id}`}
          style={{
            color: 'var(--color-primary)',
            fontWeight: 'var(--font-weight-medium)',
            textDecoration: 'none',
          }}
        >
          {(s as Schedule & { vehicle_type_name?: string }).vehicle_type_name ?? '—'}
        </Link>
      ),
    },
    {
      key: 'interval_km',
      header: 'Interval (km)',
      render: (s: Schedule) =>
        s.interval_km != null ? (
          <span style={{ fontFamily: 'var(--font-family-mono)' }}>
            {s.interval_km.toLocaleString()}
          </span>
        ) : (
          '—'
        ),
    },
    {
      key: 'interval_months',
      header: 'Interval (months)',
      render: (s: Schedule) =>
        s.interval_months != null ? s.interval_months : '—',
    },
    {
      key: 'effective_from',
      header: 'Effective From',
      render: (s: Schedule) =>
        s.effective_from
          ? new Date(s.effective_from).toLocaleDateString()
          : '—',
    },
    {
      key: 'effective_to',
      header: 'Effective To',
      render: (s: Schedule) =>
        s.effective_to
          ? new Date(s.effective_to).toLocaleDateString()
          : '—',
    },
    {
      key: 'actions',
      header: '',
      render: (s: Schedule) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <Link
            to={`/schedules/${s.id}`}
            style={{
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-primary)',
              fontWeight: 'var(--font-weight-medium)',
              textDecoration: 'none',
            }}
          >
            View
          </Link>
          {!isTechnician && (
            <Link
              to={`/schedules/${s.id}/edit`}
              style={{
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-muted)',
                textDecoration: 'none',
                marginLeft: 'var(--space-2)',
              }}
            >
              Edit
            </Link>
          )}
        </div>
      ),
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
          <PageHeading>Schedules</PageHeading>

          {!isTechnician && (
            <Button variant="primary" onClick={handleCreateSchedule}>
              + Create Schedule
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="error" style={{ marginBottom: 'var(--space-6)' }}>
            Unable to load schedules — please try again.
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
        ) : !error && schedules && schedules.length === 0 ? (
          <EmptyState
            heading="No schedules defined"
            body="Create the first service schedule to get started."
            action={
              !isTechnician ? (
                <Button variant="primary" onClick={handleCreateSchedule}>
                  Create Schedule
                </Button>
              ) : undefined
            }
          />
        ) : (
          !error && (
            <>
              <div style={{ marginBottom: 'var(--space-4)', maxWidth: '360px' }}>
                <label
                  htmlFor="schedule-search"
                  style={{
                    display: 'block',
                    fontSize: 'var(--font-size-sm)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-body)',
                    marginBottom: 'var(--space-2)',
                  }}
                >
                  Search schedules
                </label>
                <Input
                  id="schedule-search"
                  type="search"
                  placeholder="Vehicle type, interval…"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search schedules"
                />
              </div>

              {filteredSchedules.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: 'var(--space-10) 0',
                    color: 'var(--color-muted)',
                    fontSize: 'var(--font-size-sm)',
                  }}
                >
                  No schedules match your search.
                </div>
              ) : (
                <Table
                  columns={columns}
                  data={filteredSchedules}
                  rowKey={(s) => String(s.id)}
                />
              )}
            </>
          )
        )}
      </div>
    </AppLayout>
  );
};

export default ScheduleListPage;
