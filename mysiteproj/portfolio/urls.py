"""Django portfolio app urls."""

from django.urls import path
# from django.conf.urls import url
# from django.contrib import admin

from . import views

urlpatterns = [
    path('', views.index, name='index'),
]
# urlpatterns = [
#     url(r'^$', views.index, name='index'),
#     url(r'^admin/', admin.site.urls),
# ]
