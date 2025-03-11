from django.urls import path
from . import views

app_name = 'games'

urlpatterns = [
    path('', views.GameListView.as_view(), name='game_list'),
    path('pong/', views.pong_game_view, name='pong'),
    path('pong/multiplayer/', views.pong_multiplayer_view, name='pong_multiplayer'),
    path('pong/multiplayer/<str:room_id>/', views.pong_room_view, name='pong_room'),
    path('asteroid-dodger/', views.asteroid_dodger_view, name='asteroid_dodger'),
    path('<slug:slug>/', views.GameDetailView.as_view(), name='game_detail'),
] 