from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Post, Category
from taggit.models import Tag

def post_list(request):
    """View for listing all blog posts"""
    posts_list = Post.objects.filter(is_published=True)
    
    # Filter by category if specified
    category_slug = request.GET.get('category')
    if category_slug:
        category = get_object_or_404(Category, slug=category_slug)
        posts_list = posts_list.filter(category=category)
    
    # Filter by tag if specified
    tag_slug = request.GET.get('tag')
    if tag_slug:
        tag = get_object_or_404(Tag, slug=tag_slug)
        posts_list = posts_list.filter(tags__in=[tag])
    
    # Pagination
    paginator = Paginator(posts_list, 6)  # 6 posts per page
    page = request.GET.get('page')
    
    try:
        posts = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page
        posts = paginator.page(1)
    except EmptyPage:
        # If page is out of range, deliver last page of results
        posts = paginator.page(paginator.num_pages)
    
    # Get all categories and tags for filtering
    categories = Category.objects.all()
    tags = Tag.objects.all()
    
    context = {
        'posts': posts,
        'categories': categories,
        'tags': tags,
        'current_category': category_slug,
        'current_tag': tag_slug,
    }
    
    return render(request, 'blog/post_list.html', context)

def post_detail(request, slug):
    """View for displaying a single blog post"""
    post = get_object_or_404(Post, slug=slug, is_published=True)
    
    # Get related posts based on category or tags
    related_posts = Post.objects.filter(category=post.category).exclude(id=post.id)[:3]
    
    context = {
        'post': post,
        'related_posts': related_posts,
    }
    
    return render(request, 'blog/post_detail.html', context)

def category_posts(request, slug):
    """View for displaying posts by category"""
    category = get_object_or_404(Category, slug=slug)
    return post_list(request)
