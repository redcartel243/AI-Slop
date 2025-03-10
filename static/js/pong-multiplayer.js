/**
 * Multiplayer Pong Game
 * This file contains the core game logic for the multiplayer pong game
 */

class PongGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Game objects
        this.ball = {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2,
            radius: 10,
            speedX: 5,
            speedY: 5,
            color: '#00f0ff'
        };
        
        this.player1 = {
            x: 30,
            y: this.canvas.height / 2 - 50,
            width: 10,
            height: 100,
            color: '#00f0ff',
            score: 0
        };
        
        this.player2 = {
            x: this.canvas.width - 40,
            y: this.canvas.height / 2 - 50,
            width: 10,
            height: 100,
            color: '#ff00c8',
            score: 0
        };
        
        // Game state
        this.gameRunning = false;
        this.animationFrameId = null;
    }
    
    // Drawing functions
    drawRect(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x, y, width, height);
    }
    
    drawCircle(x, y, radius, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawNet() {
        for (let i = 0; i < this.canvas.height; i += 40) {
            this.drawRect(this.canvas.width / 2 - 1, i, 2, 20, 'rgba(0, 240, 255, 0.5)');
        }
    }
    
    drawGlow(x, y, radius, color) {
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 2, 0, Math.PI * 2, false);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw net
        this.drawNet();
        
        // Draw ball glow
        this.drawGlow(this.ball.x, this.ball.y, this.ball.radius, 'rgba(0, 240, 255, 0.2)');
        
        // Draw ball
        this.drawCircle(this.ball.x, this.ball.y, this.ball.radius, this.ball.color);
        
        // Draw paddles
        this.drawRect(this.player1.x, this.player1.y, this.player1.width, this.player1.height, this.player1.color);
        this.drawRect(this.player2.x, this.player2.y, this.player2.width, this.player2.height, this.player2.color);
        
        // Add grid effect
        this.drawGrid();
    }
    
    updateBall() {
        // Move the ball
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;
        
        // Ball collision with top and bottom walls
        if (this.ball.y - this.ball.radius < 0 || this.ball.y + this.ball.radius > this.canvas.height) {
            this.ball.speedY = -this.ball.speedY;
            
            // Add slight randomness to bounce
            this.ball.speedY += (Math.random() * 2 - 1) * 0.5;
        }
        
        // Determine which paddle to check based on ball direction
        let paddle = this.ball.speedX < 0 ? this.player1 : this.player2;
        
        // Check for paddle collision
        if (
            this.ball.x - this.ball.radius < paddle.x + paddle.width && 
            this.ball.x + this.ball.radius > paddle.x && 
            this.ball.y > paddle.y && 
            this.ball.y < paddle.y + paddle.height
        ) {
            // Reverse ball direction
            this.ball.speedX = -this.ball.speedX;
            
            // Adjust ball angle based on where it hit the paddle
            const hitPosition = (this.ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
            this.ball.speedY = hitPosition * 6;
            
            // Increase speed slightly with each hit
            this.ball.speedX *= 1.05;
            if (Math.abs(this.ball.speedX) > 15) {
                this.ball.speedX = (this.ball.speedX > 0) ? 15 : -15;
            }
        }
        
        return {
            scored: false,
            scorer: null
        };
    }
    
    resetBall() {
        this.ball.x = this.canvas.width / 2;
        this.ball.y = this.canvas.height / 2;
        
        // Randomize direction
        this.ball.speedX = (Math.random() > 0.5 ? 1 : -1) * 5;
        this.ball.speedY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 3 + 3);
    }
    
    // Game loop function to be called by the game room
    update() {
        return this.updateBall();
    }
    
    // Start game
    start() {
        this.gameRunning = true;
        this.resetBall();
    }
    
    // Stop game
    stop() {
        this.gameRunning = false;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    
    // Update UI elements with current score
    updateScore(player1Score, player2Score) {
        this.player1.score = player1Score;
        this.player2.score = player2Score;
    }
    
    // Set paddle positions
    setPaddle(position, y) {
        if (position === 'left') {
            this.player1.y = y;
        } else if (position === 'right') {
            this.player2.y = y;
        }
    }
    
    // Set ball position and velocity
    setBall(x, y, speedX, speedY) {
        this.ball.x = x;
        this.ball.y = y;
        this.ball.speedX = speedX;
        this.ball.speedY = speedY;
    }
    
    // Resize the canvas
    resize() {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = containerWidth * 0.625; // 5:8 aspect ratio
        
        this.canvas.style.width = containerWidth + 'px';
        this.canvas.style.height = containerHeight + 'px';
    }
}

// Matchmaking WebSocket handler
class MatchmakingHandler {
    constructor() {
        this.socket = null;
        this.playerId = null;
        this.callbacks = {
            onConnectionEstablished: () => {},
            onQueueJoined: () => {},
            onQueueLeft: () => {},
            onGameFound: () => {},
            onError: () => {}
        };
    }
    
    connect(callbacks = {}) {
        // Merge callbacks
        this.callbacks = { ...this.callbacks, ...callbacks };
        
        const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const wsPath = `${wsProtocol}${window.location.host}/ws/games/pong/matchmaking/`;
        this.socket = new WebSocket(wsPath);
        
        this.socket.onopen = (e) => {
            console.log('Connected to matchmaking server');
        };
        
        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log('Received:', data);
            
            if (data.type === 'connection_established') {
                // Store the player ID
                this.playerId = data.player_id;
                this.callbacks.onConnectionEstablished(data);
            }
            else if (data.type === 'queue_update') {
                this.callbacks.onQueueJoined(data);
            }
            else if (data.type === 'queue_left') {
                this.callbacks.onQueueLeft(data);
            }
            else if (data.type === 'game_found') {
                this.callbacks.onGameFound(data);
            }
        };
        
        this.socket.onclose = (e) => {
            console.log('Disconnected from matchmaking server');
            
            // Try to reconnect after a delay
            setTimeout(() => {
                this.connect(this.callbacks);
            }, 1000);
        };
        
        this.socket.onerror = (e) => {
            console.error('WebSocket error:', e);
            this.callbacks.onError(e);
        };
    }
    
    joinQueue() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: 'join_queue'
            }));
            return true;
        }
        return false;
    }
    
    leaveQueue() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: 'leave_queue'
            }));
            return true;
        }
        return false;
    }
}

// Game Room WebSocket handler
class GameRoomHandler {
    constructor(roomId) {
        this.roomId = roomId;
        this.socket = null;
        this.playerId = null;
        this.playerPosition = null;
        this.callbacks = {
            onConnectionEstablished: () => {},
            onJoinConfirm: () => {},
            onGameState: () => {},
            onPlayersReady: () => {},
            onGameStart: () => {},
            onPaddleUpdate: () => {},
            onBallPosition: () => {},
            onScoreChange: () => {},
            onGameEnded: () => {},
            onGameMessage: () => {},
            onError: () => {}
        };
    }
    
    connect(callbacks = {}) {
        // Merge callbacks
        this.callbacks = { ...this.callbacks, ...callbacks };
        
        const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
        const wsPath = `${wsProtocol}${window.location.host}/ws/games/pong/${this.roomId}/`;
        this.socket = new WebSocket(wsPath);
        
        this.socket.onopen = (e) => {
            console.log('Connected to game server');
            this.callbacks.onConnectionEstablished();
            
            // Get player ID from sessionStorage or generate a new one
            this.playerId = sessionStorage.getItem('pongPlayerId');
            if (!this.playerId) {
                this.playerId = 'player_' + Math.random().toString(36).substring(2, 8);
                sessionStorage.setItem('pongPlayerId', this.playerId);
            }
            
            // Join the game
            setTimeout(() => {
                this.joinGame();
            }, 500);
        };
        
        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            console.log('Received:', data);
            
            switch (data.type) {
                case 'join_confirm':
                    this.handleJoinConfirm(data);
                    break;
                case 'game_state':
                    this.callbacks.onGameState(data);
                    break;
                case 'players_ready':
                    this.callbacks.onPlayersReady(data);
                    break;
                case 'game_start':
                    this.callbacks.onGameStart(data);
                    break;
                case 'paddle_update':
                    this.callbacks.onPaddleUpdate(data);
                    break;
                case 'ball_position':
                    this.callbacks.onBallPosition(data);
                    break;
                case 'score_change':
                    this.callbacks.onScoreChange(data);
                    break;
                case 'game_ended':
                    this.callbacks.onGameEnded(data);
                    break;
                case 'game_message':
                    this.callbacks.onGameMessage(data);
                    break;
            }
        };
        
        this.socket.onclose = (e) => {
            console.log('Disconnected from game server');
            
            // Try to reconnect after a delay
            setTimeout(() => {
                this.connect(this.callbacks);
            }, 1000);
        };
        
        this.socket.onerror = (e) => {
            console.error('WebSocket error:', e);
            this.callbacks.onError(e);
        };
    }
    
    handleJoinConfirm(data) {
        const role = data.role;
        const position = data.position;
        
        this.playerPosition = position;
        this.callbacks.onJoinConfirm(data);
    }
    
    joinGame(spectator = false) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: 'join_game',
                player_id: this.playerId,
                spectator: spectator
            }));
            return true;
        }
        return false;
    }
    
    sendReady() {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: 'player_ready'
            }));
            return true;
        }
        return false;
    }
    
    sendPaddleMove(y) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: 'paddle_move',
                y: y
            }));
            return true;
        }
        return false;
    }
    
    sendBallUpdate(x, y, speedX, speedY) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: 'ball_update',
                x: x,
                y: y,
                speedX: speedX,
                speedY: speedY
            }));
            return true;
        }
        return false;
    }
    
    sendScoreUpdate(player1Score, player2Score) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: 'score_update',
                player1_score: player1Score,
                player2_score: player2Score
            }));
            return true;
        }
        return false;
    }
    
    sendGameOver(winner, player1Score, player2Score) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: 'game_over',
                winner: winner,
                player1_score: player1Score,
                player2_score: player2Score
            }));
            return true;
        }
        return false;
    }
} 