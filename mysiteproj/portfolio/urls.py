"""Django portfolio app urls."""

from django.urls import path

# fix this/ clean up
from . import views
from .views import ProjectDetail

urlpatterns = [
    path('', views.index, name='index'),
    path('projects/<int:pk>', ProjectDetail.as_view(), name="project-detail"),
    # path('projects/<slug:slug>', ProjectDetail.as_view()),
]
# urlpatterns = [
#     url(r'^$', views.index, name='index'),
#     url(r'^admin/', admin.site.urls),
# ]
