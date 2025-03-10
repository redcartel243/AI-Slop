from django.urls import path
from . import views

app_name = 'games'

urlpatterns = [
    path('', views.GameListView.as_view(), name='game_list'),
    path('pong/', views.pong_game_view, name='pong'),
    path('<slug:slug>/', views.GameDetailView.as_view(), name='game_detail'),
] 