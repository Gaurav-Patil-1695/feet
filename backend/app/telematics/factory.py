"""Factory that returns the appropriate telematics provider based on TELEMATICS_MODE env var."""

import os

from backend.app.telematics.interface import TelematicsProvider


def get_telematics_provider() -> TelematicsProvider:
    """Return the configured telematics provider instance.

    Reads the ``TELEMATICS_MODE`` environment variable to determine which
    provider implementation to instantiate:

    - ``"live"`` (case-insensitive): Returns a :class:`LiveOdometerProvider`.
    - Any other value (including unset): Returns a :class:`MockOdometerProvider`.

    Returns:
        A concrete :class:`TelematicsProvider` implementation appropriate
        for the current runtime mode.
    """
    mode = os.environ.get("TELEMATICS_MODE", "mock").strip().lower()

    if mode == "live":
        from backend.app.telematics.live_provider import LiveOdometerProvider

        return LiveOdometerProvider()

    from backend.app.telematics.mock_provider import MockOdometerProvider

    return MockOdometerProvider()
