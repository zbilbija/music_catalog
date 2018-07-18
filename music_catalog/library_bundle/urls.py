from django.urls import path
from library_bundle import views

urlpatterns = [
    path(r'login', views.login, name='login'), #GET/POST
    path(r'check-user', views.check_user, name="check-user"), #GET
    path(r'fetch-songs', views.fetch_songs, name="fetch-songs"), #POST
    path(r'recently-played', views.recently_played, name="recently-played"), #POST
    path(r'logout', views.logout, name='logout'), #POST
    path(r'download', views.download_doc, name='download'), #GET
    path(r'current-track', views.get_current_track, name="current-track"), #POST
    path(r'cancel-player-check', views.cancel_check_player, name="cancel-player-check"), #POST
    path(r'pause-playback', views.pause_playback, name="pause-playback")
]