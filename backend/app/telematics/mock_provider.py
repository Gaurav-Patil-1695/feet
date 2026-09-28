"""Mock telematics provider for deterministic simulated odometer readings in test mode."""

from typing import List

from backend.app.telematics.interface import TelematicsProvider

# Base simulated odometer value in kilometres per vehicle_id unit.
# Reading is deterministic: odometer_km = _BASE_KM + vehicle_id * _KM_PER_ID
_BASE_KM: float = 10_000.0
_KM_PER_ID: float = 250.0


class MockOdometerProvider(TelematicsProvider):
    """Deterministic simulated telematics provider for test/development mode.

    Returns a fixed, reproducible odometer reading for each requested
    vehicle ID without making any external network calls.  The formula
    is::

        odometer_km = _BASE_KM + vehicle_id * _KM_PER_ID

    This guarantees that the same vehicle ID always produces the same
    reading, making tests fully deterministic.
    """

    def fetch_readings(self, vehicle_ids: List[int]) -> List[dict]:
        """Return deterministic simulated odometer readings.

        Args:
            vehicle_ids: A list of vehicle primary-key identifiers.

        Returns:
            A list of dicts, each containing:
                - ``vehicle_id`` (int): The vehicle identifier.
                - ``odometer_km`` (float): Simulated odometer value in
                  kilometres, computed as
                  ``_BASE_KM + vehicle_id * _KM_PER_ID``.
        """
        return [
            {
                "vehicle_id": vehicle_id,
                "odometer_km": _BASE_KM + vehicle_id * _KM_PER_ID,
            }
            for vehicle_id in vehicle_ids
        ]
