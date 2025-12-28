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
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }
}

class GameSocketService extends SimpleEventEmitter {
  #socket;
  #gameState = null;
  #SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://quize-game-backend.onrender.com';

  constructor() {
    super();

    console.log('Connecting to server:', this.#SERVER_URL);

    this.#socket = io(this.#SERVER_URL, {
      autoConnect: false,
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionDelayMax: 2000,
      reconnectionAttempts: Infinity,
      timeout: 10000,
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

    this.#socket.on('game_started', (gameState) => {
      console.log('game_started event received:', gameState);
      this.#gameState = gameState;
      this.emit('game_started', gameState);
    });
  }

  // helper: wait for an event once
  #once(event) {
    return new Promise((resolve) => this.#socket.once(event, resolve));
  }

  // helper: await connection (without timeout)
  async connect({ timeoutMs = 10000 } = {}) {
    if (this.#socket.connected) return;

    this.#socket.connect();

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Socket connect timeout after ${timeoutMs}ms`)), timeoutMs)
    );

    // if connect_error occurs, reject immediately
    const connectErrorPromise = new Promise((_, reject) =>
      this.#socket.once('connect_error', (err) => reject(err))
    );

    await Promise.race([this.#once('connect'), connectErrorPromise, timeoutPromise]);
  }

  // helper: emit with ack as Promise
  async #emitWithAck(event, payload, { timeoutMs = 10000 } = {}) {
    await this.connect({ timeoutMs });

    return await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`Ack timeout for "${event}" after ${timeoutMs}ms`)), timeoutMs);

      // socket.io: last argument is ack callback
      this.#socket.emit(event, payload, (ack) => {
        clearTimeout(t);
        resolve(ack);
      });
    });
  }

  getSocketId() {
    return this.#socket.id;
  }

  disconnect() {
    if (this.#socket.connected) {
      this.#socket.disconnect();
    }
  }

  // =========================
  // LOBBY
  // =========================
  async createLobby(playerName, avatarUrl, password) {
    console.log('Emitting create_game');

    const ack = await this.#emitWithAck('create_game', {
      playerName,
      avatarUrl,
      password,
    });

    console.log('Server acknowledged create_game:', ack);
    return ack;
  }

  async joinLobby(gameId, playerName, avatarUrl, password) {
    console.log('Emitting join_game');

    const ack = await this.#emitWithAck('join_game', {
      gameId,
      playerName,
      avatarUrl,
      password,
    });

    console.log('Server acknowledged join_game:', ack);
    return ack;
  }

  // =========================
  // GAME ACTIONS (no ack)
  // =========================
  async sendAnswer(answerId) {
    await this.connect();
    this.#socket.emit('send_answer', { answerId });
  }

  async startGame(gameId) {
    await this.connect();
    this.#socket.emit('start_game', { gameId });
  }

  async nextQuestion(gameId) {
    await this.connect();
    console.log('Emitting next_question:', { gameId });
    this.#socket.emit('next_question', { gameId });
  }

  async getState() {
    await this.connect();
    this.#socket.emit('get_game_state');
  }

  async leaveGame() {
    await this.connect();
    this.#socket.emit('leave_game');
  }

  async loadPackage(gameId, packageData) {
    await this.connect();
    const packageArray = packageData.categories || packageData;
    console.log('Emitting load_package with data:', { gameId, package: packageArray });
    this.#socket.emit('load_package', { gameId, package: packageArray });
  }

  async selectQuestion(gameId, categoryIndex, questionIndex) {
    await this.connect();
    console.log('Emitting select_question:', { gameId, categoryIndex, questionIndex });
    this.#socket.emit('select_question', { gameId, categoryIndex, questionIndex });
  }

  async correctAnswer(gameId, playerId) {
    await this.connect();
    console.log('Emitting correct_answer:', { gameId, playerId });
    this.#socket.emit('correct_answer', { gameId, playerId });
  }

  async wrongAnswer(gameId, playerId) {
    await this.connect();
    console.log('Emitting wrong_answer:', { gameId, playerId });
    this.#socket.emit('wrong_answer', { gameId, playerId });
  }

  async buzzIn(gameId) {
    await this.connect();
    console.log('Emitting buzz_in:', { gameId });
    this.#socket.emit('buzz_in', { gameId });
  }

  async skipQuestion(gameId) {
    await this.connect();
    console.log('Emitting skip_question:', { gameId });
    this.#socket.emit('skip_question', { gameId });
  }
}

export default new GameSocketService();
