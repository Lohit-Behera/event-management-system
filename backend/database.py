import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import os
import logging
from contextlib import contextmanager
from typing import Generator, Dict, Any, List, Optional

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Configure logging
logger = logging.getLogger(__name__)

class DatabaseConnection:
    def __init__(self):
        self.connection_params = {
            'user': USER,
            'password': PASSWORD,
            'host': HOST,
            'port': PORT,
            'dbname': DBNAME
        }
    
    def get_connection(self):
        """Get a new database connection"""
        try:
            connection = psycopg2.connect(**self.connection_params)
            return connection
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise
    
    @contextmanager
    def get_cursor(self, dict_cursor: bool = True) -> Generator[psycopg2.extensions.cursor, None, None]:
        """Context manager for database cursor"""
        connection = None
        cursor = None
        try:
            connection = self.get_connection()
            if dict_cursor:
                cursor = connection.cursor(cursor_factory=RealDictCursor)
            else:
                cursor = connection.cursor()
            yield cursor
            connection.commit()
        except Exception as e:
            if connection:
                connection.rollback()
            logger.error(f"Database operation failed: {e}")
            raise
        finally:
            if cursor:
                cursor.close()
            if connection:
                connection.close()

# Global database instance
db = DatabaseConnection()

def get_db_cursor():
    """Dependency for FastAPI to get database cursor"""
    return db.get_cursor()

# Database schema creation
def create_tables():
    """Create database tables if they don't exist"""
    with db.get_cursor() as cursor:
        # Create events table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                location VARCHAR NOT NULL,
                start_time TIMESTAMP NOT NULL,
                end_time TIMESTAMP NOT NULL,
                max_capacity INTEGER NOT NULL,
                timezone VARCHAR NOT NULL DEFAULT 'IST'
            )
        """)
        
        # Create attendees table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS attendees (
                id SERIAL PRIMARY KEY,
                name VARCHAR NOT NULL,
                email VARCHAR NOT NULL,
                event_id INTEGER NOT NULL,
                FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
            )
        """)
        
        # Create indexes for better performance
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_attendees_event_id ON attendees(event_id)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_attendees_email ON attendees(email)")

def test_connection():
    """Test database connection"""
    try:
        with db.get_cursor() as cursor:
            cursor.execute("SELECT NOW();")
            result = cursor.fetchone()
            logger.info(f"Database connection successful. Current time: {result}")
            return True
    except Exception as e:
        logger.error(f"Database connection failed: {e}")
        return False