from library_bundle.dto import TrackDTO, ArtistDTO, SimpleAlbumDTO, CurrentTrackDTO
from rest_framework import serializers

class ArtistDTOSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()

    class Meta:
        model = ArtistDTO
        fields = ("id", "name")

class SimpleAlbumDTOSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()

    class Meta:
        model = SimpleAlbumDTO
        fields = ("id", "name")

class TrackDTOSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    artist = ArtistDTOSerializer()
    album = SimpleAlbumDTOSerializer()

    class Meta:
        model = TrackDTO
        fields = ("id","name", 'artist', 'album')

class CurrentTrackDTOSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()
    isPlaying = serializers.BooleanField(source="is_playing")
    duration = serializers.IntegerField()
    progressIn = serializers.IntegerField(source='progress_in')
    image = serializers.CharField()
    artist = ArtistDTOSerializer()
    album = SimpleAlbumDTOSerializer()

    class Meta:
        model = CurrentTrackDTO
        fields = ('id', 'name', 'is_playing', 'duration', 'progress_in', 'image', 'artist', 'album')