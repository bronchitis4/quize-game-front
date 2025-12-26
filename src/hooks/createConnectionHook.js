import { useState, useEffect, useCallback } from 'react';
import gameSocketService from '../services/gameSocketService';

export const useWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gameId, setGameId] = useState(null);

    const showToast = (msg) => {
        try {
            const id = `toast-${Date.now()}`;
            const el = document.createElement('div');
            el.id = id;
            el.textContent = msg;
            Object.assign(el.style, {
                position: 'fixed',
                bottom: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.85)',
                color: 'white',
                padding: '10px 16px',
                borderRadius: '8px',
                zIndex: 9999,
                fontSize: '14px',
            });
            document.body.appendChild(el);
            setTimeout(() => {
                el.style.transition = 'opacity 300ms';
                el.style.opacity = '0';
                setTimeout(() => el.remove(), 300);
            }, 3000);
        } catch (e) {
            try { alert(msg); } catch (_) { /* noop */ }
        }
    };

    const createGame = useCallback(async (playerName, avatarUrl, password) => {
        setLoading(true);
        setError(null);
        try {
            const ack = await gameSocketService.createLobby(playerName, avatarUrl, password);
            setLoading(false);
            return ack;
        } catch (err) {
            const message = 'Помилка при створенні гри: ' + (err?.message || err);
            setError(message);
            setLoading(false);
            showToast(message);
            throw err;
        }
    }, []);

    const joinGame = useCallback(async (playerName, avatarUrl, gameId, password) => {
        setLoading(true);
        setError(null);
        try {
            const ack = await gameSocketService.joinLobby(gameId, playerName, avatarUrl, password);
            setLoading(false);
            return ack;
        } catch (err) {
            const message = 'Помилка при приєднанні: ' + (err?.message || err);
            setError(message);
            setLoading(false);
            showToast(message);
            throw err;
        }
    }, []);

    const loadPackage = useCallback(async (gameId, packageData) => {
        await gameSocketService.loadPackage(gameId, packageData);
    }, []);

    const startGame = useCallback(async (gameId) => {
        await gameSocketService.startGame(gameId);
    }, []);

    const selectQuestion = useCallback(async (gameId, categoryIndex, questionIndex) => {
        await gameSocketService.selectQuestion(gameId, categoryIndex, questionIndex);
    }, []);

    const buzzIn = useCallback(async (gameId) => {
        await gameSocketService.buzzIn(gameId);
    }, []);

    const correctAnswer = useCallback(async (gameId, playerId) => {
        await gameSocketService.correctAnswer(gameId, playerId);
    }, []);

    const wrongAnswer = useCallback(async (gameId, playerId) => {
        await gameSocketService.wrongAnswer(gameId, playerId);
    }, []);

    const skipQuestion = useCallback(async (gameId) => {
        await gameSocketService.skipQuestion(gameId);
    }, []);

    const nextQuestion = useCallback(async (gameId) => {
        await gameSocketService.nextQuestion(gameId);
    }, []);

    const getSocketId = useCallback(() => {
        return gameSocketService.getSocketId();
    }, []);


    useEffect(() => {
        const handleConnectionStatus = (status) => {
            setIsConnected(status);
        };
        
        const handleError = (message) => {
            setError(message);
            setLoading(false);
        };
        
        const handleGameCreated = (data) => {
            setGameState(data);
            setGameId(data.roomId);
            setLoading(false);
        };
        
        const handleGameJoined = (data) => {
            setGameState(data);
            setGameId(data.roomId);
            setLoading(false);
        };
        
        const handleStateUpdate = (state) => {
            console.log('State update received in hook:', state);
            setGameState(state);
            setLoading(false);
        };

        const handleGameStarted = (state) => {
            console.log('Game started received in hook:', state);
            setGameState(state);
            setLoading(false);
        };

        gameSocketService.on('connection_status', handleConnectionStatus);
        gameSocketService.on('error', handleError);
        gameSocketService.on('game_created', handleGameCreated);
        gameSocketService.on('game_joined', handleGameJoined);
        gameSocketService.on('state_update', handleStateUpdate);
        gameSocketService.on('game_started', handleGameStarted);

        (async () => {
            await gameSocketService.connect();
        })();

        return () => {
            gameSocketService.off('connection_status', handleConnectionStatus);
            gameSocketService.off('error', handleError);
            gameSocketService.off('game_created', handleGameCreated);
            gameSocketService.off('game_joined', handleGameJoined);
            gameSocketService.off('state_update', handleStateUpdate);
            gameSocketService.off('game_started', handleGameStarted);
        };
    }, []);

    return {
        isConnected,
        error,
        gameState,
        gameId,
        loading,
        createGame,
        joinGame,
        loadPackage,
        startGame,
        selectQuestion,
        buzzIn,
        correctAnswer,
        wrongAnswer,
        skipQuestion,
        nextQuestion,
        getSocketId
    };
};


