import os

from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_KEY"]
JWT_SECRET_KEY = os.environ["JWT_SECRET_KEY"]

# GitHub 图床配置
GITHUB_TOKEN = os.environ["GITHUB_TOKEN"]
GITHUB_REPO = os.environ["GITHUB_REPO"]
GITHUB_BRANCH = os.getenv("GITHUB_BRANCH", "main")
GITHUB_IMG_PATH = os.getenv("GITHUB_IMG_PATH", "images")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
