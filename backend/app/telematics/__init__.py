"""Telematics package: provider interface, implementations, and factory."""

from backend.app.telematics.interface import TelematicsProvider
from backend.app.telematics.factory import get_telematics_provider

__all__ = [
    "TelematicsProvider",
    "get_telematics_provider",
]
