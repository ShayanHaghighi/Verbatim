import sqlite3
import json
import logging
import sys
from dataclasses import dataclass
from typing import List

# Configure logging to output to the console
logging.basicConfig(
    level=logging.ERROR,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

@dataclass
class Player:
    name: str

@dataclass
class Quote:
    player: Player
    quote_text: str

def load_aliases(json_path: str) -> dict:
    """
    Loads a JSON file of aliases and flattens it into a direct lookup dictionary.
    JSON format expected: {"Canonical Name": ["Alias1", "Alias2"]}
    Returns: {"Alias1": "Canonical Name", "Alias2": "Canonical Name"}
    """
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        alias_map = {}
        for canonical_name, aliases in data.items():
            for alias in aliases:
                alias_map[alias.lower()] = canonical_name
        return alias_map
    except Exception as e:
        logging.error(f"Failed to load aliases file: {e}")
        sys.exit(1)

def parse_quotes(quotes_path: str, alias_map: dict) -> List[Quote]:
    """
    Parses the quotes text file into Quote and Player objects.
    Aborts and logs if malformed data is found.
    """
    parsed_quotes = []

    try:
        with open(quotes_path, 'r', encoding='utf-8') as f:
            content = f.read().strip()
    except Exception as e:
        logging.error(f"Failed to read quotes file: {e}")
        sys.exit(1)

    # Split the file by double newlines to process quote blocks
    blocks = content.split('\n\n')

    for i, block in enumerate(blocks):
        lines:str = [line.strip() for line in block.split('\n') if line.strip()]
        if lines[0].startswith("#"):
            continue

        # Validation 1: Every block should have exactly two lines (Quote and Author)
        if len(lines) != 2:
            logging.error(f"Malformed quote at block {i + 1}: Expected exactly 2 lines (quote and author), found {len(lines)}.\nContent: {block}")
            sys.exit(1)

        quote_line, author_line = lines

        # Validation 2: Quote must be enclosed in double quotes
        if not (quote_line.startswith('"') and quote_line.endswith('"')):
            logging.error(f"Malformed quote at block {i + 1}: Quote text must be enclosed in double quotes.\nLine: {quote_line}")
            sys.exit(1)

        # Validation 3: Author must start with a hyphen
        if not author_line.startswith('-'):
            logging.error(f"Malformed author at block {i + 1}: Author line must start with a hyphen '-'.\nLine: {author_line}")
            sys.exit(1)

        # Extract values
        quote_text = quote_line[1:-1] # Strip the surrounding double quotes
        raw_author = author_line[1:].strip() # Strip the hyphen and whitespace

        # Resolve the author's alias (case-insensitive lookup, defaulting to the raw author name if not found)
        canonical_author = alias_map.get(raw_author.lower(), raw_author)

        # Create objects
        player = Player(name=canonical_author)
        quote = Quote(player=player, quote_text=quote_text)

        parsed_quotes.append(quote)

    return parsed_quotes

def init_database(db_path: str) -> sqlite3.Connection:
    """
    Initializes the SQLite database and creates necessary tables.
    """
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
                   CREATE TABLE IF NOT EXISTS players (
                                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                         name TEXT UNIQUE NOT NULL
                   )
                   ''')

    cursor.execute('''
                   CREATE TABLE IF NOT EXISTS quotes (
                                                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                        player_id INTEGER NOT NULL,
                                                        quote_text TEXT NOT NULL,
                                                        FOREIGN KEY (player_id) REFERENCES player (id)
                       )
                   ''')

    conn.commit()
    return conn

def insert_data(conn: sqlite3.Connection, quotes: List[Quote]):
    """
    Inserts Player and Quote objects into the database.
    """
    cursor = conn.cursor()

    for quote_obj in quotes:
        # Insert the Player (IGNORE if they already exist in the database)
        cursor.execute('INSERT OR IGNORE INTO players (name) VALUES (?)', (quote_obj.player.name,))

        # Retrieve the Player's ID (whether just inserted or previously existing)
        cursor.execute('SELECT id FROM players WHERE name = ?', (quote_obj.player.name,))
        player_id = cursor.fetchone()[0]

        # Insert the Quote
        cursor.execute(
            'INSERT INTO quotes (player_id, quote_text) VALUES (?, ?)',
            (player_id, quote_obj.quote_text)
        )

    conn.commit()
    print(f"Successfully inserted {len(quotes)} quotes into the database.")

def main():
    # Define file paths
    QUOTES_FILE = 'quotes.txt'
    ALIASES_FILE = 'aliases.json'
    DATABASE_FILE = 'quotes_db.sqlite'

    # 1. Load aliases mapping
    alias_map = load_aliases(ALIASES_FILE)

    # 2. Parse text file into objects
    quotes = parse_quotes(QUOTES_FILE, alias_map)

    # 3. Setup database
    conn = init_database(DATABASE_FILE)

    # 4. Write objects to database
    try:
        insert_data(conn, quotes)
    except sqlite3.Error as e:
        logging.error(f"Database error occurred: {e}")
        sys.exit(1)
    finally:
        conn.close()

if __name__ == "__main__":
    main()