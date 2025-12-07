import sqlite3
import os
from contextlib import contextmanager
from typing import Dict, Any, Optional
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    def __init__(self, db_path: str = "bot.db"):
        self.db_path = db_path
    
    async def initialize(self):
        """Initialize database and create tables if they don't exist"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Create contacts table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS contacts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    name TEXT NOT NULL,
                    phone TEXT,
                    phone_e164 TEXT,
                    email TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Create orders table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    service_type TEXT NOT NULL,
                    details TEXT NOT NULL,
                    contact_info TEXT,
                    status TEXT DEFAULT 'pending',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Create surveys table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS surveys (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    questions TEXT NOT NULL,
                    answers TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Create validated_phones table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS validated_phones (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    original TEXT NOT NULL,
                    normalized TEXT NOT NULL,
                    e164 TEXT NOT NULL,
                    country_code TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.commit()
            logger.info("Database initialized successfully")

    @contextmanager
    def get_connection(self):
        """Context manager for database connections"""
        conn = sqlite3.connect(self.db_path)
        try:
            yield conn
        finally:
            conn.close()

    async def save_contact(self, contact_data: Dict[str, Any]):
        """Save contact data to database"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO contacts (user_id, name, phone, phone_e164, email)
                VALUES (?, ?, ?, ?, ?)
            """, (
                contact_data['user_id'],
                contact_data['name'],
                contact_data.get('phone'),
                contact_data.get('phone_e164'),
                contact_data.get('email')
            ))
            conn.commit()
            logger.info(f"Contact saved: {contact_data['name']}")

    async def save_order(self, order_data: Dict[str, Any]):
        """Save order data to database"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO orders (user_id, service_type, details, contact_info)
                VALUES (?, ?, ?, ?)
            """, (
                order_data['user_id'],
                order_data['service_type'],
                order_data['details'],
                order_data['contact']
            ))
            conn.commit()
            logger.info(f"Order saved: {order_data['service_type']}")

    async def save_survey(self, survey_data: Dict[str, Any]):
        """Save survey data to database"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO surveys (user_id, questions, answers)
                VALUES (?, ?, ?)
            """, (
                survey_data['user_id'],
                str(survey_data['questions']),
                str(survey_data['answers'])
            ))
            conn.commit()
            logger.info(f"Survey saved for user: {survey_data['user_id']}")

    async def save_validated_phone(self, phone_data: Dict[str, Any]):
        """Save validated phone data to database"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO validated_phones (user_id, original, normalized, e164, country_code)
                VALUES (?, ?, ?, ?, ?)
            """, (
                phone_data['user_id'],
                phone_data['original'],
                phone_data['normalized'],
                phone_data['e164'],
                phone_data.get('country_code')
            ))
            conn.commit()
            logger.info(f"Validated phone saved: {phone_data['e164']}")

    async def get_user_contacts(self, user_id: int) -> list:
        """Get all contacts for a user"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM contacts WHERE user_id = ? ORDER BY created_at DESC
            """, (user_id,))
            return cursor.fetchall()

    async def get_user_orders(self, user_id: int) -> list:
        """Get all orders for a user"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
            """, (user_id,))
            return cursor.fetchall()

    async def get_user_surveys(self, user_id: int) -> list:
        """Get all surveys for a user"""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT * FROM surveys WHERE user_id = ? ORDER BY created_at DESC
            """, (user_id,))
            return cursor.fetchall()

# Global database manager instance
db_manager = DatabaseManager()