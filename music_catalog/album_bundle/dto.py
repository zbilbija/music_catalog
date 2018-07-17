
#TODO: finish when you see what the album_tracks method returns
class SimpleTrackDTO:
    id = ""
    name = ""
    duration = -1
    number = -1

    def __init__(self, id, name, duration, number):
        self.id = id
        self.name = name
        self.duration = duration
        self.number = number

class ImageDTO:
    url = ""
    width = -1
    height = -1

    def __init__(self, url, width, height):
        self.url = url
        self.width = width
        self.height = height

class FullAlbumDTO:
    id = ""
    name = ""
    image = ImageDTO
    artist_name = ""
    tracks = []

    def __init__(self, id, name, image, artist_name, tracks):
        self.id = id
        self.name = name
        self.image = image
        self.artist_name = artist_name
        self.tracks = tracks


