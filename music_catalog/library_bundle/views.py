from django.shortcuts import render
from django.middleware.csrf import rotate_token
from django.http import HttpResponse,JsonResponse
from django.utils.six import BytesIO
from rest_framework.parsers import JSONParser
import spotipy
import spotipy.util as util
from library_bundle.dto import TrackDTO, SimpleAlbumDTO, ArtistDTO
from library_bundle.serializers import TrackDTOSerializer, CurrentTrackDTOSerializer
from library_bundle.service import TrackService
from docx import *
import os
from django.views.decorators.csrf import csrf_exempt

track_service = None

# Create your views here.
@csrf_exempt
def login(request):
    if request.method == "GET":
        #rotate_token(request)
        return JsonResponse({'message': "called get method"})
    elif request.method == "POST":
        stream = BytesIO(request.body)
        data = JSONParser().parse(stream)
        print("username " + str(data['username']))
        request.session["username"] = data['username']
        return JsonResponse({'message': "called get method"})
    else:
        return JsonResponse({'message': "called get method"})

@csrf_exempt
def check_user(request):
    if request.method == "GET":
        if 'username' in request.session:
            return JsonResponse({'username': request.session["username"]})
        else:
            return JsonResponse({"username" : -1}, status=500)
    else:
        return JsonResponse({"message" : "connected"})

@csrf_exempt
def download_doc(request):
    if request.method == "POST":
        global track_service
        if(track_service is None):
            stream = BytesIO(request.body)
            data = JSONParser().parse(stream)
            username = data["username"]
            track_service = TrackService(username)
        track_service.download_library()
        return JsonResponse({"success" : "library saved"})
    else:
        return JsonResponse({"message" : "connected"})

def logout(request):
    print("got into logout")
    global track_service
    track_service.update_player_state(False)
    track_service = None
    return JsonResponse({"message": "logged out"})

@csrf_exempt
def fetch_songs(request):
    if request.method == "POST":
        stream = BytesIO(request.body)
        data = JSONParser().parse(stream)
        global track_service
        print("service in fetch songs: ")
        print(track_service)
        if(track_service is None):
            track_service = TrackService(data["username"])
        tracks = track_service.fetch_all_songs_for_user()
        if(len(tracks) == 0):
            return JsonResponse({'message': "no tracks found"})
        else:
            serializer = TrackDTOSerializer(tracks, many=True)
            return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'message': "reached fetch songs method"})

@csrf_exempt
def recently_played(request):
    if request.method == "POST":
        global track_service
        recently = track_service.fetch_recently_played()
        serializer = CurrentTrackDTOSerializer(recently, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({"status": "reached recently-played"})

@csrf_exempt
def get_current_track(request):
    if request.method == "POST":
        stream = BytesIO(request.body)
        data = JSONParser().parse(stream)
        global track_service
        if(track_service is None):
            track_service = TrackService(data["username"])
        track_service.update_player_state(data["isPlaying"])
        track = track_service.fetch_current_song()
        if(track is None):
            return JsonResponse({'message': "no tracks found"})
        else:
            track_service.update_player_state(track.is_playing)
            serializer = CurrentTrackDTOSerializer(track)
            return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({'message': "reached fetch songs method"})

@csrf_exempt
def cancel_check_player(request):
    if request.method == "POST":
        #stream = BytesIO(request.body)
        #data = JSONParser().parse(stream)
        global track_service
        track_service.update_player_state(False)
        return JsonResponse({'message': "stopped check player state"})
    else:
        return JsonResponse({"message": "reached cancel check player state"})

@csrf_exempt
def pause_playback(request):
    if request.method == "POST":
        stream = BytesIO(request.body)
        data = JSONParser().parse(stream)
        global track_service
        if(track_service is None):
            track_service = TrackService(data["username"])
        track_service.update_player_state(data["isPlaying"])
        #track_service.request_spotify_player_state()
        #track_service.pause_playback()
        return JsonResponse({'message': "stopped playback"})
    else:
        return JsonResponse({'message': "reached stop playback"})
