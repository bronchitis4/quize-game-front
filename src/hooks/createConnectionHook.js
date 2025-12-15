import { useState, useEffect, useCallback } from 'react';
import gameSocketService from '../services/gameSocketService';

export const useWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [loading, setLoading] = useState(false);
    const [gameId, setGameId] = useState(null);

    const createGame = useCallback((playerName, avatarUrl, password) => {
        setLoading(true);
        gameSocketService.createLobby(playerName, avatarUrl, password);
    }, []);

    const joinGame = useCallback((playerName, avatarUrl, gameId, password) => {
        setLoading(true);
        gameSocketService.joinLobby(gameId, playerName, avatarUrl, password);
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

        gameSocketService.connect();

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
        joinGame
    };
};


