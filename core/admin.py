from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Profile

class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'Profile'
    fk_name = 'user'

class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'get_email_verified')
    list_filter = BaseUserAdmin.list_filter + ('profile__email_verified',)
    
    def get_email_verified(self, obj):
        return obj.profile.email_verified
    get_email_verified.short_description = 'Email Verified'
    get_email_verified.boolean = True

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'email_verified')
    list_filter = ('email_verified',)
    search_fields = ('user__username', 'user__email')
