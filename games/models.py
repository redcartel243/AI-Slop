from django.db import models
from django.utils.text import slugify

class Game(models.Model):
    """Model for mini games in the AI Slop website"""
    
    CATEGORY_CHOICES = (
        ('retro', 'Retro'),
        ('arcade', 'Arcade'),
        ('puzzle', 'Puzzle'),
        ('action', 'Action'),
        ('strategy', 'Strategy'),
        ('other', 'Other'),
    )
    
    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField()
    instructions = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='other')
    thumbnail = models.ImageField(upload_to='games/thumbnails/', blank=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    featured = models.BooleanField(default=False)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ['-created_date']
