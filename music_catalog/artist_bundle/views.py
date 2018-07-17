from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse,JsonResponse
from django.utils.six import BytesIO
from rest_framework.parsers import JSONParser
from artist_bundle.service import ArtistService
from artist_bundle.serializers import FullArtistDTOSerializer

# Create your views here.
@csrf_exempt
def fetch_albums(request):
    if request.method == "POST":
        stream = BytesIO(request.body)
        data = JSONParser().parse(stream)
        username = data["username"]
        artist_id = data["artistId"]
        artist_service = ArtistService(username)
        albums = artist_service.fetch_artist_albums(artist_id)
        serializer = FullArtistDTOSerializer(albums)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({"message": "reached fetch_albums"})