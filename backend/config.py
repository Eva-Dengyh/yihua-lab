import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
