from django.urls import path
from . import views

app_name = 'projects'

urlpatterns = [
    path('', views.project_list, name='project_list'),
    path('submit/', views.submit_project, name='submit_project'),
    path('my-projects/', views.my_projects, name='my_projects'),
    path('edit/<slug:slug>/', views.edit_project, name='edit_project'),
    path('delete/<slug:slug>/', views.delete_project, name='delete_project'),
    path('<slug:slug>/', views.project_detail, name='project_detail'),
] 