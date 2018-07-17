from django.urls import path
from album_bundle import views

urlpatterns = [
    path(r'album', views.fetch_album, name='fetch-album'), #GET/POST
]