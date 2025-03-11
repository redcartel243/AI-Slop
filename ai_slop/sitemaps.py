from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from games.models import Game

class StaticViewSitemap(Sitemap):
    priority = 0.5
    changefreq = 'weekly'

    def items(self):
        return ['core:home', 'core:about', 'core:contact', 'games:game_list']

    def location(self, item):
        return reverse(item)

class GamesSitemap(Sitemap):
    priority = 0.7
    changefreq = 'daily'

    def items(self):
        return ['games:pong', 'games:pong_multiplayer', 'games:asteroid_dodger']
    
    def location(self, item):
        return reverse(item) 