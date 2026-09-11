import os
from app import create_app

env= os.environ.get('FLASK_ENV', 'development')
app = create_app(config_name=env)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
