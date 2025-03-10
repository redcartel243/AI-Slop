# AI Slop

![AI Slop Logo](static/images/favicon.ico)

## 🚀 About AI Slop

AI Slop is a modern web platform showcasing projects built with AI assistance, demonstrating the power of human-AI collaboration. The platform features a futuristic, cyberpunk-inspired design with advanced animations and interactive elements.

## ✨ Features

### 🏠 Home Page
- Animated hero section with parallax effects and a bouncing ball in a rotating tesseract
- Featured projects showcase with hover effects
- Latest projects and blog posts sections
- Call-to-action for project submissions

### 📁 Projects
- Browse projects by category or tag
- Detailed project pages with descriptions, images, and links
- Filter projects by AI tools used
- User project submission system

### 📝 Blog
- Latest insights about AI and technology
- Rich text content with images and code snippets
- Category and tag filtering

### 🎮 Mini-Games
- Built-in browser games with futuristic design
- **Pong**: Classic arcade game with AI opponent
  - Three difficulty levels (Easy, Medium, Hard)
  - Mouse or keyboard controls
  - Score tracking and win conditions
- More games coming soon (Tetris, Pac-Man, Chess)

### 👤 User System
- User registration and authentication
- Email verification
- Password reset functionality
- User profiles with project management
- Secure logout process

## 🎨 Design Elements

- **Cyberpunk Aesthetic**: Dark theme with neon accents
- **Interactive Animations**: Particle effects, glitch text, scanner effects
- **Futuristic UI**: Cyber cards, neon buttons, holographic elements
- **Responsive Design**: Fully responsive on all devices

## 🛠️ Technical Details

### Built With
- **Backend**: Django 5.1
- **Frontend**: HTML5, CSS3, JavaScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: Django's built-in auth system with custom extensions
- **Text Editor**: CKEditor for rich text content
- **Styling**: Custom CSS with Bootstrap 5 framework

### Key Components
- Custom user authentication flow with email verification
- Project submission and management system
- Canvas-based game implementations
- Advanced CSS animations and effects
- Responsive image handling

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip
- virtualenv (recommended)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ai_slop.git
   cd ai_slop
   ```

2. Create and activate a virtual environment
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```

4. Apply migrations
   ```bash
   python manage.py migrate
   ```

5. Create a superuser
   ```bash
   python manage.py createsuperuser
   ```

6. Run the development server
   ```bash
   python manage.py runserver
   ```

7. Visit `http://127.0.0.1:8000/` in your browser

## 📸 Screenshots

*[Add screenshots of key pages here]*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Django](https://www.djangoproject.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/)
- Special thanks to all contributors and the AI tools that helped build this project 