# AI Slop

A modern web platform for showcasing AI-assisted projects with a futuristic cyberpunk design.

![AI Slop Screenshot](static/images/screenshot.jpg)

## About

AI Slop is a Django-based website where users can share and discover projects built with AI assistance. The platform features a sleek, futuristic UI with interactive animations and a collection of mini-games.

## Features

- **Project Showcase**: Browse and share AI-assisted projects
- **User Authentication**: Register, login, and manage your profile
- **Blog System**: Read and write articles about AI technology
- **Mini-Games**: Play retro games like Pong with AI opponents or other players in real-time
- **Responsive Design**: Works on desktop and mobile devices

## Mini-Games

Take a break and enjoy our browser-based games:

- **Pong (Single Player)**: The classic arcade game with adjustable AI difficulty
- **Pong (Multiplayer)**: Play against other players in real-time via WebSockets

### Multiplayer Pong Features

- **Real-time Gameplay**: Experience smooth, responsive gameplay using WebSockets
- **Matchmaking System**: Find opponents automatically or create private game rooms
- **No Registration Required**: Jump straight into matches without creating an account
- **Spectator Mode**: Watch ongoing games between other players
- **Futuristic UI**: Enjoy a cyberpunk-inspired game interface with neon effects

## Technical Implementation

- **Django Channels**: WebSocket support for real-time communication
- **Asynchronous Consumers**: Handle game state and player connections efficiently
- **In-memory Channel Layer**: Process game data with minimal latency
- **Canvas-based Rendering**: Smooth animations and responsive controls

## Getting Started

### Prerequisites

- Python 3.8+
- Django 5.1+
- Django Channels 4.0+
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

## Playing Multiplayer Pong

1. **Finding an Opponent**:
   - Visit `/games/pong/multiplayer/`
   - Click "Find Opponent" to enter the matchmaking queue
   - Wait for another player to join the queue
   - Once matched, you'll be automatically redirected to a game room

2. **Private Games**:
   - Create a private room by clicking "Create Room"
   - Share the generated room code with a friend
   - Your friend can join by entering the code and clicking "Join Room"

3. **In the Game Room**:
   - When both players are connected, click "I'M READY" to indicate you're ready to play
   - Once both players are ready, the game will start automatically
   - Use your mouse or arrow keys to move your paddle
   - First player to reach 10 points wins
   - After a game ends, you can click "PLAY AGAIN" to start a new match

## Contributing

Contributions are welcome! Feel free to submit a pull request or open an issue.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 