from django import forms
from django.core.validators import URLValidator
from .models import Project, ProjectImage, AITool
from taggit.forms import TagField

class ProjectSubmissionForm(forms.ModelForm):
    """Form for users to submit their AI-assisted projects"""
    
    # Custom fields
    technologies = TagField(
        help_text="Enter technologies separated by commas (e.g., Python, React, TensorFlow)",
        required=False
    )
    
    ai_tools_list = forms.ModelMultipleChoiceField(
        queryset=AITool.objects.all().order_by('name'),
        widget=forms.CheckboxSelectMultiple,
        required=True,
        help_text="Select the AI tools used in this project"
    )
    
    new_ai_tool = forms.CharField(
        max_length=100, 
        required=False,
        help_text="If the AI tool you used is not listed above, enter its name here"
    )
    
    new_ai_tool_website = forms.URLField(
        required=False,
        help_text="Website URL for the new AI tool (optional)"
    )
    
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'content', 'featured_image',
            'human_contribution', 'ai_contribution',
            'github_link', 'live_link', 'challenges', 'learnings'
        ]
        widgets = {
            'description': forms.Textarea(attrs={'rows': 3}),
            'human_contribution': forms.Textarea(attrs={'rows': 4}),
            'ai_contribution': forms.Textarea(attrs={'rows': 4}),
            'challenges': forms.Textarea(attrs={'rows': 4}),
            'learnings': forms.Textarea(attrs={'rows': 4}),
        }
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Make fields more user-friendly
        self.fields['title'].help_text = "The name of your project"
        self.fields['description'].help_text = "A brief summary of your project (max 200 words)"
        self.fields['content'].help_text = "Detailed description of your project"
        self.fields['featured_image'].help_text = "Main image for your project (recommended size: 1200x800px)"
        self.fields['github_link'].help_text = "Link to your GitHub repository (optional)"
        self.fields['live_link'].help_text = "Link to the live demo (optional)"
        
        # Add Bootstrap classes
        for field in self.fields:
            self.fields[field].widget.attrs.update({'class': 'form-control'})
        
        # Checkbox select doesn't need form-control class
        if 'ai_tools_list' in self.fields:
            self.fields['ai_tools_list'].widget.attrs.pop('class', None)
        
        # Set initial values for AI tools if editing an existing project
        if self.instance and self.instance.pk:
            self.fields['ai_tools_list'].initial = self.instance.ai_tools.all()
    
    def clean(self):
        cleaned_data = super().clean()
        new_ai_tool = cleaned_data.get('new_ai_tool')
        new_ai_tool_website = cleaned_data.get('new_ai_tool_website')
        ai_tools_list = cleaned_data.get('ai_tools_list')
        
        # Validate that at least one AI tool is selected or a new one is provided
        if not ai_tools_list and not new_ai_tool:
            self.add_error('ai_tools_list', "Please select at least one AI tool or provide a new one")
        
        # Validate that if a new AI tool website is provided, the tool name is also provided
        if new_ai_tool_website and not new_ai_tool:
            self.add_error('new_ai_tool', "Please provide the name of the new AI tool")
        
        # Validate URLs
        github_link = cleaned_data.get('github_link')
        live_link = cleaned_data.get('live_link')
        
        url_validator = URLValidator()
        
        if github_link:
            try:
                url_validator(github_link)
            except forms.ValidationError:
                self.add_error('github_link', "Please enter a valid URL")
        
        if live_link:
            try:
                url_validator(live_link)
            except forms.ValidationError:
                self.add_error('live_link', "Please enter a valid URL")
        
        return cleaned_data

class ProjectImageForm(forms.ModelForm):
    """Form for additional project images"""
    
    class Meta:
        model = ProjectImage
        fields = ['image', 'caption']
        widgets = {
            'caption': forms.TextInput(attrs={'class': 'form-control'}),
        }

ProjectImageFormSet = forms.inlineformset_factory(
    Project, 
    ProjectImage,
    form=ProjectImageForm,
    extra=3,
    max_num=5,
    can_delete=True
) 