import React from 'react';
import { Badge } from '../ui/Badge';

interface DashboardSummaryBarProps {
  dueCount: number;
  overdueCount: number;
  isLoading?: boolean;
}

const DashboardSummaryBar: React.FC<DashboardSummaryBarProps> = ({
  dueCount,
  overdueCount,
  isLoading = false,
}) => {
  return (
    <div className="dashboard-summary-bar">
      <div className="dashboard-summary-bar__item">
        <span className="dashboard-summary-bar__icon dashboard-summary-bar__icon--due" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </span>
        <span className="dashboard-summary-bar__label">Due</span>
        {isLoading ? (
          <span className="dashboard-summary-bar__loading">—</span>
        ) : (
          <Badge variant="warning">
            {dueCount.toLocaleString()}
          </Badge>
        )}
      </div>

      <div className="dashboard-summary-bar__divider" aria-hidden="true" />

      <div className="dashboard-summary-bar__item">
        <span className="dashboard-summary-bar__icon dashboard-summary-bar__icon--overdue" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <span className="dashboard-summary-bar__label">Overdue</span>
        {isLoading ? (
          <span className="dashboard-summary-bar__loading">—</span>
        ) : (
          <Badge variant="error">
            {overdueCount.toLocaleString()}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default DashboardSummaryBar;
