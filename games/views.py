from django.shortcuts import render, get_object_or_404
from django.views.generic import ListView, DetailView
from .models import Game

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
    """Special view for the Pong game"""
    return render(request, 'games/pong.html', {
        'title': 'Pong',
        'description': 'Play the classic Pong game against an AI opponent!',
        'instructions': 'Use the mouse or up/down arrow keys to move your paddle. First to 10 points wins!'
    })
