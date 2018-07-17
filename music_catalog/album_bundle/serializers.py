from rest_framework import serializers
from album_bundle.dto import SimpleTrackDTO,FullAlbumDTO, ImageDTO

class SimpleTrackDTOSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    duration = serializers.IntegerField()
    number = serializers.IntegerField()

    class Meta:
        model = SimpleTrackDTO
        fields = ('id', 'name', 'duration', 'number')

class ImageDTOSerializer(serializers.Serializer):
    url = serializers.CharField()
    width = serializers.IntegerField()
    height = serializers.IntegerField()

    class Meta:
        model = ImageDTO
        fields = ('url', 'width', 'height')

class FullAlbumDTOSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    image = ImageDTOSerializer()
    artistName = serializers.CharField(source="artist_name")
    tracks = SimpleTrackDTOSerializer(many=True)

    class Meta:
        model = FullAlbumDTO
        fields = ('id', 'name', 'image', 'artist_name', 'tracks')

