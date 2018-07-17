from album_bundle.dto import ImageDTO

class RelatedArtistDTO:
    id = ""
    name = ""
    image = ImageDTO

    def __init__(self, id, name, image):
        self.id = id
        self.name = name
        self.image = image

class FullArtistDTO:
    id = ""
    name = ""
    image = ImageDTO
    followers = -1
    albums = []
    top_tracks = []
    related_artists = []

    def __init__(self, id, name, image, followers, albums, top_tracks, related_artists):
        self.id = id
        self.name = name
        self.image = image
        self.followers = followers
        self.albums = albums
        self.top_tracks = top_tracks
        self.related_artists = related_artists
