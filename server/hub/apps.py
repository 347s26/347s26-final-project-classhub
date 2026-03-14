from django.apps import AppConfig


class HubConfig(AppConfig):
    default_auto_field: str = 'django.db.models.BigAutoField'  # pyright: ignore[reportIncompatibleVariableOverride]
    name: str = 'hub'
