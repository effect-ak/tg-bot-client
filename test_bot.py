#!/usr/bin/env python3
"""
Simple test script for the Telegram bot
"""

import asyncio
import sys
import os

# Add the project directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from bot import main

async def test_bot():
    """Test bot functionality"""
    print("🤖 Testing bot startup...")
    
    try:
        # Import and test database
        from database import db_manager
        await db_manager.initialize()
        print("✅ Database initialized successfully")
        
        # Test database operations
        print("📊 Testing database operations...")
        
        # Test phone validation
        from validators import phone_validator
        test_phones = [
            "+79991234567",  # Valid Russian number
            "+123456789012",  # Valid number
            "123",           # Invalid - too short
            "+abc1234567",   # Invalid - letters
            "+79123456789",   # Valid Kazakhstan
        ]
        
        for phone in test_phones:
            result = phone_validator.validate_and_normalize(phone)
            print(f"📱 Phone: {phone}")
            print(f"   Valid: {result['is_valid']}")
            if result['is_valid']:
                print(f"   E164: {result['e164']}")
                print(f"   Country: {result.get('country_code', 'Unknown')}")
            else:
                print(f"   Error: {result['error']}")
        
        print("✅ Phone validation tests completed")
        
        print("\n🤖 Bot is ready to start!")
        print("Press Ctrl+C to stop the bot")
        
        # Start the bot
        await main()
        
    except KeyboardInterrupt:
        print("\n🛑 Bot stopped by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_bot())