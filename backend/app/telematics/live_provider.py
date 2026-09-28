"""Live telematics provider that fetches real odometer readings via an external HTTP API."""

import logging
from typing import List

import httpx

from backend.app.config import settings
from backend.app.telematics.interface import TelematicsProvider

logger = logging.getLogger(__name__)


class LiveOdometerProvider(TelematicsProvider):
    """Real telematics HTTP client that retrieves odometer readings from an external service.

    Credentials and the base URL are sourced from application config
    (``settings.TELEMATICS_API_URL``, ``settings.TELEMATICS_API_KEY``).

    Each call to :meth:`fetch_readings` issues a synchronous POST request to
    the configured telematics endpoint, passing the list of vehicle IDs in the
    request body, and returns the parsed response as a list of dicts.

    Expected response format from the upstream API::

        [
            {"vehicle_id": 1, "odometer_km": 12345.6},
            ...
        ]

    Raises:
        httpx.HTTPStatusError: If the upstream API returns a non-2xx status.
        httpx.RequestError: If a network-level error occurs.
    """

    def __init__(self) -> None:
        self._base_url: str = str(settings.TELEMATICS_API_URL).rstrip("/")
        self._api_key: str = settings.TELEMATICS_API_KEY
        self._timeout: float = float(getattr(settings, "TELEMATICS_TIMEOUT_SECONDS", 10.0))

    def fetch_readings(self, vehicle_ids: List[int]) -> List[dict]:
        """Fetch live odometer readings for the given vehicle IDs.

        Args:
            vehicle_ids: A list of vehicle primary-key identifiers for which
                odometer readings should be retrieved.

        Returns:
            A list of dicts, each containing at minimum:
                - ``vehicle_id`` (int): The vehicle identifier.
                - ``odometer_km`` (float): The current odometer value in
                  kilometres.

        Raises:
            httpx.HTTPStatusError: Propagated when the upstream service
                returns a non-2xx HTTP status code.
            httpx.RequestError: Propagated on any transport-level failure
                (DNS, timeout, connection refused, etc.).
        """
        if not vehicle_ids:
            return []

        url = f"{self._base_url}/odometer-readings"
        headers = {
            "Authorization": f"Bearer {self._api_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        payload = {"vehicle_ids": vehicle_ids}

        logger.debug(
            "LiveOdometerProvider: POST %s for %d vehicle(s)",
            url,
            len(vehicle_ids),
        )

        with httpx.Client(timeout=self._timeout) as client:
            response = client.post(url, json=payload, headers=headers)

        response.raise_for_status()

        data: List[dict] = response.json()

        logger.debug(
            "LiveOdometerProvider: received %d reading(s) from upstream",
            len(data),
        )

        return data
