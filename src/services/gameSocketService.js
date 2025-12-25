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
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
  }

  emit(event, data) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((cb) => cb(data));
  }
}

class GameSocketService extends SimpleEventEmitter {
  #socket;
  #gameState = null;
  #SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://quize-game-backend.onrender.com';
  #connectPromise = null;

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
      timeout: 25000,
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
      console.error('Connection error:', error?.message || error, error);
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

  async #ensureConnected() {
    if (this.#socket.connected) return;

    if (this.#connectPromise) {
      await this.#connectPromise;
      return;
    }

    this.#connectPromise = new Promise((resolve, reject) => {
      const onConnect = () => {
        cleanup();
        resolve();
      };

      const onError = (err) => {
        cleanup();
        reject(err);
      };

      const cleanup = () => {
        this.#socket.off('connect', onConnect);
        this.#socket.off('connect_error', onError);
        this.#connectPromise = null;
      };

      this.#socket.on('connect', onConnect);
      this.#socket.on('connect_error', onError);

      this.#socket.connect();
    });

    await this.#connectPromise;
  }

  async connect() {
    try {
      await this.#ensureConnected();
      return true;
    } catch (e) {
      console.error('Failed to connect:', e?.message || e);
      return false;
    }
  }

  createLobby(playerName, avatarUrl, password) {
    return this.#ensureConnected().then(() => {
      console.log('Emitting create_game');
      this.#socket.emit('create_game', { playerName, avatarUrl, password }, (ack) => {
        console.log('Server acknowledged create_game:', ack);
      });
    });
  }

  joinLobby(gameId, playerName, avatarUrl, password) {
    return this.#ensureConnected().then(() => {
      console.log('Emitting join_game');
      this.#socket.emit('join_game', { gameId, playerName, avatarUrl, password }, (ack) => {
        console.log('Server acknowledged join_game:', ack);
      });
    });
  }

  getSocketId() {
    return this.#socket.id;
  }

  disconnect() {
    if (this.#socket.connected) this.#socket.disconnect();
  }

  sendAnswer(answerId) {
    return this.#ensureConnected().then(() => {
      this.#socket.emit('send_answer', { answerId });
    });
  }

  startGame(gameId) {
    return this.#ensureConnected().then(() => {
      this.#socket.emit('start_game', { gameId });
    });
  }

  nextQuestion(gameId) {
    return this.#ensureConnected().then(() => {
      console.log('Emitting next_question:', { gameId });
      this.#socket.emit('next_question', { gameId });
    });
  }

  getState() {
    return this.#ensureConnected().then(() => {
      this.#socket.emit('get_game_state');
    });
  }

  leaveGame() {
    return this.#ensureConnected().then(() => {
      this.#socket.emit('leave_game');
    });
  }

  loadPackage(gameId, packageData) {
    return this.#ensureConnected().then(() => {
      const packageArray = packageData?.categories || packageData;
      console.log('Emitting load_package with data:', { gameId, package: packageArray });
      this.#socket.emit('load_package', { gameId, package: packageArray });
    });
  }

  selectQuestion(gameId, categoryIndex, questionIndex) {
    return this.#ensureConnected().then(() => {
      console.log('Emitting select_question:', { gameId, categoryIndex, questionIndex });
      this.#socket.emit('select_question', { gameId, categoryIndex, questionIndex });
    });
  }

  correctAnswer(gameId, playerId) {
    return this.#ensureConnected().then(() => {
      console.log('Emitting correct_answer:', { gameId, playerId });
      this.#socket.emit('correct_answer', { gameId, playerId });
    });
  }

  wrongAnswer(gameId, playerId) {
    return this.#ensureConnected().then(() => {
      console.log('Emitting wrong_answer:', { gameId, playerId });
      this.#socket.emit('wrong_answer', { gameId, playerId });
    });
  }

  buzzIn(gameId) {
    return this.#ensureConnected().then(() => {
      console.log('Emitting buzz_in:', { gameId });
      this.#socket.emit('buzz_in', { gameId });
    });
  }

  skipQuestion(gameId) {
    return this.#ensureConnected().then(() => {
      console.log('Emitting skip_question:', { gameId });
      this.#socket.emit('skip_question', { gameId });
    });
  }

  getCachedState() {
    return this.#gameState;
  }
}

export default new GameSocketService();
