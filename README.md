# AI Slop - Showcase Your AI-Assisted Projects

AI Slop is a Django-based website designed to showcase projects built with AI assistance. The platform highlights the collaboration between humans and AI tools, demonstrating how they can work together to create amazing projects.

## Features

- **Project Showcase**: Display your AI-assisted projects with detailed information about the human and AI contributions.
- **Blog/Insights**: Share your learnings and experiences about working with AI tools.
- **Filtering**: Filter projects by AI tools used or technologies implemented.
- **Responsive Design**: Modern, mobile-friendly interface that looks great on all devices.
- **SEO Optimized**: Built with search engine optimization in mind.

## Tech Stack

- **Backend**: Django 5.1.7
- **Frontend**: Bootstrap 5, HTML5, CSS3, JavaScript
- **Database**: SQLite (development) / PostgreSQL (production recommended)
- **Rich Text Editing**: CKEditor
- **Image Handling**: Pillow
- **Tagging System**: django-taggit
- **Static Files**: Whitenoise
- **Deployment**: Vercel (recommended)

## Installation

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd ai-slop
   ```

2. **Create and activate a virtual environment**:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```
   pip install -r requirements.txt
   ```

4. **Run migrations**:
   ```
   python manage.py migrate
   ```

5. **Create a superuser**:
   ```
   python manage.py createsuperuser
   ```

6. **Run the development server**:
   ```
   python manage.py runserver
   ```

7. **Access the site**:
   - Frontend: http://127.0.0.1:8000/
   - Admin: http://127.0.0.1:8000/admin/

## Adding Content

### Adding AI Tools

1. Log in to the admin panel
2. Go to "AI Tools" and click "Add AI Tool"
3. Fill in the name, description, and website URL
4. Save the tool

### Adding Projects

1. Log in to the admin panel
2. Go to "Projects" and click "Add Project"
3. Fill in all the required information:
   - Title and slug
   - Description and content
   - Featured image
   - AI tools used
   - Human and AI contributions
   - Technologies used (tags)
   - GitHub and live demo links
   - Challenges and learnings
4. Add additional project images if needed
5. Save the project

### Adding Blog Posts

1. Log in to the admin panel
2. Go to "Categories" and add categories if needed
3. Go to "Posts" and click "Add Post"
4. Fill in all the required information:
   - Title and slug
   - Category
   - Content
   - Featured image
   - Tags
5. Save the post

## Deployment

### Deploying to Vercel

1. Install Vercel CLI:
   ```
   npm i -g vercel
   ```

2. Create a `vercel.json` file in the project root:
   ```json
   {
     "builds": [
       {
         "src": "ai_slop/wsgi.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "ai_slop/wsgi.py"
       }
     ]
   }
   ```

3. Deploy:
   ```
   vercel
   ```

## Customization

### Styling

- Custom CSS is located in `static/css/style.css`
- You can modify the color scheme by changing the CSS variables in the `:root` selector

### Templates

- Base template: `templates/base.html`
- Homepage: `templates/core/home.html`
- Projects: `templates/projects/`
- Blog: `templates/blog/`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Bootstrap for the responsive framework
- Django for the powerful backend
- All the AI tools that helped build the projects showcased on this site 