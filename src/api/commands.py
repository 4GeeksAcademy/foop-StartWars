import click
import requests
from api.models import db, User, People, Planet, Vehicle, Spaceship, Species, Film, Favorite, Todo

def setup_commands(app):
    
    @app.cli.command("insert-test-data")
    def insert_test_data():
        print("--- 🚀 Iniciando Inyección Masiva de Datos (Modo Completo) ---")

        if not db.session.execute(db.select(User).filter_by(email="test@test.com")).scalar_one_or_none():
            user = User(email="test@test.com", password="123", is_active=True)
            db.session.add(user)
            print("✅ Usuario admin creado (test@test.com).")
        def fetch_and_save(url, Model, mapping_func, name_key='name'):
            try:
                print(f"📡 Conectando a {url}...")
                response = requests.get(url)
                if response.status_code != 200:
                    print(f"❌ Error HTTP {response.status_code} al conectar con {url}")
                    return

                data = response.json()
                results = data.get('results', []) or data.get('result', []) 
                
                added_count = 0
                existing_count = 0

                for idx, item in enumerate(results):
                    # Get basic info
                    if name_key == 'title': 
                         check_val = item['properties']['title'] if 'properties' in item else item['title']
                    else:
                        check_val = item['properties']['name'] if 'properties' in item else item['name']

                    print(f"   [{idx+1}/{len(results)}] Procesando {check_val}...")

                    # Fetch details if properties are missing
                    props = {}
                    if 'properties' in item:
                        props = item['properties']
                    elif 'url' in item:
                        try:
                            detail_resp = requests.get(item['url'])
                            if detail_resp.status_code == 200:
                                detail_data = detail_resp.json()
                                if 'result' in detail_data and 'properties' in detail_data['result']:
                                    props = detail_data['result']['properties']
                                else:
                                    props = item
                            else:
                                print(f"   ⚠️ Failed to fetch details for {check_val}")
                                props = item
                        except Exception as e:
                            print(f"   ⚠️ Error fetching details for {check_val}: {e}")
                            props = item
                    else:
                        props = item

                    # Check existence
                    if name_key == 'title':
                         exists = db.session.execute(db.select(Model).filter_by(title=check_val)).scalar_one_or_none()
                    else:
                        exists = db.session.execute(db.select(Model).filter_by(name=check_val)).scalar_one_or_none()
                    
                    if not exists:
                        try:
                            # Ensure we don't try to insert unknown fields
                            # mapping_func handles specific fields, so passing extra props is fine as long as mapping_func filters them
                            new_obj = mapping_func(props)
                            db.session.add(new_obj)
                            added_count += 1
                        except KeyError as e:
                            print(f"⚠️ Dato incompleto en {check_val}: falta {e}")
                            continue # Skip if mapping fails
                    else:
                        existing_count += 1
                    
                    # Commit every 5 items to show progress in DB
                    if (idx + 1) % 5 == 0:
                        db.session.commit()
                
                db.session.commit()
                print(f"✅ {Model.__tablename__.upper()}: {added_count} agregados, {existing_count} ya existían.")
            
            except Exception as e:
                print(f"❌ Error crítico procesando {Model.__tablename__}: {e}")
                db.session.rollback()

        fetch_and_save("https://www.swapi.tech/api/people?page=1&limit=100", People, 
            lambda p: People(
                name=p['name'], 
                height=p.get('height'), 
                mass=p.get('mass'), 
                hair_color=p.get('hair_color')
            ))

        fetch_and_save("https://www.swapi.tech/api/planets?page=1&limit=100", Planet,
            lambda p: Planet(
                name=p['name'], 
                climate=p.get('climate'), 
                terrain=p.get('terrain'), 
                population=p.get('population')
            ))

        fetch_and_save("https://www.swapi.tech/api/vehicles?page=1&limit=100", Vehicle,
            lambda p: Vehicle(
                name=p['name'], 
                model=p.get('model'), 
                manufacturer=p.get('manufacturer')
            ))

        fetch_and_save("https://www.swapi.tech/api/starships?page=1&limit=100", Spaceship,
            lambda p: Spaceship(
                name=p['name'], 
                model=p.get('model'), 
                starship_class=p.get('starship_class')
            ))

        fetch_and_save("https://www.swapi.tech/api/species?page=1&limit=100", Species,
            lambda p: Species(
                name=p['name'], 
                classification=p.get('classification'), 
                language=p.get('language')
            ))

        fetch_and_save("https://www.swapi.tech/api/films", Film,
            lambda p: Film(
                title=p['title'], 
                director=p.get('director'), 
                opening_crawl=p.get('opening_crawl')
            ), name_key='title')

        print("--- 🏁 Base de datos sincronizada al 100% ---")