import random
import os
from mailjet_rest import Client
from schemas.user import User
from schemas.token import Token
from utilities.general_utils import General_Utils
from database.database import Database

class Email_Utils:
    #token generation
    @staticmethod
    def generate_token(user: User) -> Token:
        token = ''.join(random.choices(string.digits, k=5))

        return Token(
            id = Email_Utils.generate_token_id(),
            user_id = user.id,
            token_hash = General_Utils.hash_string(token),
            raw_token = token
        )
    
    #token verification
    @staticmethod
    def verify_token(user:User, token:str) -> bool:
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
            if result.status != "Success" or not result.data:
                return False
            
            #compare the entered token against the stored one
            stored_hash:str = result.data[0]["token_hash"]
            return General_Utils.verify_string(token, stored_hash)


        except Exception as e:
            return False

    #to be used as a decorator, it extends any function that sends the token
    @staticmethod
    def send_email(sender_email:str,reciever_email:str, message:str, token_type:str, TOKEN_VALUE:str, EXPIRY_TIME:str):
        api_key = os.environ['MJ_APIKEY_PUBLIC']
        api_secret = os.environ['MJ_APIKEY_PRIVATE']
        mailjet = Client(auth=(api_key, api_secret))

        data = {
	            'FromEmail': sender_email,
	            'FromName': reciever_email,
	            'Subject': f"CineLog: {token_type}",
	            'Text-part': message,
	            
                'Html-part': """<!DOCTYPE html>
                                <html>
                                <head>
                                <meta charset="UTF-8">
                                <title>CineLog Token</title>
                                </head>
                                <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 20px;">
                                <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 6px; padding: 20px;">
                                <h2 style="color: #2c3e50; margin-top: 0;">Your CineLog Token</h2>
      
                                <p style="font-size: 15px; color: #333;">
                                Dear User,
                                </p>
      
                                <p style="font-size: 15px; color: #333;">
                                A secure token has been generated for you. Please use this token to complete your authentication process. The token will expire after 5 minutes
                                </p>
      
                                <div style="background: #f4f6f8; border: 1px solid #ccc; padding: 15px; margin: 20px 0; font-size: 16px; font-weight: bold; text-align: center; color: #2c3e50;">
                                {{TOKEN_VALUE}}
                                </div>
      
                                <p style="font-size: 14px; color: #555;">
                                <strong>Expiry:</strong> {{EXPIRY_TIME}}
                                </p>
      
                                <h3 style="color: #2c3e50; margin-top: 30px;">Important Information</h3>
                                <ul style="font-size: 14px; color: #555; padding-left: 20px;">
                                <li>This token is valid only until the expiry time shown above.</li>
                                <li>Do not share this token with anyone. It grants access to your account.</li>
                                <li>If you did not request this token, please disregard this message.</li>
                                </ul>
      
                                <p style="font-size: 13px; color: #888; margin-top: 30px;">
                                This is an automated message from CineLog. Please do not reply directly to this email.
                                </p>
                                </div>
                                </body>
                                </html>""",
	            'Recipients': [{'Email':reciever_email}]
            }

        result = mailjet.send.create(data=data)
        return result


        



