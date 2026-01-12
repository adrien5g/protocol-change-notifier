import asyncio
from rethinkdb import RethinkDB
from rethinkdb.asyncio_net.net_asyncio import Connection
from config import settings

r = RethinkDB()
r.set_loop_type("asyncio")

DB = settings.rethinkdb_db
TABLE = settings.rethinkdb_table

conn: Connection

async def setup():
    global conn
    conn = await r.connect(host=settings.rethinkdb_host, port=settings.rethinkdb_port)
    dbs = await r.db_list().run(conn)
    if DB not in dbs:
        await r.db_create(DB).run(conn)
    tables = await r.db(DB).table_list().run(conn)
    if TABLE not in tables:
        await r.db(DB).table_create(TABLE).run(conn)
        await asyncio.sleep(2)

    for _ in range(10):
        try:
            status = await r.db(DB).table(TABLE).status().run(conn)
            if status.get('status', {}).get('all_replicas_ready'):
                break
        except Exception:
            pass
        await asyncio.sleep(1)

async def update_modified(process_id: int):
    await r.db(DB).table(TABLE).insert({
        "id": process_id,
        "modified": r.now()
    }, conflict="update").run(conn)

async def watch_changes():
    cursor = await r.db(DB).table(TABLE).changes().run(conn)
    async for change in cursor:
        yield change
