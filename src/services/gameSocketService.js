import { io } from 'socket.io-client';

class SimpleEventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    }
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }
}

class GameSocketService extends SimpleEventEmitter {
    #socket;
    #gameState = null;
    #SERVER_URL = 'ws://localhost:3000';
    
    constructor() {
        super();
        
        this.#socket = io(this.#SERVER_URL, {
            autoConnect: false,
            transports: ['polling'],
            reconnection: true,
            reconnectionDelay: 500,
            reconnectionDelayMax: 2000,
            reconnectionAttempts: Infinity,
            timeout: 10000
        });

        this.#setupListeners();
    }
    
    #setupListeners() {
        this.#socket.on('connect', () => {
            console.log('Connected to server, socket id:', this.#socket.id);
            this.emit('connection_status', true);
        });
        
        this.#socket.on('disconnect', (reason) => {
            console.log('Disconnected from server, reason:', reason);
            this.emit('connection_status', false);
        });
        
        this.#socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
        
        this.#socket.on('game_created', (data) => {
            console.log('game_created event received:', data);
            this.#gameState = data;
            this.emit('game_created', data);
        });
        
        this.#socket.on('game_joined', (data) => {
            console.log('game_joined event received:', data);
            this.#gameState = data;
            this.emit('game_joined', data);
        });
        
        this.#socket.on('state_update', (state) => {
            console.log('state_update event received:', state);
            this.#gameState = state;
            this.emit('state_update', state);
        });
    }
    
    connect() {
        if (!this.#socket.connected) {
            this.#socket.connect();
        }
    }

    createLobby(playerName, avatarUrl, password) {
        this.connect();
        setTimeout(() => {
            if (this.#socket.connected) {
                console.log('Emitting create_game');
                this.#socket.emit('create_game', { 
                    playerName, 
                    avatarUrl, 
                    password 
                }, (acknowledgment) => {
                    console.log('Server acknowledged create_game:', acknowledgment);
                });
            } else {
                console.warn('Socket still not connected after 100ms');
            }
        }, 100);
    }

    joinLobby(gameId, playerName, avatarUrl, password) {
        this.connect();
        setTimeout(() => {
            if (this.#socket.connected) {
                console.log('Emitting join_game');
                this.#socket.emit('join_game', { 
                    gameId, 
                    playerName, 
                    avatarUrl, 
                    password 
                }, (acknowledgment) => {
                    console.log('Server acknowledged join_game:', acknowledgment);
                });
            } else {
                console.warn('Socket still not connected after 100ms');
            }
        }, 100);
    }
    
    
    getSocketId() {
        return this.#socket.id;
    }
    
    disconnect() {
        if (this.#socket.connected) {
            this.#socket.disconnect();
        }
    }
    
    sendAnswer(answerId) {
        if (this.#socket.connected) {
            this.#socket.emit('send_answer', { answerId });
        }
    }
    
    startGame() {
        if (this.#socket.connected) {
            this.#socket.emit('start_game');
        }
    }
    
    nextQuestion() {
        if (this.#socket.connected) {
            this.#socket.emit('next_question');
        }
    }
    
    getState() {
        if (this.#socket.connected) {
            this.#socket.emit('get_game_state');
        }
    }
    
    leaveGame() {
        if (this.#socket.connected) {
            this.#socket.emit('leave_game');
        }
    }

    loadPackage(gameId, packageData) {
        if (this.#socket.connected) {
            const packageArray = packageData.categories || packageData;
            console.log('Emitting load_package with data:', { gameId, package: packageArray });
            this.#socket.emit('load_package', { gameId, package: packageArray });
        }
    }
}

export default new GameSocketService();