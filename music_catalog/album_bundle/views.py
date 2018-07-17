from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse,JsonResponse
from django.utils.six import BytesIO
from rest_framework.parsers import JSONParser
from album_bundle.service import AlbumService
from album_bundle.serializers import FullAlbumDTOSerializer

# Create your views here.
@csrf_exempt
def fetch_album(request):
    if request.method == "POST":
        stream = BytesIO(request.body)
        data = JSONParser().parse(stream)
        print(data)
        print("\n")
        album_service = AlbumService(data['username'])
        album = album_service.tracks_for_album(data['albumId'])
        serializer = FullAlbumDTOSerializer(album)
        return JsonResponse(serializer.data, safe=False)
    else:
        return JsonResponse({"message": "called fetch albums"})
        