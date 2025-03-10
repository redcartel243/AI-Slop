import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.utils import timezone
import uuid
import asyncio

# Store active games and waiting players
active_games = {}
waiting_players = []
matchmaking_lock = asyncio.Lock()

class MatchmakingConsumer(AsyncWebsocketConsumer):
    """Consumer for handling matchmaking queue"""
    
    async def connect(self):
        """Connect to the matchmaking WebSocket"""
        await self.accept()
        
        # Generate a player ID for this connection
        self.player_id = str(uuid.uuid4())[:8]
        self.in_queue = False
        
        # Send initial confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'player_id': self.player_id,
            'message': 'Connected to matchmaking queue'
        }))
    
    async def disconnect(self, close_code):
        """Handle disconnection"""
        # Remove player from queue if they disconnect
        if self.in_queue:
            async with matchmaking_lock:
                if self.player_id in waiting_players:
                    waiting_players.remove(self.player_id)
    
    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        data = json.loads(text_data)
        action = data.get('action')
        
        if action == 'join_queue':
            await self.join_matchmaking_queue()
        elif action == 'leave_queue':
            await self.leave_matchmaking_queue()
    
    async def join_matchmaking_queue(self):
        """Add the player to the matchmaking queue"""
        if self.in_queue:
            return
        
        self.in_queue = True
        
        async with matchmaking_lock:
            # Add this player to the waiting queue
            waiting_players.append(self.player_id)
            
            # Check if we have enough players to start a game
            if len(waiting_players) >= 2:
                # Get the first two players
                player1_id = waiting_players.pop(0)
                player2_id = waiting_players.pop(0)
                
                # Create a new game room
                room_id = f"pong_{uuid.uuid4().hex[:8]}"
                
                # Initialize the game
                active_games[room_id] = {
                    'player1': player1_id,
                    'player2': player2_id,
                    'created_at': timezone.now().timestamp(),
                    'state': 'waiting',
                    'spectators': []
                }
                
                # Notify this player about the game
                if self.player_id == player1_id or self.player_id == player2_id:
                    await self.send(text_data=json.dumps({
                        'type': 'game_found',
                        'room_id': room_id,
                        'opponent_id': player2_id if self.player_id == player1_id else player1_id,
                        'player_position': 'left' if self.player_id == player1_id else 'right'
                    }))
            else:
                # Let the player know they're in the queue
                await self.send(text_data=json.dumps({
                    'type': 'queue_update',
                    'position': len(waiting_players),
                    'message': 'Waiting for an opponent...'
                }))
    
    async def leave_matchmaking_queue(self):
        """Remove the player from the matchmaking queue"""
        if not self.in_queue:
            return
        
        self.in_queue = False
        
        async with matchmaking_lock:
            if self.player_id in waiting_players:
                waiting_players.remove(self.player_id)
                
        await self.send(text_data=json.dumps({
            'type': 'queue_left',
            'message': 'You have left the matchmaking queue'
        }))


class PongConsumer(AsyncWebsocketConsumer):
    """Consumer for the multiplayer Pong game"""
    
    async def connect(self):
        """Connect to a game room"""
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'pong_{self.room_id}'
        
        # Check if this is a valid game room
        if self.room_id not in active_games:
            # This might be a spectator trying to join
            active_games[self.room_id] = {
                'player1': None,
                'player2': None,
                'state': 'waiting',
                'spectators': [],
                'created_at': timezone.now().timestamp()
            }
        
        # Join the game group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send initial game state
        await self.send(text_data=json.dumps({
            'type': 'game_state',
            'state': active_games[self.room_id]['state'],
            'player1': active_games[self.room_id]['player1'],
            'player2': active_games[self.room_id]['player2']
        }))
    
    async def disconnect(self, close_code):
        """Handle disconnection"""
        # Leave the game group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        
        # If a player disconnects, update the game state
        if self.room_id in active_games:
            game = active_games[self.room_id]
            
            if hasattr(self, 'player_id'):
                if game['player1'] == self.player_id:
                    # Player 1 disconnected
                    game['state'] = 'player1_disconnected'
                    
                    # Notify all clients in the room
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'game_message',
                            'message': 'Player 1 disconnected',
                            'game_state': game['state']
                        }
                    )
                    
                elif game['player2'] == self.player_id:
                    # Player 2 disconnected
                    game['state'] = 'player2_disconnected'
                    
                    # Notify all clients in the room
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'game_message',
                            'message': 'Player 2 disconnected',
                            'game_state': game['state']
                        }
                    )
                
                elif self.player_id in game['spectators']:
                    # Spectator disconnected
                    game['spectators'].remove(self.player_id)
            
            # Clean up empty games after a while
            if game['state'] in ['player1_disconnected', 'player2_disconnected', 'completed']:
                # We'll keep the game data for replay purposes, but could remove it later
                pass
    
    async def receive(self, text_data):
        """Handle incoming WebSocket messages"""
        data = json.loads(text_data)
        action = data.get('action')
        
        if action == 'join_game':
            await self.join_game(data)
        elif action == 'paddle_move':
            await self.paddle_move(data)
        elif action == 'start_game':
            await self.start_game()
        elif action == 'ball_update':
            await self.ball_update(data)
        elif action == 'score_update':
            await self.score_update(data)
        elif action == 'game_over':
            await self.game_over(data)
        elif action == 'player_ready':
            await self.player_ready()
        
    async def join_game(self, data):
        """Handle a player joining the game"""
        self.player_id = data.get('player_id')
        is_spectator = data.get('spectator', False)
        
        game = active_games[self.room_id]
        
        if is_spectator:
            # Add as spectator
            if self.player_id not in game['spectators']:
                game['spectators'].append(self.player_id)
            
            await self.send(text_data=json.dumps({
                'type': 'join_confirm',
                'role': 'spectator',
                'message': 'You joined as a spectator'
            }))
        else:
            # Try to join as a player
            if game['player1'] is None:
                game['player1'] = self.player_id
                self.player_position = 'left'
                
                await self.send(text_data=json.dumps({
                    'type': 'join_confirm',
                    'role': 'player1',
                    'position': 'left',
                    'message': 'You joined as Player 1'
                }))
                
            elif game['player2'] is None:
                game['player2'] = self.player_id
                self.player_position = 'right'
                
                await self.send(text_data=json.dumps({
                    'type': 'join_confirm',
                    'role': 'player2',
                    'position': 'right',
                    'message': 'You joined as Player 2'
                }))
                
                # Both players are now in the game, we can change the state
                if game['player1'] is not None:
                    game['state'] = 'ready'
                    
                    # Notify all clients that both players are present
                    await self.channel_layer.group_send(
                        self.room_group_name,
                        {
                            'type': 'players_ready',
                            'player1': game['player1'],
                            'player2': game['player2']
                        }
                    )
            else:
                # Game is full, add as spectator
                if self.player_id not in game['spectators']:
                    game['spectators'].append(self.player_id)
                
                await self.send(text_data=json.dumps({
                    'type': 'join_confirm',
                    'role': 'spectator',
                    'message': 'Game is full! You joined as a spectator'
                }))
    
    async def paddle_move(self, data):
        """Handle paddle movement"""
        # Only process paddle movements if the game is in progress
        game = active_games[self.room_id]
        if game['state'] != 'playing':
            return
        
        # Relay paddle movement to all clients
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'paddle_update',
                'player_id': self.player_id,
                'position': self.player_position,
                'y': data.get('y')
            }
        )
    
    async def start_game(self):
        """Start the game"""
        game = active_games[self.room_id]
        
        # Only allow starting if both players are present
        if game['player1'] is not None and game['player2'] is not None:
            game['state'] = 'playing'
            
            # Notify all clients that the game is starting
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'game_start',
                    'player1': game['player1'],
                    'player2': game['player2']
                }
            )
    
    async def ball_update(self, data):
        """Handle ball position updates"""
        # Only the game host (player1) should send ball updates to avoid conflicts
        game = active_games[self.room_id]
        if game['state'] != 'playing' or self.player_id != game['player1']:
            return
        
        # Relay ball position to all clients
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'ball_position',
                'x': data.get('x'),
                'y': data.get('y'),
                'speedX': data.get('speedX'),
                'speedY': data.get('speedY')
            }
        )
    
    async def score_update(self, data):
        """Handle score updates"""
        # Only the game host (player1) should send score updates
        game = active_games[self.room_id]
        if game['state'] != 'playing' or self.player_id != game['player1']:
            return
        
        # Relay score update to all clients
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'score_change',
                'player1_score': data.get('player1_score', 0),
                'player2_score': data.get('player2_score', 0)
            }
        )
    
    async def game_over(self, data):
        """Handle game over"""
        game = active_games[self.room_id]
        game['state'] = 'completed'
        
        # Relay game over to all clients
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'game_ended',
                'winner': data.get('winner'),
                'player1_score': data.get('player1_score', 0),
                'player2_score': data.get('player2_score', 0)
            }
        )
    
    async def player_ready(self):
        """Player is ready to start the game"""
        game = active_games[self.room_id]
        
        # Set this player as ready
        if hasattr(self, 'player_position'):
            if self.player_position == 'left':
                game['player1_ready'] = True
            else:
                game['player2_ready'] = True
            
            # Check if both players are ready
            if game.get('player1_ready') and game.get('player2_ready'):
                await self.start_game()
    
    # Event handler methods
    
    async def players_ready(self, event):
        """Handle players ready event"""
        await self.send(text_data=json.dumps({
            'type': 'players_ready',
            'player1': event['player1'],
            'player2': event['player2']
        }))
    
    async def game_start(self, event):
        """Handle game start event"""
        await self.send(text_data=json.dumps({
            'type': 'game_start',
            'player1': event['player1'],
            'player2': event['player2']
        }))
    
    async def paddle_update(self, event):
        """Handle paddle update event"""
        await self.send(text_data=json.dumps({
            'type': 'paddle_update',
            'player_id': event['player_id'],
            'position': event['position'],
            'y': event['y']
        }))
    
    async def ball_position(self, event):
        """Handle ball position event"""
        await self.send(text_data=json.dumps({
            'type': 'ball_position',
            'x': event['x'],
            'y': event['y'],
            'speedX': event['speedX'],
            'speedY': event['speedY']
        }))
    
    async def score_change(self, event):
        """Handle score change event"""
        await self.send(text_data=json.dumps({
            'type': 'score_change',
            'player1_score': event['player1_score'],
            'player2_score': event['player2_score']
        }))
    
    async def game_ended(self, event):
        """Handle game ended event"""
        await self.send(text_data=json.dumps({
            'type': 'game_ended',
            'winner': event['winner'],
            'player1_score': event['player1_score'],
            'player2_score': event['player2_score']
        }))
    
    async def game_message(self, event):
        """Handle general game messages"""
        await self.send(text_data=json.dumps({
            'type': 'game_message',
            'message': event['message'],
            'game_state': event.get('game_state')
        })) 