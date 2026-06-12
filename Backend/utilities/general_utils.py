from passlib.context import CryptContext
import uuid

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class General_Utils:
    @staticmethod
    def hash_string(string: str) -> str:
        return pwd_context.hash(string)

    @staticmethod
    def verify_string(plain: str, hashed: str) -> bool:
        return pwd_context.verify(plain, hashed)
    
    @staticmethod
    def generate_random_id() -> str:
        return str(uuid.uuid4())