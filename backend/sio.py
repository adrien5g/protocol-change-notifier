import socketio
from loguru import logger

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*",
    ping_interval=10,
    ping_timeout=5,
)

active_connections: set[str] = set()


async def get_total_connections():
    return len(active_connections)


async def broadcast_total_connections():
    total = await get_total_connections()
    await sio.emit("total_connections", {"total_connections": total})


@sio.event
async def connect(sid: str, _):
    logger.info(f"Client connected: {sid}")
    active_connections.add(sid)
    await broadcast_total_connections()


@sio.event
async def disconnect(sid: str):
    logger.info(f"Client disconnected: {sid}")
    active_connections.discard(sid)
    await broadcast_total_connections()


@sio.on("join_protocol")
async def join_protocol(sid: str, data: dict):
    protocol_id = data.get("protocol_id")
    if protocol_id is not None:
        room = f"protocol_{protocol_id}"
        await sio.enter_room(sid, room)
        users_in_room = get_users_on_protocol(protocol_id)

        user_count_data = {
            "protocol_id": int(protocol_id),
            "user_count": len(users_in_room)
        }
        await sio.emit("protocol_user_count", user_count_data, room=room)

@sio.on("leave_protocol")
async def leave_protocol(sid: str, data: dict):
    protocol_id = data.get("protocol_id")
    if protocol_id is not None:
        room = f"protocol_{protocol_id}"
        await sio.leave_room(sid, room)

        users_in_room = get_users_on_protocol(protocol_id)
        user_count_data = {
            "protocol_id": int(protocol_id),
            "user_count": len(users_in_room)
        }
        await sio.emit("protocol_user_count", user_count_data, room=room)


def get_users_on_protocol(protocol_id: int) -> list[str]:
    """Returns list of session IDs connected to a specific protocol"""
    room = f"protocol_{protocol_id}"
    namespace = "/"

    if namespace in sio.manager.rooms and room in sio.manager.rooms[namespace]:
        return list(sio.manager.rooms[namespace][room])
    return []


async def get_connections():
    """Returns active SocketIO connections and their rooms"""
    namespace = "/"
    connections_list = []
    rooms_dict = {}

    if namespace in sio.manager.rooms:
        rooms = sio.manager.rooms[namespace]

        for sid in active_connections:
            user_rooms = list(rooms.get(sid, set()))
            user_rooms = [room for room in user_rooms if room is not None and room != sid]

            connections_list.append({"sid": sid, "rooms": user_rooms})

            for room in user_rooms:
                if room not in rooms_dict:
                    rooms_dict[room] = []
                rooms_dict[room].append(sid)

    return {
        "total_connections": len(connections_list),
        "connections": connections_list,
        "rooms": rooms_dict,
    }
