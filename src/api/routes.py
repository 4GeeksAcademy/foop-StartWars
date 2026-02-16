"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, People, Planet, Favorite, Todo
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
api = Blueprint('api', __name__)
CORS(api)

# --- AUTHENTICATION ---

@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    if "email" not in body or "password" not in body:
        raise APIException("Email and Password are required", 400)

    user = db.session.execute(db.select(User).filter_by(email=body['email'])).scalar_one_or_none()
    if user:
        raise APIException("User already exists", 400)

    new_user = User(email=body['email'], password=body['password'], is_active=True)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201

@api.route('/token', methods=['POST'])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    
    if user is None or user.password != password:
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=str(user.id))
    return jsonify({ "token": access_token, "user_id": user.id })

# --- STARWARS PUBLIC ENDPOINTS ---

@api.route('/people', methods=['GET'])
def get_people():
    people_list = db.session.execute(db.select(People)).scalars()
    return jsonify([person.serialize() for person in people_list]), 200

@api.route('/people/<int:people_id>', methods=['GET'])
def get_person(people_id):
    person = db.session.get(People, people_id)
    if not person:
        return jsonify({"msg": "Person not found"}), 404
    return jsonify(person.serialize()), 200

@api.route('/planets', methods=['GET'])
def get_planets():
    planets_list = db.session.execute(db.select(Planet)).scalars()
    return jsonify([planet.serialize() for planet in planets_list]), 200

@api.route('/planets/<int:planet_id>', methods=['GET'])
def get_planet(planet_id):
    planet = db.session.get(Planet, planet_id)
    if not planet:
        return jsonify({"msg": "Planet not found"}), 404
    return jsonify(planet.serialize()), 200

# --- FAVORITES ---

@api.route('/users/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    return jsonify([fav.serialize() for fav in user.favorites]), 200

@api.route('/favorite/planet/<int:planet_id>', methods=['POST'])
@jwt_required()
def add_favorite_planet(planet_id):
    current_user_id = get_jwt_identity()
    
    planet = db.session.get(Planet, planet_id)
    if not planet:
        return jsonify({"msg": "Planet not found"}), 404

    exists = db.session.execute(db.select(Favorite).filter_by(user_id=current_user_id, planet_id=planet_id)).scalar_one_or_none()
    if exists:
        return jsonify({"msg": "Favorite already exists"}), 400

    new_fav = Favorite(user_id=current_user_id, planet_id=planet_id)
    db.session.add(new_fav)
    db.session.commit()
    return jsonify({"msg": "Planet added to favorites"}), 201

@api.route('/favorite/people/<int:people_id>', methods=['POST'])
@jwt_required()
def add_favorite_people(people_id):
    current_user_id = get_jwt_identity()
    
    person = db.session.get(People, people_id)
    if not person:
        return jsonify({"msg": "Person not found"}), 404

    exists = db.session.execute(db.select(Favorite).filter_by(user_id=current_user_id, people_id=people_id)).scalar_one_or_none()
    if exists:
        return jsonify({"msg": "Favorite already exists"}), 400

    new_fav = Favorite(user_id=current_user_id, people_id=people_id)
    db.session.add(new_fav)
    db.session.commit()
    return jsonify({"msg": "Person added to favorites"}), 201

@api.route('/favorite/planet/<int:planet_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_planet(planet_id):
    current_user_id = get_jwt_identity()
    fav = db.session.execute(db.select(Favorite).filter_by(user_id=current_user_id, planet_id=planet_id)).scalar_one_or_none()
    
    if not fav:
        return jsonify({"msg": "Favorite not found"}), 404
    
    db.session.delete(fav)
    db.session.commit()
    return jsonify({"msg": "Favorite deleted"}), 200

@api.route('/favorite/people/<int:people_id>', methods=['DELETE'])
@jwt_required()
def delete_favorite_people(people_id):
    current_user_id = get_jwt_identity()
    fav = db.session.execute(db.select(Favorite).filter_by(user_id=current_user_id, people_id=people_id)).scalar_one_or_none()
    
    if not fav:
        return jsonify({"msg": "Favorite not found"}), 404
    
    db.session.delete(fav)
    db.session.commit()
    return jsonify({"msg": "Favorite deleted"}), 200

# --- TODO LIST ---

@api.route('/todos', methods=['GET'])
@jwt_required()
def get_todos():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    return jsonify([todo.serialize() for todo in user.todos]), 200

@api.route('/todos', methods=['POST'])
@jwt_required()
def add_todo():
    current_user_id = get_jwt_identity()
    body = request.get_json()
    
    if "label" not in body:
        raise APIException("Label is required", 400)
    
    new_todo = Todo(label=body['label'], done=False, user_id=current_user_id)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.serialize()), 201

@api.route('/todos/<int:todo_id>', methods=['DELETE'])
@jwt_required()
def delete_todo(todo_id):
    current_user_id = get_jwt_identity()
    todo = db.session.get(Todo, todo_id)
    
    if not todo:
        return jsonify({"msg": "Todo not found"}), 404
    
    if str(todo.user_id) != str(current_user_id):
        return jsonify({"msg": "Unauthorized"}), 401
    
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"msg": "Todo deleted"}), 200

@api.route('/forgot-password', methods=['POST'])
def recover_password():
    body = request.get_json()
    email = body.get("email")
    
    if not email:
        return jsonify({"msg": "Email is required"}), 400

    user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    
    if not user:
        return jsonify({"msg": "Si el correo existe, recibirás un enlace de recuperación."}), 200

    return jsonify({"msg": "Correo de recuperación enviado (Simulado)"}), 200