import spotipy
import spotipy.util as util
import json
import os
from album_bundle.dto import SimpleTrackDTO, ImageDTO, FullAlbumDTO

class AlbumService():
    username = ""
    client_id = ""
    client_secret = ""
    redirect_uri = ""
    scope = ""

    def __init__(self, username):
        self.username = username
        json_data = open('static/spotify_connection_params.json') 
        data = json.load(json_data)
        self.client_id = data["client_id"]
        self.client_secret = data["client_secret"]
        self.redirect_uri = data["redirect_uri"]
        self.scope = data["scope"][0]
        json_data.close()
    
    def tracks_for_album(self, album_id):
        token = util.prompt_for_user_token(self.username, self.scope, client_id=self.client_id, client_secret=self.client_secret, redirect_uri=self.redirect_uri)
        if (token):
            sp = spotipy.Spotify(auth=token)
            result = sp.album(album_id)
            tracks = []
            items = result['tracks']['items']
            for item in items :
                tr = SimpleTrackDTO(item['id'], item['name'], item['duration_ms'], item['track_number'])
                tracks.append(tr)
            image = ImageDTO(result['images'][1]['url'], result['images'][1]['width'], result['images'][1]['height'])
            album = FullAlbumDTO(result['id'], result['name'], image, result['artists'][0]['name'], tracks)
            return album
