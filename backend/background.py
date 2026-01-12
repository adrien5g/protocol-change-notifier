import asyncio
from loguru import logger
from rethink import watch_changes


class ProtocolObserver:
    def __init__(self):
        self._observers = []

    def subscribe(self, callback):
        """Subscribe an observer"""
        self._observers.append(callback)
        return lambda: self._observers.remove(callback)

    async def notify(self, data):
        """Notify all observers"""
        tasks = [callback(data) for callback in self._observers]
        if tasks:
            await asyncio.gather(*tasks)


observer = ProtocolObserver()


async def notify_protocol_change(change_data):
    """Emit socket event when a protocol changes"""
    from sio import sio
    
    protocol_id = change_data.get('id')
    if protocol_id is not None:
        room = f"protocol_{protocol_id}"
        await sio.emit('protocol_updated', {'protocol_id': protocol_id}, room=room)
        logger.info(f"Notified room {room} about protocol update")


async def watch_protocol_changes():
    """Watch for changes in the modified table"""
    observer.subscribe(notify_protocol_change)
    
    async for change in watch_changes():
        logger.info(f"Change detected: {change}")
        new_val = change.get('new_val')
        if new_val:
            await observer.notify(new_val)
