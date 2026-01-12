import os
from pydantic import Field
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    # Backend Server
    backend_host: str = Field(default="localhost", alias="BACKEND_HOST")
    backend_port: int = Field(default=9999, alias="BACKEND_PORT")
    
    # RethinkDB
    rethinkdb_host: str = Field(default="localhost", alias="RETHINKDB_HOST")
    rethinkdb_port: int = Field(default=28015, alias="RETHINKDB_PORT")
    rethinkdb_db: str = Field(default="process", alias="RETHINKDB_DB")
    rethinkdb_table: str = Field(default="modified", alias="RETHINKDB_TABLE")

    class Config:
        populate_by_name = True
        case_sensitive = False


settings = Settings()
