import asyncio
import uuid
import os
from dotenv import load_dotenv
from services.email_service import Email_Service

# Ensure your actual imports match your project structure:
# from services.email_service import Email_Service

load_dotenv()

class MockUser:
    def __init__(self, email: str):
        self.id = str(uuid.uuid4())
        self.email = email
        self.username = email.split('@')[0]

async def run_console_test():
    test_emails = [
        "plutopickme@gmail.com", 
        "2863873@students.wits.ac.za", 
        "mjaaathedev@gmail.com"
    ]
    
    for email in test_emails:
        user = MockUser(email)
        print(f"Attempting to send to: {user.email}")
        
        response = await Email_Service.send_verification_email(user)
        
        print(f"Status: {response.status}")
        print(f"Message: {response.message}")
        if response.status == "error":
            print(f"Error Data: {response.data}")
        print("-" * 30)

if __name__ == "__main__":
    if not os.environ.get('RESEND_API_KEY') or not os.environ.get('RESEND_API_KEY'):
        print("WARNING: Mailjet API keys missing. Check your .env file.")
    else:
        asyncio.run(run_console_test())