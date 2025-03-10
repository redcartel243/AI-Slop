from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/games/pong/(?P<room_id>\w+)/$', consumers.PongConsumer.as_asgi()),
    re_path(r'ws/games/pong/matchmaking/$', consumers.MatchmakingConsumer.as_asgi()),
] 