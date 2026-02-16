
import click
from api.models import db, User, People, Planet

"""
In this file, you can add as many commands as you want using the @app.cli.command decorator
Flask commands are usefull to run cronjobs or tasks outside of the API but sill in integration 
with youy database, for example: Import the price of bitcoin every night as 12am
"""
def setup_commands(app):
    
    """ 
    This is an example command "insert-test-users" that you can run from the command line
    by typing: $ flask insert-test-users 5
    Note: 5 is the number of users to add
    """
    @app.cli.command("insert-test-users") # name of our command
    @click.argument("count") # argument of out command
    def insert_test_users(count):
        print("Creating test users")
        for x in range(1, int(count) + 1):
            user = User()
            user.email = "test_user" + str(x) + "@test.com"
            user.password = "123456"
            user.is_active = True
            db.session.add(user)
            db.session.commit()
            print("User: ", user.email, " created.")

        print("All test users created")

    @app.cli.command("insert-test-data")
    def insert_test_data():
        pass
        print("Creating test data")
        
        # Check if data already exists to avoid duplicates
        if db.session.query(User).count() > 0:
            print("Data already exists. Skipping insertion.")
            return

        # Users
        test_user = User(email="test@test.com", password="123", is_active=True)
        db.session.add(test_user)

        # People
        luke = People(id=1, name="Luke Skywalker", height="172", mass="77", hair_color="blond")
        c3po = People(id=2, name="C-3PO", height="167", mass="75", hair_color="gold")
        r2d2 = People(id=3, name="R2-D2", height="96", mass="32", hair_color="n/a")
        db.session.add_all([luke, c3po, r2d2])

        # Planets
        tatooine = Planet(id=1, name="Tatooine", climate="arid", terrain="desert", population="200000")
        alderaan = Planet(id=2, name="Alderaan", climate="temperate", terrain="grasslands, mountains", population="2000000000")
        yavin = Planet(id=3, name="Yavin IV", climate="temperate, tropical", terrain="jungle, rainforests", population="1000")
        db.session.add_all([tatooine, alderaan, yavin])

        db.session.commit()
        print("Test data created successfully")