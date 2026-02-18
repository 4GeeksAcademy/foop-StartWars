import os
import requests
import time

BASE_URL = "https://raw.githubusercontent.com/tbone849/star-wars-guide/master/build/assets/img"
OUTPUT_DIR = "public/img"

CATEGORIES = {
    "characters": (1, 83),
    "planets": (1, 60),
    "starships": (1, 75),
    "vehicles": (1, 76),
    "species": (1, 37),
    "films": (1, 7)
}

def download_file(url, folder, filename):
    try:
        response = requests.get(url, timeout=10, headers={'User-Agent': 'Mozilla/5.0'})
        if response.status_code == 200:
            if 'image' in response.headers.get('Content-Type', ''):
                with open(f"{folder}/{filename}", 'wb') as f:
                    f.write(response.content)
                print(f"✅ Descargado: {filename}")
            else:
                 print(f"⚠️ No es imagen ({response.headers.get('Content-Type')}): {url}")
        else:
            print(f"⚠️ No existe (404): {url}")
    except Exception as e:
        print(f"❌ Error descargando {url}: {e}")

def main():
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)

    print("--- 🚀 Iniciando descarga de imágenes de la Galaxia ---")
    
    for category, (start, end) in CATEGORIES.items():
        cat_path = f"{OUTPUT_DIR}/{category}"
        if not os.path.exists(cat_path):
            os.makedirs(cat_path)
            
        print(f"\n📂 Procesando categoría: {category}...")
        
        for i in range(start, end + 1):
            filename = f"{i}.jpg"
            url = f"{BASE_URL}/{category}/{filename}"
            
            if not os.path.exists(f"{cat_path}/{filename}"):
                download_file(url, cat_path, filename)
                time.sleep(0.1) 
            else:
                print(f"⏩ Ya existe: {category}/{filename}")

    print("\n--- 🏁 Misión Cumplida. Imágenes guardadas en /public/img ---")

if __name__ == "__main__":
    main()