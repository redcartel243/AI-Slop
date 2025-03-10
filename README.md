# AI Slop

A modern web platform for showcasing AI-assisted projects with a futuristic cyberpunk design.

![AI Slop Screenshot](static/images/screenshot.jpg)

## About

AI Slop is a Django-based website where users can share and discover projects built with AI assistance. The platform features a sleek, futuristic UI with interactive animations and a collection of mini-games.

## Features

- **Project Showcase**: Browse and share AI-assisted projects
- **User Authentication**: Register, login, and manage your profile
- **Blog System**: Read and write articles about AI technology
- **Mini-Games**: Play retro games like Pong with AI opponents
- **Responsive Design**: Works on desktop and mobile devices

## Mini-Games

Take a break and enjoy our browser-based game:

- **Pong**: The classic arcade game with adjustable AI difficulty

## Getting Started

### Prerequisites

- Python 3.8+
- Django 5.1+
- Other dependencies in requirements.txt

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ai-slop.git
   cd ai-slop
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Run migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Start the development server:
   ```
   python manage.py runserver
   ```

7. Visit http://127.0.0.1:8000/ in your browser

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 