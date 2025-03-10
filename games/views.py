from django.shortcuts import render, get_object_or_404, redirect
from django.views.generic import ListView, DetailView
from django.http import Http404
from .models import Game
from .consumers import active_games

# Create your views here.

class GameListView(ListView):
    """View to display all available games"""
    model = Game
    template_name = 'games/game_list.html'
    context_object_name = 'games'
    
    def get_queryset(self):
        return Game.objects.filter(is_active=True)
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['featured_games'] = Game.objects.filter(featured=True, is_active=True)
        context['pong_featured'] = True  # Flag to avoid showing Pong twice
        return context

class GameDetailView(DetailView):
    """View to display a specific game"""
    model = Game
    template_name = 'games/game_detail.html'
    context_object_name = 'game'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context

def pong_game_view(request):
    """View for the single-player Pong game against AI"""
    return render(request, 'games/pong.html', {
        'title': 'Pong',
        'description': 'Play the classic Pong game against an AI opponent!',
        'instructions': 'Use the mouse or up/down arrow keys to move your paddle. First to 10 points wins!'
    })

def pong_multiplayer_view(request):
    """View for the multiplayer Pong matchmaking page"""
    return render(request, 'games/pong_multiplayer.html', {
        'title': 'Multiplayer Pong',
        'description': 'Play Pong against other players online!',
        'instructions': 'Join the matchmaking queue to find an opponent, or create a private game to play with a friend.'
    })

def pong_room_view(request, room_id):
    """View for a specific Pong game room"""
    # Check if the room exists
    if room_id not in active_games and not room_id.startswith('pong_'):
        # If this is a private game that hasn't been created yet, initialize it
        if room_id.isalnum() and len(room_id) <= 16:  # Simple validation for room IDs
            return render(request, 'games/pong_room.html', {
                'title': 'Multiplayer Pong',
                'room_id': room_id,
                'is_new_room': True,
                'description': 'Play Pong against another player!',
                'instructions': 'Use the mouse or up/down arrow keys to move your paddle. First to 10 points wins!'
            })
        else:
            # Invalid room ID format
            return redirect('games:pong_multiplayer')
    
    return render(request, 'games/pong_room.html', {
        'title': 'Multiplayer Pong',
        'room_id': room_id,
        'is_new_room': False,
        'description': 'Play Pong against another player!',
        'instructions': 'Use the mouse or up/down arrow keys to move your paddle. First to 10 points wins!'
    })
