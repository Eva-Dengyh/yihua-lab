module.exports = {
  apps: [
    {
      name: "frontend",
      cwd: "/opt/yihua-lab/frontend",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "backend",
      cwd: "/opt/yihua-lab/backend",
      interpreter: "/opt/yihua-lab/backend/.venv/bin/python",
      script: "/opt/yihua-lab/backend/.venv/bin/gunicorn",
      args: "-w 4 -b 127.0.0.1:8000 'app:create_app()'",
      env: {
        FLASK_DEBUG: "false",
      },
    },
  ],
};
