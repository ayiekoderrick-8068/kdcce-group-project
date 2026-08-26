import logging

logger = logging.getLogger("kdcce.notifications")


def notify(message, category="general"):
    """Placeholder notification sink. Swap this for real email/SMS/push
    delivery later — every caller already goes through this one function,
    so that's the only place that needs to change."""
    logger.info("[%s] %s", category, message)
