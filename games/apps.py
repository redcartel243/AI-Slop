from django.apps import AppConfig


class GamesConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "games"
    verbose_name = "Interactive Games"
    
    def ready(self):
        """
        Initialize any app-specific configurations when the app is ready.
        This is a good place to register signals or perform other app initialization.
        """
        # Import signals or perform other initialization
        pass
