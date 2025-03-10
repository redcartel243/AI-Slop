from django.shortcuts import render, get_object_or_404, redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db import transaction
from django.utils.text import slugify
from django.utils import timezone

from .models import Project, AITool
from .forms import ProjectSubmissionForm, ProjectImageFormSet
from taggit.models import Tag

def project_list(request):
    """View for listing all projects"""
    projects_list = Project.objects.filter(status='approved')
    
    # Filter by AI tool if specified
    ai_tool_slug = request.GET.get('tool')
    if ai_tool_slug:
        ai_tool = get_object_or_404(AITool, name__iexact=ai_tool_slug)
        projects_list = projects_list.filter(ai_tools=ai_tool)
    
    # Filter by technology tag if specified
    tag_slug = request.GET.get('tag')
    if tag_slug:
        tag = get_object_or_404(Tag, slug=tag_slug)
        projects_list = projects_list.filter(technologies__in=[tag])
    
    # Pagination
    paginator = Paginator(projects_list, 9)  # 9 projects per page
    page = request.GET.get('page')
    
    try:
        projects = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer, deliver first page
        projects = paginator.page(1)
    except EmptyPage:
        # If page is out of range, deliver last page of results
        projects = paginator.page(paginator.num_pages)
    
    # Get all AI tools and tags for filtering
    ai_tools = AITool.objects.all()
    tags = Tag.objects.all()
    
    context = {
        'projects': projects,
        'ai_tools': ai_tools,
        'tags': tags,
        'current_tool': ai_tool_slug,
        'current_tag': tag_slug,
    }
    
    return render(request, 'projects/project_list.html', context)

def project_detail(request, slug):
    """View for displaying a single project"""
    project = get_object_or_404(Project, slug=slug, status='approved')
    
    # Get related projects based on AI tools or technologies
    related_projects = Project.objects.filter(ai_tools__in=project.ai_tools.all(), status='approved').exclude(id=project.id).distinct()[:3]
    
    context = {
        'project': project,
        'related_projects': related_projects,
    }
    
    return render(request, 'projects/project_detail.html', context)

@login_required
def submit_project(request):
    """View for users to submit a new project"""
    if request.method == 'POST':
        form = ProjectSubmissionForm(request.POST, request.FILES)
        formset = ProjectImageFormSet(request.POST, request.FILES)
        
        if form.is_valid() and formset.is_valid():
            with transaction.atomic():
                # Create project but don't save to DB yet
                project = form.save(commit=False)
                project.user = request.user
                project.status = 'pending'
                
                # Generate a unique slug
                base_slug = slugify(project.title)
                slug = base_slug
                counter = 1
                while Project.objects.filter(slug=slug).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                project.slug = slug
                
                # Save the project
                project.save()
                
                # Save the many-to-many fields
                form.save_m2m()
                
                # Clear existing AI tools and add the selected ones
                project.ai_tools.clear()
                ai_tools_list = form.cleaned_data.get('ai_tools_list')
                if ai_tools_list:
                    for tool in ai_tools_list:
                        project.ai_tools.add(tool)
                
                # Process new AI tool if provided
                new_ai_tool_name = form.cleaned_data.get('new_ai_tool')
                if new_ai_tool_name:
                    new_tool, created = AITool.objects.get_or_create(
                        name=new_ai_tool_name,
                        defaults={
                            'website': form.cleaned_data.get('new_ai_tool_website', '')
                        }
                    )
                    project.ai_tools.add(new_tool)
                
                # Save additional images
                formset.instance = project
                formset.save()
            
            messages.success(request, "Your project has been submitted for approval. You will be notified once it's reviewed.")
            return redirect('projects:my_projects')
    else:
        form = ProjectSubmissionForm()
        formset = ProjectImageFormSet()
    
    context = {
        'form': form,
        'formset': formset,
        'title': 'Submit a New Project'
    }
    
    return render(request, 'projects/submit_project.html', context)

@login_required
def edit_project(request, slug):
    """View for users to edit their submitted project"""
    project = get_object_or_404(Project, slug=slug, user=request.user)
    
    # Only allow editing if the project is pending or rejected
    if project.status == 'approved':
        messages.error(request, "Approved projects cannot be edited.")
        return redirect('projects:my_projects')
    
    if request.method == 'POST':
        form = ProjectSubmissionForm(request.POST, request.FILES, instance=project)
        formset = ProjectImageFormSet(request.POST, request.FILES, instance=project)
        
        if form.is_valid() and formset.is_valid():
            with transaction.atomic():
                # Update project
                project = form.save(commit=False)
                project.status = 'pending'  # Reset to pending when edited
                project.save()
                
                # Save the many-to-many fields
                form.save_m2m()
                
                # Clear existing AI tools and add the selected ones
                project.ai_tools.clear()
                ai_tools_list = form.cleaned_data.get('ai_tools_list')
                if ai_tools_list:
                    for tool in ai_tools_list:
                        project.ai_tools.add(tool)
                
                # Process new AI tool if provided
                new_ai_tool_name = form.cleaned_data.get('new_ai_tool')
                if new_ai_tool_name:
                    new_tool, created = AITool.objects.get_or_create(
                        name=new_ai_tool_name,
                        defaults={
                            'website': form.cleaned_data.get('new_ai_tool_website', '')
                        }
                    )
                    project.ai_tools.add(new_tool)
                
                # Save additional images
                formset.save()
            
            messages.success(request, "Your project has been updated and submitted for approval.")
            return redirect('projects:my_projects')
    else:
        form = ProjectSubmissionForm(instance=project)
        formset = ProjectImageFormSet(instance=project)
        
        # Set initial values for custom fields
        form.fields['ai_tools_list'].initial = project.ai_tools.all()
    
    context = {
        'form': form,
        'formset': formset,
        'project': project,
        'title': 'Edit Project'
    }
    
    return render(request, 'projects/submit_project.html', context)

@login_required
def delete_project(request, slug):
    """View for users to delete their submitted project"""
    project = get_object_or_404(Project, slug=slug, user=request.user)
    
    # Only allow deletion if the project is pending or rejected
    if project.status == 'approved':
        messages.error(request, "Approved projects cannot be deleted.")
        return redirect('projects:my_projects')
    
    if request.method == 'POST':
        project.delete()
        messages.success(request, "Your project has been deleted.")
        return redirect('projects:my_projects')
    
    context = {
        'project': project
    }
    
    return render(request, 'projects/delete_project.html', context)

@login_required
def my_projects(request):
    """View for users to see their submitted projects"""
    projects_list = Project.objects.filter(user=request.user)
    
    # Pagination
    paginator = Paginator(projects_list, 9)
    page = request.GET.get('page')
    
    try:
        projects = paginator.page(page)
    except PageNotAnInteger:
        projects = paginator.page(1)
    except EmptyPage:
        projects = paginator.page(paginator.num_pages)
    
    context = {
        'projects': projects,
    }
    
    return render(request, 'projects/my_projects.html', context)
