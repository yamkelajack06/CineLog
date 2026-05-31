import random
import os
import string
import smtplib
from email.message import EmailMessage
from datetime import datetime, timedelta
from dotenv import load_dotenv
from schemas.user import UserInDB
from schemas.token import Token
from utilities.general_utils import General_Utils
from database.database import Database

load_dotenv() 
class Email_Utils:
    #token generation
    @staticmethod
    def generate_token(user: UserInDB) -> Token:
        token = ''.join(random.choices(string.digits, k=5))
        return Token(
            id = General_Utils.generate_random_id(),
            user_id = user.id,
            token_hash = General_Utils.hash_string(token),
            raw_token = token,
            expiry = datetime.now() + timedelta(minutes=5)
        )
    
    #token verification
    @staticmethod
    def verify_token(user: UserInDB, token: str) -> bool:
        try:
            #get the token associated with the user
            result = Database.query(
                "SELECT token_hash FROM verification_tokens "
                "WHERE user_id = :user_id",
                {
                    "user_id": user.id,
                }
            )
            #check if any is in the database
            if result.status != "success" or not result.data:
                return False
            
            #compare the entered token against the stored one
            stored_hash: str = result.data[0]["token_hash"]
            is_valid = General_Utils.verify_string(token, stored_hash)

            # If valid, clean up both the DB and the local state
            if is_valid:
                # Delete token from database
                Database.query(
                    "DELETE FROM verification_tokens WHERE user_id = :user_id",
                    {"user_id": user.id}
                )

                #update user status to verified
                Database.query(
                    "UPDATE users SET status = 'verified' WHERE id = :user_id",
                {"user_id": user.id}
                )
                
                # Delete the stored token from local dictionary
                from services.email_service import Email_Service
                Email_Service.pending_tokens.pop(user.id, None)

            return is_valid

        except Exception as e:
            return False

    #sends the email to the user
    @staticmethod
    def send_email(receiver_email: str, token_type: str, token_value: str, expiry_time: str):
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        username = os.getenv("SMTP_USERNAME")  
        password = os.getenv("SMTP_PASSWORD")

        if not username or not password:
            class MockError:
                status_code = 500
                def json(self): return {"error": "SMTP credentials missing"}
            return MockError()

        msg = EmailMessage()
        msg["Subject"] = f"CineLog: {token_type}"
        msg["From"] = username
        msg["To"] = receiver_email

        html_content = f"""<!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <title>CineLog Token</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 6px; padding: 20px;">
        <h2 style="color: #2c3e50; margin-top: 0;">Your CineLog Token</h2>
        <p style="font-size: 15px; color: #333;">Dear User,</p>
        <p style="font-size: 15px; color: #333;">A secure token has been generated for you. Please use this token to complete your authentication process. The token will expire after 5 minutes.</p>
        <div style="background: #f4f6f8; border: 1px solid #ccc; padding: 15px; margin: 20px 0; font-size: 16px; font-weight: bold; text-align: center; color: #2c3e50;">
        {token_value}
        </div>
        <p style="font-size: 14px; color: #555;"><strong>Expiry:</strong> {expiry_time}</p>
        <h3 style="color: #2c3e50; margin-top: 30px;">Important Information</h3>
        <ul style="font-size: 14px; color: #555; padding-left: 20px;">
        <li>This token is valid only until the expiry time shown above.</li>
        <li>Do not share this token with anyone. It grants access to your account.</li>
        <li>If you did not request this token, please disregard this message.</li>
        </ul>
        <p style="font-size: 13px; color: #888; margin-top: 30px;">This is an automated message from CineLog. Please do not reply directly to this email.</p>
        </div>
        </body>
        </html>"""

        msg.set_content("Please enable HTML to view this message.")
        msg.add_alternative(html_content, subtype="html")

        try:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(username, password)
                server.send_message(msg)
            
            class MockResponse:
                status_code = 200
                def json(self): return {"message": "success"}
            return MockResponse()

        except Exception as e:
            class MockError:
                status_code = 500
                def json(self): return {"error": str(e)}
            return MockError()