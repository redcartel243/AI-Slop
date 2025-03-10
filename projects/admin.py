from django.contrib import admin
from django.utils import timezone
from django.utils.html import format_html
from django.urls import reverse, path
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.db.models import Case, When, Value, IntegerField
from .models import AITool, Project, ProjectImage

class ProjectStatusFilter(admin.SimpleListFilter):
    """Custom filter to highlight pending projects"""
    title = 'Status'
    parameter_name = 'status__exact'
    
    def lookups(self, request, model_admin):
        return (
            ('pending', 'Pending Approval ⚠️'),
            ('approved', 'Approved ✅'),
            ('rejected', 'Rejected ❌'),
        )
    
    def queryset(self, request, queryset):
        if self.value():
            return queryset.filter(status=self.value())
        return queryset

class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1

@admin.register(AITool)
class AIToolAdmin(admin.ModelAdmin):
    list_display = ('name', 'website')
    search_fields = ('name',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'user', 'created_date', 'status_colored', 'is_featured', 'approval_date')
    list_filter = (ProjectStatusFilter, 'is_featured', 'created_date', 'ai_tools')
    search_fields = ('title', 'description', 'user__username')
    prepopulated_fields = {'slug': ('title',)}
    date_hierarchy = 'created_date'
    inlines = [ProjectImageInline]
    filter_horizontal = ('ai_tools',)
    actions = ['approve_projects', 'reject_projects']
    
    def status_colored(self, obj):
        colors = {
            'pending': '#f39c12',  # Orange
            'approved': '#28a745',  # Green
            'rejected': '#dc3545',  # Red
        }
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            colors.get(obj.status, 'black'),
            obj.get_status_display()
        )
    status_colored.short_description = 'Status'
    status_colored.admin_order_field = 'status'
    
    fieldsets = (
        (None, {
            'fields': ('title', 'slug', 'description', 'content', 'featured_image')
        }),
        ('Project Details', {
            'fields': ('ai_tools', 'human_contribution', 'ai_contribution', 'technologies')
        }),
        ('Links', {
            'fields': ('github_link', 'live_link')
        }),
        ('Challenges and Learnings', {
            'fields': ('challenges', 'learnings')
        }),
        ('Status', {
            'fields': ('user', 'status', 'approval_date', 'rejection_reason', 'is_featured')
        }),
    )
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'approve/<int:project_id>/',
                self.admin_site.admin_view(self.approve_project_view),
                name='approve_project',
            ),
            path(
                'reject/<int:project_id>/',
                self.admin_site.admin_view(self.reject_project_view),
                name='reject_project',
            ),
        ]
        return custom_urls + urls
    
    def approve_project_view(self, request, project_id):
        project = Project.objects.get(id=project_id)
        project.status = 'approved'
        project.approval_date = timezone.now().date()
        project.save()
        self.message_user(request, f"Project '{project.title}' has been approved.", messages.SUCCESS)
        return HttpResponseRedirect("../../?status__exact=pending")
    
    def reject_project_view(self, request, project_id):
        project = Project.objects.get(id=project_id)
        project.status = 'rejected'
        project.save()
        self.message_user(request, f"Project '{project.title}' has been rejected.", messages.WARNING)
        return HttpResponseRedirect("../../?status__exact=pending")
    
    def approve_projects(self, request, queryset):
        queryset.update(status='approved', approval_date=timezone.now().date())
        self.message_user(request, f"{queryset.count()} projects have been approved.")
    approve_projects.short_description = "Approve selected projects"
    
    def reject_projects(self, request, queryset):
        queryset.update(status='rejected')
        self.message_user(request, f"{queryset.count()} projects have been rejected.")
    reject_projects.short_description = "Reject selected projects"
    
    def get_list_display(self, request):
        list_display = list(super().get_list_display(request))
        if request.GET.get('status__exact') == 'pending':
            # Add action buttons when viewing pending projects
            if 'approve_reject_buttons' not in list_display:
                list_display.append('approve_reject_buttons')
        return list_display
    
    def approve_reject_buttons(self, obj):
        if obj.status == 'pending':
            approve_url = reverse('admin:approve_project', args=[obj.id])
            reject_url = reverse('admin:reject_project', args=[obj.id])
            return format_html(
                '<a href="{}" class="button" style="background-color: #28a745; color: white; margin-right: 5px;">Approve</a>'
                '<a href="{}" class="button" style="background-color: #dc3545; color: white;">Reject</a>',
                approve_url, reject_url
            )
        return ""
    approve_reject_buttons.short_description = "Actions"
    
    def get_queryset(self, request):
        # Get the base queryset
        qs = super().get_queryset(request)
        
        # If no filter is applied, prioritize pending projects at the top using Django's ORM
        if not request.GET.get('status__exact'):
            # Use Case/When to create a custom ordering that puts pending first
            qs = qs.annotate(
                status_order=Case(
                    When(status='pending', then=Value(0)),
                    When(status='approved', then=Value(1)),
                    When(status='rejected', then=Value(2)),
                    default=Value(3),
                    output_field=IntegerField(),
                )
            ).order_by('status_order', '-created_date')
        
        return qs

@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ('project', 'caption', 'order')
    list_filter = ('project',)
    search_fields = ('project__title', 'caption')
