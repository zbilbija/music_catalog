from django.urls import path
from artist_bundle import views

urlpatterns = [
    path(r'get-albums', views.fetch_albums, name='fetch-artist-albums'), #GET/POST
    
]