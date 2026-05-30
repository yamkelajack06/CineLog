import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv
from utilities.response import ApiResponse

load_dotenv()

class Database:
    engine = None

    #setup the database
    @classmethod
    def setup(cls):
        db_url = os.getenv("CONNECTION_STRING")
        cls.engine = create_engine(db_url)

    #custom query method for database interaction
    @staticmethod
    def query(sql_string: str, params: dict = None):
        if not Database.engine:
            Database.setup()
            
        try:
            with Database.engine.connect() as conn:
                #execute query
                result = conn.execute(text(sql_string), params or {})
                conn.commit()
                
                #format database return data
                if result.returns_rows:
                    data = []
                    for row in result:
                        data.append(dict(row._mapping))
                else:
                    data = result.rowcount
                
                return ApiResponse(status="success", data=data)
                
        except Exception as e:
            return ApiResponse(status="error", message=str(e))
