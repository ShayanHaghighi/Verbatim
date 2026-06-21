from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import random

from .models import Base, Player, Quote, QuoteModel

# --- Database Setup ---
DB_FILE = "new_db.sqlite"
engine = create_engine(f"sqlite:///{DB_FILE}")
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)

# --- Database Management Functions ---

def init_db():
    """Initializes the database and populates it with some sample data."""
    Base.metadata.create_all(engine)
    session = DBSession()
    session.expire_on_commit = False
    # Prevent re-populating with the same data
    if session.query(Player).count() == 0:
        # Add sample players
        player1 = Player(name="Billy")
        player2 = Player(name="Barry")
        player3 = Player(name="Bobby")



        session.add_all([player1, player2,player3])
        session.commit()

        # Add sample quotes
        quotes_data = [
            {"player": player1, "quote_text": "The only way to do great work is to love what you do."},
            {"player": player3, "quote_text": "Strive not to be a success, but rather to be of value."},
            {"player": player2, "quote_text": "The mind is everything. What you think you become."},
            {"player": player2, "quote_text": "An unexamined life is not worth living."},
            {"player": player1, "quote_text": "I have not failed. I've just found 10,000 ways that won't work."},
        ]
        for q in quotes_data:
            session.add(Quote(**q))
        session.commit()

    session.close()

def get_all_player_names():
    """Returns a list of all player names."""
    session = DBSession()
    players = session.query(Player.name).all()
    session.close()
    return [player[0] for player in players]

def get_random_quotes(count=1):
    """Returns a random sample of quotes from the database."""
    session = DBSession()
    quotes = session.query(Quote).all()

    if count >= len(quotes):
        res =  list(map(lambda quote: QuoteModel(quote.quote_text,quote.player.name), quotes))
    else:
        res =  list(map(lambda quote: QuoteModel(quote.quote_text,quote.player.name), random.sample(quotes, count)))

    session.close()

    return res

def get_total_quotes_count():
    """Returns the total number of quotes in the database."""
    session = DBSession()
    count = session.query(Quote).count()
    session.close()
    return count

if __name__ == '__main__':
    # A simple script to initialize and test the db functions
    print("Initializing database...")
    init_db()
    print("Database initialized.")

    print("\nAll Players:")
    print(get_all_player_names())

    print("\nTotal quotes count:")
    print(get_total_quotes_count())

    print("\nRandom quote:")
    random_quote = get_random_quotes()
    if random_quote:
        print(f"- '{random_quote[0].quote_text}' by {random_quote[0].player.name}")
