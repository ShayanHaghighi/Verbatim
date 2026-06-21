from flask import Flask, jsonify
from .db_management import get_all_player_names, init_db

app = Flask(__name__)

@app.route('/players', methods=['GET'])
def get_players():
    """
    Endpoint to get all player names.
    """
    player_names = get_all_player_names()
    return jsonify(players=player_names)

def run_app():
    # Initialize the database when the app starts
    init_db()
    app.run(debug=True)

if __name__ == '__main__':
    run_app()
