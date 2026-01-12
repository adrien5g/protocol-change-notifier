from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio

from background import watch_protocol_changes
from rethink import setup, update_modified
from sio import sio, get_connections

@asynccontextmanager
async def lifespan(app: FastAPI):
    await setup()
    task = asyncio.create_task(watch_protocol_changes())
    yield
    task.cancel()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

socket_app = socketio.ASGIApp(sio, app)


@app.get("/protocols")
async def get_protocols():
    return list(range(20))


@app.post("/protocol/{process_id}")
async def update_process(process_id: int):
    await update_modified(process_id=process_id)


@app.get("/connections")
async def connections():
    return await get_connections()
