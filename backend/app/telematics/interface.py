"""Abstract base class defining the telematics provider interface."""

from abc import ABC, abstractmethod
from typing import List


class TelematicsProvider(ABC):
    """Abstract base class for telematics providers.

    All concrete telematics implementations must subclass this and
    implement the ``fetch_readings`` method.
    """

    @abstractmethod
    def fetch_readings(self, vehicle_ids: List[int]) -> List[dict]:
        """Fetch the latest odometer readings for the given vehicle IDs.

        Args:
            vehicle_ids: A list of vehicle primary-key identifiers for
                which odometer readings should be retrieved.

        Returns:
            A list of dicts, each containing at minimum:
                - ``vehicle_id`` (int): The vehicle identifier.
                - ``odometer_km`` (float): The current odometer value in
                  kilometres.
        """
