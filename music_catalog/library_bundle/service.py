import spotipy
import spotipy.util as util
import json
import os
import datetime
from docx import *
from library_bundle.dto import TrackDTO, ArtistDTO, SimpleAlbumDTO, CurrentTrackDTO
from library_bundle.utils import SpotifyTokenHolder
import schedule
from schedule import Scheduler
import time
import threading
from enum import Enum

class JSONFile(Enum):
    CONNECTION = "static/spotify_connection_params.json"
    DOWNLOAD = "static/file_download.json"

class TrackService():

    username = ""
    client_id = ""
    client_secret = ""
    redirect_uri = ""
    user_token = None
    current_track_token = None
    is_player_playing = False
    scheduler = Scheduler()
    _job_stop = None

    def request_spotify_player_state(self):
        if self.is_player_playing is not True:
            self.scheduler.cancel_job(self._job_stop)
            print("cancelled job")
            self._job_stop.set()
            return schedule.CancelJob
        else:
            self._job_stop = self.scheduler.run_continuously()
            print("doing request player state")
            self.scheduler.every(60).seconds.do(self.fetch_current_song)
    
    def __init__(self, username):
        self.username = username 
        data = self.get_data_from_json(JSONFile.CONNECTION.value)
        self.client_id = data["client_id"]
        self.client_secret = data["client_secret"]
        self.redirect_uri = data["redirect_uri"]
        self._job_stop = self.scheduler.run_continuously()

    def update_player_state(self, player_state):
        old_state = self.is_player_playing
        self.is_player_playing = player_state
        if not(self.is_player_playing and old_state):
            self.request_spotify_player_state()

    def fetch_all_songs_for_user(self):
        data = self.get_data_from_json(JSONFile.CONNECTION.value)
        scope = data["scope"][0]
        if(self.user_token is None):
            token = util.prompt_for_user_token(self.username, scope, client_id=self.client_id, client_secret=self.client_secret, redirect_uri=self.redirect_uri)
        else:
            print("GENERATED TOKEN TIME:")
            print(self.user_token.date_generated)
            elapsed = datetime.datetime.utcnow() - self.user_token.date_generated
            print(elapsed.seconds)
            elapsed_hours = elapsed.seconds//3600
            if(elapsed_hours < 1):
                token = self.user_token.token
            else:
               token = util.prompt_for_user_token(self.username, scope, client_id=self.client_id, client_secret=self.client_secret, redirect_uri=self.redirect_uri) 
        tracks = []
        if token:
            self.user_token = SpotifyTokenHolder(token, datetime.datetime.utcnow())
            sp = spotipy.Spotify(auth=token)
            i=0
            while True:
                results = sp.current_user_saved_tracks(20, i*20)
                if(len(results['items']) == 0):
                    break
                items = results['items']
                for item in results['items']:
                    track = item['track']
                    artist = ArtistDTO(track['artists'][0]['id'], track['artists'][0]['name'])
                    album = SimpleAlbumDTO(track['album']['id'], track['album']['name'])
                    tracks.append(TrackDTO(track['id'],track['name'], artist, album))
                i+=1
        
        return tracks
    
    def fetch_current_song(self):  
        data = self.get_data_from_json(JSONFile.CONNECTION.value)
        scope = data["scope"][1]
        if(self.current_track_token is None or self.current_track_token.token == ''):
            token = util.prompt_for_user_token(self.username, scope,client_id=self.client_id, client_secret=self.client_secret,redirect_uri=self.redirect_uri)
        else:
            elapsed = datetime.datetime.utcnow() - self.current_track_token.date_generated
            elapsed_hours = elapsed.seconds//3600
            if(elapsed_hours < 1):
                token = self.current_track_token.token
            else:
               token = util.prompt_for_user_token(self.username, scope, client_id=self.client_id, client_secret=self.client_secret, redirect_uri=self.redirect_uri) 
        print(datetime.datetime.now())
        if token:
            self.current_track_token = SpotifyTokenHolder(token, datetime.datetime.utcnow())
            sp = spotipy.client.Spotify(auth=token)
            result = sp.current_user_playing_track()
            track = result
            print(track['item']['name'] + ' - ' + track['item']['artists'][0]['name'] + '- ' + track['item']['album']['name'])
            artist = ArtistDTO(track['item']['artists'][0]['id'], track['item']['artists'][0]['name'])
            album = SimpleAlbumDTO(track['item']['album']['id'], track['item']['album']['name'])
            current_track = CurrentTrackDTO(track['item']['id'],track['item']['name'], track['is_playing'], track['item']['duration_ms'], track['progress_ms'],
            track['item']['album']['images'][2]['url'],artist, album)
            return current_track
        else:
            return None

    def pause_playback(self): 
        data = self.get_data_from_json(JSONFile.CONNECTION.value)
        scope = data["scope"][4]
        token = util.prompt_for_user_token(self.username, scope, client_id=self.client_id, client_secret=self.client_secret, redirect_uri=self.redirect_uri)
        if(token):
            sp = spotipy.client.Spotify(auth=token)
            sp.pause_playback()


    def download_library(self):
        data = self.get_data_from_json(JSONFile.CONNECTION.value)
        scope = data["scope"][0]
        data = self.get_data_from_json(JSONFile.DOWNLOAD.value)
        file_location = data['file_location']
        file_name = self.username + data['file_name']['library']
        print(os.path.join(file_location, file_name))
        document = Document()
        docx_title= os.path.join(file_location, file_name) 
        tracks = []
        if(self.user_token is None):
            token = util.prompt_for_user_token(self.username, scope,client_id=self.client_id,client_secret=self.client_secret,redirect_uri=self.redirect_uri)
        else:
            elapsed = datetime.datetime.utcnow() - self.user_token.date_generated
            elapsed_hours = elapsed.seconds//3600
            if(elapsed_hours < 1):
                token = self.user_token.token
            else:
               token = util.prompt_for_user_token(self.username, scope, client_id=self.client_id, client_secret=self.client_secret, redirect_uri=self.redirect_uri)
        if token:
            self.user_token = SpotifyTokenHolder(token, datetime.datetime.utcnow())
            sp = spotipy.Spotify(auth=token)
            i=0
            while True:
                results = sp.current_user_saved_tracks(20, i*20)
                if(len(results['items']) == 0):
                    break
                items = results['items']
                for item in results['items']:
                    track = item['track']
                    tracks.append(TrackDTO(track['id'], track['name'], track['artists'][0]['name'], track['album']['name']))
                i+=1
        else:
            print("Can't get token for " + username)

        for track in tracks:
            document.add_paragraph(track.name + " - " + track.artist + " (" + track.album + ")")
        document.save(docx_title)

    def get_data_from_json(self, file_path):
        json_data = open(file_path)   
        data = json.load(json_data)
        json_data.close()
        return data


def run_continuously(self, interval=1):
    """Continuously run, while executing pending jobs at each elapsed
    time interval.
    @return cease_continuous_run: threading.Event which can be set to
    cease continuous run.
    Please note that it is *intended behavior that run_continuously()
    does not run missed jobs*. For example, if you've registered a job
    that should run every minute and you set a continuous run interval
    of one hour then your job won't be run 60 times at each interval but
    only once.
    """

    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):

        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                self.run_pending()
                time.sleep(interval)

    continuous_thread = ScheduleThread()
    continuous_thread.setDaemon(True)
    continuous_thread.start()
    return cease_continuous_run

Scheduler.run_continuously = run_continuously