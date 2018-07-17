import datetime

class SpotifyTokenHolder:
    token = ""
    date_generated = datetime.datetime.utcnow()
    
    def __init__(self, token, date_generated):
        self.token = token
        self.date_generated = date_generated