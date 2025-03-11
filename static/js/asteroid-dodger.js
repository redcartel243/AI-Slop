/**
 * Asteroid Dodger Game
 * A 3D space game built with Three.js where players navigate through an asteroid field
 */

class AsteroidDodger {
    constructor(containerId) {
        // Game container
        this.container = document.getElementById(containerId);
        
        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.speed = 1;
        this.asteroidSpeed = 0.5;
        this.asteroidSpawnRate = 0.02;
        this.lastTime = 0;
        this.gameOver = false;
        
        // Game objects
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ship = null;
        this.asteroids = [];
        this.stars = [];
        this.explosions = [];
        this.powerUps = [];
        
        // Controls
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            Space: false
        };
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleResize = this.handleResize.bind(this);
        
        // Initialize game
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x000000, 0.0015);
        
        // Create camera
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.z = 5;
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0x000000, 1);
        this.container.appendChild(this.renderer.domElement);
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1).normalize();
        this.scene.add(directionalLight);
        
        // Create starfield background
        this.createStarfield();
        
        // Create player ship
        this.createShip();
        
        // Add event listeners
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('resize', this.handleResize);
        
        // Start animation loop
        this.animate(0);
    }
    
    createStarfield() {
        // Create a starfield of small bright dots
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true
        });
        
        const starVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }
        
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(stars);
        this.stars.push(stars);
    }
    
    createShip() {
        // Create a simple spaceship using a cone and cylinder
        const shipGroup = new THREE.Group();
        
        // Ship body (cone)
        const bodyGeometry = new THREE.ConeGeometry(0.2, 0.5, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x00f0ff,
            emissive: 0x00708f,
            shininess: 100,
            specular: 0x00f0ff
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2;
        shipGroup.add(body);
        
        // Ship wings
        const wingGeometry = new THREE.BoxGeometry(0.6, 0.05, 0.2);
        const wingMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x7a5af8,
            emissive: 0x3a2a78,
            shininess: 100,
            specular: 0x7a5af8
        });
        const wings = new THREE.Mesh(wingGeometry, wingMaterial);
        wings.position.y = -0.1;
        shipGroup.add(wings);
        
        // Ship engine glow
        const engineGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const engineMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xff3300,
            transparent: true,
            opacity: 0.8
        });
        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.position.y = -0.25;
        engine.scale.y = 0.5;
        shipGroup.add(engine);
        
        // Add ship to scene
        shipGroup.position.set(0, 0, 0);
        this.scene.add(shipGroup);
        this.ship = shipGroup;
        
        // Add ship collision box
        this.shipBoundingBox = new THREE.Box3().setFromObject(shipGroup);
    }
    
    createAsteroid() {
        // Create a random asteroid
        const size = Math.random() * 0.5 + 0.2;
        const detail = Math.floor(Math.random() * 2) + 1;
        const geometry = new THREE.DodecahedronGeometry(size, detail);
        
        // Distort the geometry to make it look more like an asteroid
        const positionAttribute = geometry.getAttribute('position');
        const vertex = new THREE.Vector3();
        
        for (let i = 0; i < positionAttribute.count; i++) {
            vertex.fromBufferAttribute(positionAttribute, i);
            vertex.x += (Math.random() - 0.5) * 0.1 * size;
            vertex.y += (Math.random() - 0.5) * 0.1 * size;
            vertex.z += (Math.random() - 0.5) * 0.1 * size;
            positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }
        
        // Random asteroid color
        const colors = [0x8B4513, 0xA0522D, 0xCD853F, 0xD2691E, 0xB87333];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const material = new THREE.MeshStandardMaterial({
            color: color,
            roughness: 0.9,
            metalness: 0.1,
        });
        
        const asteroid = new THREE.Mesh(geometry, material);
        
        // Position the asteroid at a random location in front of the player
        asteroid.position.x = (Math.random() - 0.5) * 10;
        asteroid.position.y = (Math.random() - 0.5) * 10;
        asteroid.position.z = -50 - Math.random() * 50;
        
        // Random rotation
        asteroid.rotation.x = Math.random() * Math.PI;
        asteroid.rotation.y = Math.random() * Math.PI;
        asteroid.rotation.z = Math.random() * Math.PI;
        
        // Random rotation speed
        asteroid.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
        
        // Add to scene
        this.scene.add(asteroid);
        
        // Add bounding box for collision detection
        const boundingBox = new THREE.Box3().setFromObject(asteroid);
        
        // Add to asteroids array
        this.asteroids.push({
            mesh: asteroid,
            boundingBox: boundingBox,
            size: size
        });
    }
    
    createExplosion(position, size) {
        // Create particle system for explosion
        const particleCount = 50;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        const color = new THREE.Color();
        
        for (let i = 0; i < particleCount; i++) {
            // Random position within sphere
            const x = (Math.random() - 0.5) * size;
            const y = (Math.random() - 0.5) * size;
            const z = (Math.random() - 0.5) * size;
            
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
            
            // Color gradient from yellow to red
            const ratio = Math.random();
            color.setHSL(0.1 - ratio * 0.1, 1.0, 0.5);
            
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 1.0
        });
        
        const particles = new THREE.Points(geometry, material);
        particles.position.copy(position);
        
        // Add to scene
        this.scene.add(particles);
        
        // Add to explosions array with lifetime
        this.explosions.push({
            mesh: particles,
            lifetime: 1.0,
            velocities: Array(particleCount).fill().map(() => ({
                x: (Math.random() - 0.5) * 0.2,
                y: (Math.random() - 0.5) * 0.2,
                z: (Math.random() - 0.5) * 0.2
            }))
        });
    }
    
    updateExplosions(deltaTime) {
        // Update all explosions
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            
            // Decrease lifetime
            explosion.lifetime -= deltaTime;
            
            // Update opacity based on lifetime
            explosion.mesh.material.opacity = explosion.lifetime;
            
            // Update particle positions
            const positions = explosion.mesh.geometry.attributes.position.array;
            
            for (let j = 0; j < positions.length / 3; j++) {
                positions[j * 3] += explosion.velocities[j].x;
                positions[j * 3 + 1] += explosion.velocities[j].y;
                positions[j * 3 + 2] += explosion.velocities[j].z;
            }
            
            explosion.mesh.geometry.attributes.position.needsUpdate = true;
            
            // Remove if lifetime is over
            if (explosion.lifetime <= 0) {
                this.scene.remove(explosion.mesh);
                this.explosions.splice(i, 1);
            }
        }
    }
    
    updateShip(deltaTime) {
        // Move ship based on key presses
        const moveSpeed = 5 * deltaTime;
        
        if (this.keys.ArrowUp && this.ship.position.y < 3) {
            this.ship.position.y += moveSpeed;
        }
        if (this.keys.ArrowDown && this.ship.position.y > -3) {
            this.ship.position.y -= moveSpeed;
        }
        if (this.keys.ArrowLeft && this.ship.position.x > -5) {
            this.ship.position.x -= moveSpeed;
            // Tilt ship when moving left
            this.ship.rotation.z = Math.min(this.ship.rotation.z + 0.1, 0.5);
        } else if (this.keys.ArrowRight && this.ship.position.x < 5) {
            this.ship.position.x += moveSpeed;
            // Tilt ship when moving right
            this.ship.rotation.z = Math.max(this.ship.rotation.z - 0.1, -0.5);
        } else {
            // Return to neutral position
            this.ship.rotation.z *= 0.9;
        }
        
        // Update ship bounding box
        this.shipBoundingBox.setFromObject(this.ship);
    }
    
    updateAsteroids(deltaTime) {
        // Move existing asteroids
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            
            // Move asteroid towards player
            asteroid.mesh.position.z += this.asteroidSpeed * this.speed * deltaTime * 60;
            
            // Rotate asteroid
            asteroid.mesh.rotation.x += asteroid.mesh.rotationSpeed.x;
            asteroid.mesh.rotation.y += asteroid.mesh.rotationSpeed.y;
            asteroid.mesh.rotation.z += asteroid.mesh.rotationSpeed.z;
            
            // Update bounding box
            asteroid.boundingBox.setFromObject(asteroid.mesh);
            
            // Check for collision with player
            if (asteroid.boundingBox.intersectsBox(this.shipBoundingBox)) {
                // Create explosion
                this.createExplosion(asteroid.mesh.position, asteroid.size * 2);
                
                // Remove asteroid
                this.scene.remove(asteroid.mesh);
                this.asteroids.splice(i, 1);
                
                // Decrease lives
                this.lives--;
                
                // Check for game over
                if (this.lives <= 0) {
                    this.gameOver = true;
                    this.isRunning = false;
                    
                    // Trigger game over event
                    const event = new CustomEvent('gameover', { 
                        detail: { score: this.score } 
                    });
                    this.container.dispatchEvent(event);
                }
                
                // Trigger hit event
                const event = new CustomEvent('hit', { 
                    detail: { lives: this.lives } 
                });
                this.container.dispatchEvent(event);
                
                continue;
            }
            
            // Remove asteroids that have passed the player
            if (asteroid.mesh.position.z > 10) {
                this.scene.remove(asteroid.mesh);
                this.asteroids.splice(i, 1);
                
                // Increase score
                this.score += 10;
                
                // Trigger score event
                const event = new CustomEvent('score', { 
                    detail: { score: this.score } 
                });
                this.container.dispatchEvent(event);
            }
        }
        
        // Spawn new asteroids
        if (Math.random() < this.asteroidSpawnRate * this.speed && this.isRunning) {
            this.createAsteroid();
        }
    }
    
    updateStarfield(deltaTime) {
        // Move stars to create parallax effect
        this.stars.forEach(stars => {
            stars.position.z += 0.1 * this.speed * deltaTime * 60;
            
            // Reset stars that have passed the camera
            if (stars.position.z > 10) {
                stars.position.z = -1000;
            }
        });
    }
    
    update(deltaTime) {
        if (!this.isRunning) return;
        
        // Update game objects
        this.updateShip(deltaTime);
        this.updateAsteroids(deltaTime);
        this.updateStarfield(deltaTime);
        this.updateExplosions(deltaTime);
        
        // Increase difficulty over time
        this.speed += 0.0001;
        this.asteroidSpawnRate = Math.min(0.05, this.asteroidSpawnRate + 0.000005);
    }
    
    animate(time) {
        requestAnimationFrame(this.animate);
        
        // Calculate delta time
        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;
        
        // Update game state
        this.update(deltaTime);
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    start() {
        this.isRunning = true;
        this.gameOver = false;
        this.score = 0;
        this.lives = 3;
        this.speed = 1;
        this.asteroidSpawnRate = 0.02;
        
        // Clear existing asteroids
        this.asteroids.forEach(asteroid => {
            this.scene.remove(asteroid.mesh);
        });
        this.asteroids = [];
        
        // Reset ship position
        this.ship.position.set(0, 0, 0);
        this.ship.rotation.set(0, 0, 0);
        
        // Trigger start event
        const event = new CustomEvent('start');
        this.container.dispatchEvent(event);
    }
    
    pause() {
        this.isRunning = false;
        this.isPaused = true;
        
        // Trigger pause event
        const event = new CustomEvent('pause');
        this.container.dispatchEvent(event);
    }
    
    resume() {
        this.isRunning = true;
        this.isPaused = false;
        
        // Trigger resume event
        const event = new CustomEvent('resume');
        this.container.dispatchEvent(event);
    }
    
    handleKeyDown(event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || 
            event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            this.keys[event.key] = true;
            event.preventDefault();
        } else if (event.key === ' ' || event.key === 'Space') {
            this.keys.Space = true;
            event.preventDefault();
            
            // Toggle pause
            if (this.isPaused) {
                this.resume();
            } else if (this.isRunning) {
                this.pause();
            } else if (this.gameOver) {
                this.start();
            }
        }
    }
    
    handleKeyUp(event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || 
            event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            this.keys[event.key] = false;
        } else if (event.key === ' ' || event.key === 'Space') {
            this.keys.Space = false;
        }
    }
    
    handleResize() {
        // Update camera aspect ratio
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        
        // Update renderer size
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }
    
    // Clean up resources
    dispose() {
        // Remove event listeners
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.handleKeyUp);
        window.removeEventListener('resize', this.handleResize);
        
        // Remove renderer from DOM
        if (this.renderer && this.container.contains(this.renderer.domElement)) {
            this.container.removeChild(this.renderer.domElement);
        }
        
        // Dispose of Three.js resources
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.ship = null;
        this.asteroids = [];
        this.stars = [];
        this.explosions = [];
    }
} 