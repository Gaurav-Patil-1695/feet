"""Pure service-due calculator.

Given a vehicle's last service date/odometer and a schedule's
interval settings, returns the next due date and next due odometer.
Whichever threshold is reached first determines the overall due status.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional


@dataclass(frozen=True)
class ServiceDueResult:
    """Result of a service-due calculation."""

    next_due_date: Optional[date]
    next_due_odometer: Optional[int]
    # Whichever threshold falls first drives `due_first`:
    # 'date', 'odometer', or None when neither interval is configured.
    due_first: Optional[str]


def calculate_service_due(
    *,
    last_service_date: Optional[date],
    last_service_odometer: Optional[int],
    current_odometer: Optional[int],
    interval_days: Optional[int],
    interval_km: Optional[int],
) -> ServiceDueResult:
    """Calculate the next service due date and odometer reading.

    Parameters
    ----------
    last_service_date:
        The date on which the most recent service was performed.
        Pass ``None`` when no prior service has been recorded.
    last_service_odometer:
        The odometer reading (km) at the time of the most recent service.
        Pass ``None`` when no prior service has been recorded.
    current_odometer:
        The vehicle's current odometer reading (km).
        Required to evaluate distance-based intervals.
    interval_days:
        How many days between services according to the applicable schedule.
        Pass ``None`` when the schedule has no day-based interval.
    interval_km:
        How many kilometres between services according to the applicable
        schedule.  Pass ``None`` when the schedule has no distance interval.

    Returns
    -------
    ServiceDueResult
        A frozen dataclass containing:
        - ``next_due_date``     – absolute calendar date of next service, or
          ``None`` if no day-based interval is configured.
        - ``next_due_odometer`` – absolute odometer reading at which service
          is next due, or ``None`` if no distance interval is configured.
        - ``due_first``         – ``'date'`` if the calendar deadline arrives
          before the odometer threshold *given current odometer*, ``'odometer'``
          if the distance threshold is closer, or ``None`` when neither
          interval is set.
    """
    next_due_date: Optional[date] = None
    next_due_odometer: Optional[int] = None

    # --- date-based interval -------------------------------------------
    if interval_days is not None and interval_days > 0:
        if last_service_date is not None:
            next_due_date = last_service_date + timedelta(days=interval_days)
        else:
            # No prior service recorded; treat today as the baseline so the
            # vehicle is due `interval_days` from today.
            next_due_date = date.today() + timedelta(days=interval_days)

    # --- odometer-based interval ---------------------------------------
    if interval_km is not None and interval_km > 0:
        if last_service_odometer is not None:
            next_due_odometer = last_service_odometer + interval_km
        elif current_odometer is not None:
            # No prior service recorded; project forward from current reading.
            next_due_odometer = current_odometer + interval_km
        else:
            # Neither baseline is available; we cannot compute a target.
            next_due_odometer = interval_km

    # --- determine which threshold falls first -------------------------
    due_first: Optional[str] = None

    if next_due_date is not None and next_due_odometer is not None:
        # Convert the date threshold to an odometer-equivalent so we can
        # compare the two on the same axis.  We estimate how far the vehicle
        # will travel before the date threshold by using the days remaining
        # and (if available) a daily-km rate derived from recent data.
        # When we cannot compute a rate we fall back to a purely temporal
        # comparison: whichever interval *would* expire sooner if we only
        # look at days-remaining vs km-remaining.
        days_until_date = (next_due_date - date.today()).days

        km_remaining: Optional[int] = None
        if current_odometer is not None:
            km_remaining = next_due_odometer - current_odometer

        if km_remaining is not None:
            # Positive km_remaining means the odometer threshold is still
            # ahead; negative means it is already overdue.
            if km_remaining <= 0:
                due_first = "odometer"
            elif days_until_date <= 0:
                due_first = "date"
            else:
                # Estimate days-equivalent for the km threshold using a
                # naive daily rate: if we have last_service_date we can
                # compute elapsed days and km to derive a rate.
                daily_rate_km: Optional[float] = None
                if (
                    last_service_date is not None
                    and last_service_odometer is not None
                    and current_odometer is not None
                ):
                    elapsed_days = (date.today() - last_service_date).days
                    elapsed_km = current_odometer - last_service_odometer
                    if elapsed_days > 0 and elapsed_km > 0:
                        daily_rate_km = elapsed_km / elapsed_days

                if daily_rate_km and daily_rate_km > 0:
                    days_until_odometer = km_remaining / daily_rate_km
                    due_first = (
                        "odometer"
                        if days_until_odometer <= days_until_date
                        else "date"
                    )
                else:
                    # Cannot compute a rate; compare remaining km vs
                    # remaining days as a dimensionless proxy.
                    # Prefer the threshold that is proportionally closer.
                    date_fraction = (
                        days_until_date / interval_days
                        if interval_days and interval_days > 0
                        else float("inf")
                    )
                    odo_fraction = (
                        km_remaining / interval_km
                        if interval_km and interval_km > 0
                        else float("inf")
                    )
                    due_first = (
                        "odometer" if odo_fraction <= date_fraction else "date"
                    )
        else:
            # No current odometer; fall back to date alone.
            due_first = "date" if days_until_date <= 0 else "date"
    elif next_due_date is not None:
        due_first = "date"
    elif next_due_odometer is not None:
        due_first = "odometer"

    return ServiceDueResult(
        next_due_date=next_due_date,
        next_due_odometer=next_due_odometer,
        due_first=due_first,
    )
