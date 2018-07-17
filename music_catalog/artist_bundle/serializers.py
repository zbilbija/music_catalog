from artist_bundle.dto import FullArtistDTO
from album_bundle.serializers import ImageDTOSerializer, FullAlbumDTOSerializer, SimpleTrackDTOSerializer
from rest_framework import serializers

class FullArtistDTOSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    image = ImageDTOSerializer()
    followers = serializers.IntegerField()
    albums = FullAlbumDTOSerializer(many=True)
    topTracks = SimpleTrackDTOSerializer(many=True, source='top_tracks')

    class Meta:
        model = FullArtistDTO
        fields = ('id', 'name', 'image', 'followers', 'albums', 'top_tracks')