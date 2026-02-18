"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, People, Planet, Vehicle, Spaceship, Species, Film, Favorite, Todo
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def handle_signup():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    if not email or not password:
        return jsonify({"msg": "Email and password are required"}), 400

    existing_user = db.session.execute(db.select(User).filter_by(email=email)).scalar_one_or_none()
    if existing_user:
        return jsonify({"msg": "User already exists"}), 400

    new_user = User(email=email, password=password, is_active=True)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"msg": "User created successfully"}), 201

@api.route('/token', methods=['POST'])
def handle_login():
    body = request.get_json()
    email = body.get("email")
    password = body.get("password")

    user = db.session.execute(db.select(User).filter_by(email=email, password=password)).scalar_one_or_none()

    if not user:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"token": access_token, "user_id": user.id}), 200

@api.route('/users', methods=['GET'])
def get_all_users():
    users = db.session.execute(db.select(User)).scalars()
    return jsonify([user.serialize() for user in users]), 200

@api.route('/users/favorites', methods=['GET'])
@jwt_required()
def get_user_favorites():
    current_user_id = get_jwt_identity()
    user = db.session.get(User, current_user_id)
    return jsonify([fav.serialize() for fav in user.favorites]), 200


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

    @api.route(f'/{route_name}', methods=['POST'])
    def create_item():
        body = request.get_json()
        name = body.get("name") or body.get("title")
        if not name:
            return jsonify({"msg": "Name/Title is required"}), 400
        
        valid_keys = {c.name for c in Model.__table__.columns if c.name not in ['id']}
        filtered_body = {k: v for k, v in body.items() if k in valid_keys}

        new_item = Model(**filtered_body)
        db.session.add(new_item)
        db.session.commit()
        return jsonify({"msg": "Created", "item": new_item.serialize()}), 201

    @api.route(f'/{route_name}/<int:id>', methods=['PUT'])
    def update_item(id):
        item = db.session.get(Model, id)
        if not item: return jsonify({"msg": "Not found"}), 404
        
        body = request.get_json()
        valid_keys = {c.name for c in Model.__table__.columns if c.name not in ['id']}
        
        for key, value in body.items():
            if key in valid_keys:
                setattr(item, key, value)
        
        db.session.commit()
        return jsonify({"msg": "Updated", "item": item.serialize()}), 200

    @api.route(f'/{route_name}/<int:id>', methods=['DELETE'])
    def delete_item(id):
        item = db.session.get(Model, id)
        if not item: return jsonify({"msg": "Not found"}), 404
        
        db.session.delete(item)
        db.session.commit()
        return jsonify({"msg": "Deleted"}), 200

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
        return jsonify({"msg": "Favorite added"}), 201

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
    create_item.__name__ = f'create_{route_name}'
    update_item.__name__ = f'update_{route_name}'
    delete_item.__name__ = f'delete_{route_name}'
    add_fav.__name__ = f'add_fav_{route_name}'
    delete_fav.__name__ = f'delete_fav_{route_name}'

generate_endpoints(People, 'people')
generate_endpoints(Planet, 'planet')
generate_endpoints(Vehicle, 'vehicle')
generate_endpoints(Spaceship, 'spaceship')
generate_endpoints(Species, 'species')
generate_endpoints(Film, 'film')

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
    if not body.get("label"): return jsonify({"msg": "Label required"}), 400
    
    new_todo = Todo(label=body["label"], done=False, user_id=current_user_id)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify(new_todo.serialize()), 201

@api.route('/todos/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_todo(id):
    current_user_id = get_jwt_identity()
    todo = db.session.get(Todo, id)
    if not todo or todo.user_id != current_user_id:
        return jsonify({"msg": "Todo not found or unauthorized"}), 404
    
    db.session.delete(todo)
    db.session.commit()
    return jsonify({"msg": "Deleted"}), 200