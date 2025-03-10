from django.contrib import admin
from .models import Game

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'created_date', 'is_active', 'featured')
    list_filter = ('category', 'is_active', 'featured')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
