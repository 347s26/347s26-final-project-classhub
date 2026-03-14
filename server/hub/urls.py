from django.urls import URLPattern, URLResolver, path
from . import views
from . import api

urlpatterns: list[URLPattern | URLResolver] = [
    path("api/", api.api.urls)
]