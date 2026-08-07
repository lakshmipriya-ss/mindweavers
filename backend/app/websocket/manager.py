import asyncio
from typing import List
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    """Manage active WebSocket connections and broadcast JSON messages."""
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        async with self.lock:
            self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket):
        async with self.lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        """Send a JSON payload to every connected client.
        If a client raises an exception (e.g., disconnected), it is removed.
        """
        async with self.lock:
            dead: List[WebSocket] = []
            for conn in self.active_connections:
                try:
                    await conn.send_json(message)
                except Exception:
                    dead.append(conn)
            for conn in dead:
                self.active_connections.remove(conn)

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)
