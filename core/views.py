from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.contrib.auth.views import LoginView
from django.urls import reverse_lazy
from django.views.generic import CreateView
from django.contrib.auth.models import User
from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from django.conf import settings
from django.contrib.auth.decorators import login_required

from projects.models import Project
from blog.models import Post
from .forms import CustomUserCreationForm, CustomAuthenticationForm
from .models import Profile

def home(request):
    """View for the homepage"""
    # Get featured projects
    featured_projects = Project.objects.filter(is_featured=True, status='approved')[:3]
    
    # Get latest projects
    latest_projects = Project.objects.filter(status='approved')[:6]
    
    # Get latest blog posts
    latest_posts = Post.objects.filter(is_published=True)[:3]
    
    context = {
        'featured_projects': featured_projects,
        'latest_projects': latest_projects,
        'latest_posts': latest_posts,
    }
    
    return render(request, 'core/home.html', context)

class CustomLoginView(LoginView):
    """Custom login view with styled form"""
    form_class = CustomAuthenticationForm
    template_name = 'core/login.html'
    redirect_authenticated_user = True
    
    def get_success_url(self):
        next_url = self.request.GET.get('next')
        if next_url:
            return next_url
        return reverse_lazy('core:home')
    
    def form_valid(self, form):
        messages.success(self.request, "You have successfully logged in.")
        return super().form_valid(form)

class RegisterView(CreateView):
    """View for user registration"""
    form_class = CustomUserCreationForm
    template_name = 'core/register.html'
    success_url = reverse_lazy('core:home')
    
    def form_valid(self, form):
        # Save the user but don't log them in yet
        user = form.save()
        
        # Send verification email
        self.send_verification_email(user)
        
        # Show success message
        messages.success(
            self.request, 
            f"Account created successfully! Please check your email to verify your account."
        )
        
        return redirect(self.success_url)
    
    def send_verification_email(self, user):
        """Send an email verification link to the user"""
        current_site = get_current_site(self.request)
        mail_subject = 'Activate your AI Slop account'
        message = render_to_string('core/account_verification_email.html', {
            'user': user,
            'domain': current_site.domain,
            'uid': urlsafe_base64_encode(force_bytes(user.pk)),
            'token': user.profile.email_verification_token,
            'site_name': settings.SITE_NAME,
            'protocol': 'https' if self.request.is_secure() else 'http',
        })
        email = EmailMessage(
            mail_subject, message, to=[user.email]
        )
        email.send()
    
    def get(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('core:home')
        return super().get(request, *args, **kwargs)

def verify_email(request, uidb64, token):
    """View to verify user's email address"""
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    
    if user is not None and str(user.profile.email_verification_token) == token:
        # Mark email as verified
        user.profile.email_verified = True
        user.profile.save()
        
        # Log the user in
        login(request, user)
        
        messages.success(request, "Your email has been verified! Your account is now active.")
        return redirect('core:home')
    else:
        messages.error(request, "The verification link is invalid or has expired.")
        return redirect('core:home')

@login_required
def profile_view(request):
    """View for user profile"""
    user_projects = Project.objects.filter(user=request.user)
    
    context = {
        'user': request.user,
        'projects': user_projects,
    }
    
    return render(request, 'core/profile.html', context)
