import spotipy
import spotipy.util as util
import json
import os
from artist_bundle.dto import FullArtistDTO, RelatedArtistDTO
from album_bundle.dto import FullAlbumDTO, ImageDTO, SimpleTrackDTO

class ArtistService:
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
    
    def fetch_artist_albums(self, artist_id):
        token = util.prompt_for_user_token(self.username, self.scope, client_id=self.client_id, client_secret=self.client_secret, redirect_uri=self.redirect_uri)
        albums_dto = []
        if (token):
            sp = spotipy.Spotify(auth=token)
            result = sp.artist_albums(artist_id)
            albums = result['items']
            for album in albums:
                tracks = []
                detailed_album = sp.album(album['id'])
                items = detailed_album['tracks']['items']
                for item in items:
                    tr = SimpleTrackDTO(item['id'], item['name'], item['duration_ms'], item['track_number'])
                    tracks.append(tr)
                image = ImageDTO(album['images'][2]['url'], album['images'][2]['width'], album['images'][2]['height'])
                dto = FullAlbumDTO(album['id'], album['name'], image, album['artists'][0]['name'], tracks)
                albums_dto.append(dto)
            artist = sp.artist(artist_id)
            top_tracks = self.get_top_tracks(artist_id)
            related_artists = self.get_related_artists(artist_id)
            artist_dto = FullArtistDTO(artist['id'], artist['name'], ImageDTO(artist['images'][1]['url'],artist['images'][1]['width'], artist['images'][1]['height']), 
                artist['followers']['total'], albums_dto, top_tracks, related_artists)
        return artist_dto
    
    def get_top_tracks(self, artist_id):
        token = util.prompt_for_user_token(self.username, self.scope, client_id=self.client_id, client_secret=self.client_secret, redirect_uri=self.redirect_uri)
        tracks = []
        if (token) :
            sp = spotipy.Spotify(auth=token)
            result = sp.artist_top_tracks(artist_id)
            items = result['tracks']
            for item in items:
                tr = SimpleTrackDTO(item['id'], item['name'], item['duration_ms'], item['track_number'])
                tracks.append(tr)
        return tracks
    
    def get_related_artists(self, artist_id):
        token = util.prompt_for_user_token(self.username, self.scope, client_id=self.client_id, client_secret=self.client_secret, redirect_uri=self.redirect_uri)
        artists = []
        if(token):
            sp = spotipy.Spotify(auth=token)
            result = sp.artist_related_artists(artist_id)
            for artist in result['artists']:
                print(artist)
                print('\n')
                length = len(artist['images'])
                print(length)
                if(length != 0):
                    image = ImageDTO(artist['images'][-1]['url'], artist['images'][-1]['width'], artist['images'][-1]['height'])
                else:
                    image = None
                artists.append(RelatedArtistDTO(artist['id'], artist['name'], image))
        return artists


