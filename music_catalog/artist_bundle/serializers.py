from artist_bundle.dto import FullArtistDTO, RelatedArtistDTO
from album_bundle.serializers import ImageDTOSerializer, FullAlbumDTOSerializer, SimpleTrackDTOSerializer
from rest_framework import serializers

class RelatedArtistDTOSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    image = ImageDTOSerializer()

    class Meta:
        model = RelatedArtistDTO
        fields = ('id', 'name', 'image')

class FullArtistDTOSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    image = ImageDTOSerializer()
    followers = serializers.IntegerField()
    albums = FullAlbumDTOSerializer(many=True)
    topTracks = SimpleTrackDTOSerializer(many=True, source='top_tracks')
    relatedArtists = RelatedArtistDTOSerializer(many=True, source='related_artists')

    class Meta:
        model = FullArtistDTO
        fields = ('id', 'name', 'image', 'followers', 'albums', 'top_tracks', 'related_artists')