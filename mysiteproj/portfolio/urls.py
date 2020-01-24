"""Django portfolio app urls."""

from django.urls import path

# fix this/ clean up
# from . import views
from .views import ProjectDetail, HomeView

urlpatterns = [
    # path('', views.index, name='index'),
    path('', HomeView.as_view(), name='home'),
    path('<slug:slug>', ProjectDetail.as_view(), name="project-detail"),
]
