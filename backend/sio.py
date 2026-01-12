import socketio
from loguru import logger

sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")


async def get_total_connections():
    namespace = "/"
    sessions = set()

    if namespace in sio.manager.rooms:
        rooms = sio.manager.rooms[namespace]
        for room_name, sids in rooms.items():
            if len(sids) == 1 and room_name in sids:
                sessions.add(room_name)

    return len(sessions)


async def broadcast_total_connections():
    total = await get_total_connections()
    await sio.emit("total_connections", {"total_connections": total})


@sio.event
async def connect(sid: str, _):
    logger.info(f"Client connected: {sid}")
    await broadcast_total_connections()


@sio.event
async def disconnect(sid: str):
    logger.info(f"Client disconnected: {sid}")
    await broadcast_total_connections()


@sio.on("join_protocol")
async def join_protocol(sid: str, data: dict):
    protocol_id = data.get("protocol_id")
    if protocol_id is not None:
        room = f"protocol_{protocol_id}"
        await sio.enter_room(sid, room)
        logger.info(f"Client {sid} joined room {room}")


@sio.on("leave_protocol")
async def leave_protocol(sid: str, data: dict):
    protocol_id = data.get("protocol_id")
    if protocol_id is not None:
        room = f"protocol_{protocol_id}"
        await sio.leave_room(sid, room)
        logger.info(f"Client {sid} left room {room}")


async def get_connections():
    """Returns active SocketIO connections and their rooms"""
    namespace = "/"
    connections_list = []
    rooms_dict = {}

    if namespace in sio.manager.rooms:
        rooms = sio.manager.rooms[namespace]

        for sid in rooms.keys():
            if sid and sid != namespace:
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
