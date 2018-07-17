from album_bundle.dto import ImageDTO

class FullArtistDTO:
    id = ""
    name = ""
    image = ImageDTO
    followers = -1
    albums = []
    top_tracks = []

    def __init__(self, id, name, image, followers, albums, top_tracks):
        self.id = id
        self.name = name
        self.image = image
        self.followers = followers
        self.albums = albums
        self.top_tracks = top_tracks
