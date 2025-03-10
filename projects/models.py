from django.db import models
from django.urls import reverse
from django.contrib.auth.models import User
from taggit.managers import TaggableManager
from ckeditor.fields import RichTextField
from django.utils.text import slugify

class AITool(models.Model):
    """Model for AI tools used in projects"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    website = models.URLField(blank=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

class Project(models.Model):
    """Model for AI-assisted projects"""
    STATUS_CHOICES = (
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=200, unique=True)
    description = models.TextField()
    content = RichTextField()
    featured_image = models.ImageField(upload_to='projects/%Y/%m/%d/', blank=True)
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    is_featured = models.BooleanField(default=False)
    
    # Project details
    ai_tools = models.ManyToManyField(AITool, related_name='projects')
    human_contribution = models.TextField(help_text="Describe your contribution to the project")
    ai_contribution = models.TextField(help_text="Describe the AI's contribution to the project")
    technologies = TaggableManager(help_text="Technologies used in the project")
    
    # Links
    github_link = models.URLField(blank=True, help_text="Link to GitHub repository")
    live_link = models.URLField(blank=True, help_text="Link to live demo")
    
    # Challenges and learnings
    challenges = models.TextField(blank=True, help_text="Challenges faced during development")
    learnings = models.TextField(blank=True, help_text="What you learned from this project")
    
    # User and approval status
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    approval_date = models.DateField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True)
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('projects:project_detail', args=[self.slug])
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    class Meta:
        ordering = ['-created_date']

class ProjectImage(models.Model):
    """Model for additional project images"""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/gallery/%Y/%m/%d/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"Image for {self.project.title}"
    
    class Meta:
        ordering = ['order']
