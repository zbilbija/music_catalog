class ArtistDTO:
    id = -1
    name = ""

    def __init__(self, id, name):
        self.id = id
        self.name = name

class SimpleAlbumDTO:
    id = -1
    name= ""

    def __init__(self, id, name):
        self.id = id
        self.name = name

class CurrentTrackDTO:
    id = ""
    name = ""
    is_playing = False
    duration = -1
    progress_in = -1
    image = ""
    artist = ArtistDTO
    album = SimpleAlbumDTO

    def __init__(self, id, name, is_playing, duration, progress_in, image, artist, album):
        self.id = id
        self.name = name
        self.is_playing = is_playing
        self.duration = duration
        self.progress_in = progress_in
        self.image = image
        self.artist = artist
        self.album = album


class TrackDTO:
    id = -1
    name = ""
    artist = ArtistDTO
    album = SimpleAlbumDTO


    def __init__(self, id, name, artist, album):
        self.id = id
        self.name = name
        self.artist = artist
        self.album = album