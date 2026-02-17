"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, People, Planet, Vehicle, Spaceship, Species, Film, Favorite, Todo
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
def generate_endpoints(Model, route_name):
    @api.route(f'/{route_name}', methods=['GET'])
    def get_all_items():
        items = db.session.execute(db.select(Model)).scalars()
        return jsonify([item.serialize() for item in items]), 200

    @api.route(f'/{route_name}/<int:id>', methods=['GET'])
    def get_single_item(id):
        item = db.session.get(Model, id)
        if not item: return jsonify({"msg": "Not found"}), 404
        return jsonify(item.serialize()), 200

    @api.route(f'/favorite/{route_name}/<int:id>', methods=['POST'])
    @jwt_required()
    def add_fav(id):
        current_user_id = get_jwt_identity()
        item = db.session.get(Model, id)
        if not item: return jsonify({"msg": "Not found"}), 404
        
        filter_kwargs = {'user_id': current_user_id, f'{route_name}_id': id}
        exists = db.session.execute(db.select(Favorite).filter_by(**filter_kwargs)).scalar_one_or_none()
        if exists: return jsonify({"msg": "Favorite already exists"}), 400
        
        new_fav = Favorite(**filter_kwargs)
        db.session.add(new_fav)
        db.session.commit()
        return jsonify({"msg": "Added to favorites"}), 201

    @api.route(f'/favorite/{route_name}/<int:id>', methods=['DELETE'])
    @jwt_required()
    def delete_fav(id):
        current_user_id = get_jwt_identity()
        filter_kwargs = {'user_id': current_user_id, f'{route_name}_id': id}
        fav = db.session.execute(db.select(Favorite).filter_by(**filter_kwargs)).scalar_one_or_none()
        if not fav: return jsonify({"msg": "Favorite not found"}), 404
        
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"msg": "Favorite deleted"}), 200

    get_all_items.__name__ = f'get_{route_name}s'
    get_single_item.__name__ = f'get_{route_name}'
    add_fav.__name__ = f'add_fav_{route_name}'
    delete_fav.__name__ = f'delete_fav_{route_name}'

generate_endpoints(People, 'people')
generate_endpoints(Planet, 'planet')
generate_endpoints(Vehicle, 'vehicle')
generate_endpoints(Spaceship, 'spaceship')
generate_endpoints(Species, 'species')
generate_endpoints(Film, 'film')

# --- FAVORITES ---

@api.route('/users/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    return jsonify([fav.serialize() for fav in user.favorites]), 200

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