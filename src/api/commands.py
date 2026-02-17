
import click
from api.models import db, User, People, Planet, Vehicle, Spaceship, Species, Film, Favorite
import requests

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
    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("--- 🚀 Iniciando Inyección Masiva de Datos ---")

        # 1. Usuario Base
        if not db.session.execute(db.select(User).filter_by(email="test@test.com")).scalar_one_or_none():
            user = User(email="test@test.com", 
                        password="123", 
                        is_active=True)
            db.session.add(user)
            print("✅ Usuario creado.")

        def fetch_and_save(url, Model, mapping_func, name_key='name'):
            try:
                print(f"📡 Conectando a {url}...")
                response = requests.get(url)
                data = response.json()
                results = data.get('results', []) or data.get('result', [])
                
                count = 0
                for item in results:                    
                    if name_key == 'title':
                         check_val = item['properties']['title'] if 'properties' in item else item['title']
                         exists = db.session.execute(db.select(Model).filter_by(title=check_val)).scalar_one_or_none()
                    else:
                        check_val = item['properties']['name'] if 'properties' in item else item['name']
                        exists = db.session.execute(db.select(Model).filter_by(name=check_val)).scalar_one_or_none()
                    
                    if not exists:
                        props = item.get('properties', item) 
                        new_obj = mapping_func(props)
                        db.session.add(new_obj)
                        count += 1
                
                db.session.commit()
                print(f"✅ {count} registros agregados para {Model.__tablename__}.")
            except Exception as e:
                print(f"❌ Error en {Model.__tablename__}: {e}")
                db.session.rollback()

        # People
        fetch_and_save("https://www.swapi.tech/api/people?page=1&limit=10", People, 
            lambda p: People(name=p['name'], height=p.get('height'), mass=p.get('mass'), hair_color=p.get('hair_color')))

        # Planets
        fetch_and_save("https://www.swapi.tech/api/planets?page=1&limit=10", Planet,
            lambda p: Planet(name=p['name'], climate=p.get('climate'), terrain=p.get('terrain'), population=p.get('population')))

        # Vehicles
        fetch_and_save("https://www.swapi.tech/api/vehicles?page=1&limit=10", Vehicle,
            lambda p: Vehicle(name=p['name'], model=p.get('model'), manufacturer=p.get('manufacturer')))

        # Spaceships (Starships en SWAPI)
        fetch_and_save("https://www.swapi.tech/api/starships?page=1&limit=10", Spaceship,
            lambda p: Spaceship(name=p['name'], model=p.get('model'), starship_class=p.get('starship_class')))

        # Species
        fetch_and_save("https://www.swapi.tech/api/species?page=1&limit=10", Species,
            lambda p: Species(name=p['name'], classification=p.get('classification'), language=p.get('language')))

        # Films
        fetch_and_save("https://www.swapi.tech/api/films", Film,
            lambda p: Film(title=p['title'], director=p.get('director'), opening_crawl=p.get('opening_crawl')), name_key='title')

        print("--- 🏁 Inyección Completa ---")