import os
from dotenv import load_dotenv
import psycopg2
from psycopg2 import pool

load_dotenv()

dbconfig = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "dbname": os.getenv("DB_NAME")
}

connection_pool = pool.SimpleConnectionPool(
    minconn=1,
    maxconn=5,
    **dbconfig
)

def get_connection():
    return connection_pool.getconn()

def release_connection(conn):
    connection_pool.putconn(conn)