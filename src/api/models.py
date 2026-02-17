from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(80), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    
    favorites: Mapped[List["Favorite"]] = relationship(back_populates="user")
    todos: Mapped[List["Todo"]] = relationship(back_populates="user")

    def serialize(self):
        return { "id": self.id, "email": self.email }

# --- ENTIDADES STAR WARS ---

class People(db.Model):
    __tablename__ = 'people'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    height: Mapped[str] = mapped_column(String(50), nullable=True)
    mass: Mapped[str] = mapped_column(String(50), nullable=True)
    hair_color: Mapped[str] = mapped_column(String(50), nullable=True)
    
    def serialize(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "height": self.height, 
            "mass": self.mass, 
            "hair_color": self.hair_color 
        }

class Planet(db.Model):
    __tablename__ = 'planet'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    climate: Mapped[str] = mapped_column(String(80), nullable=True)
    terrain: Mapped[str] = mapped_column(String(80), nullable=True)
    population: Mapped[str] = mapped_column(String(80), nullable=True)

    def serialize(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "climate": self.climate, 
            "terrain": self.terrain, 
            "population": self.population 
        }

class Vehicle(db.Model):
    __tablename__ = 'vehicle'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    model: Mapped[str] = mapped_column(String(120), nullable=True)
    manufacturer: Mapped[str] = mapped_column(String(120), nullable=True)

    def serialize(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "model": self.model, 
            "manufacturer": self.manufacturer 
        }

class Spaceship(db.Model):
    __tablename__ = 'spaceship'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    model: Mapped[str] = mapped_column(String(120), nullable=True)
    starship_class: Mapped[str] = mapped_column(String(120), nullable=True)

    def serialize(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "model": self.model, 
            "starship_class": self.starship_class 
        }

class Species(db.Model):
    __tablename__ = 'species'
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    classification: Mapped[str] = mapped_column(String(120), nullable=True)
    language: Mapped[str] = mapped_column(String(120), nullable=True)

    def serialize(self):
        return {
            "id": self.id, 
            "name": self.name, 
            "classification": self.classification, 
            "language": self.language 
        }

class Film(db.Model):
    __tablename__ = 'film'
    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(120), nullable=False)
    director: Mapped[str] = mapped_column(String(120), nullable=True)
    opening_crawl: Mapped[str] = mapped_column(Text, nullable=True)

    def serialize(self):
        return {
            "id": self.id, 
            "title": self.title, 
            "director": self.director, 
            "opening_crawl": self.opening_crawl 
        }



class Favorite(db.Model):
    __tablename__ = 'favorite'
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    
    planet_id: Mapped[Optional[int]] = mapped_column(ForeignKey('planet.id'), nullable=True)
    people_id: Mapped[Optional[int]] = mapped_column(ForeignKey('people.id'), nullable=True)
    vehicle_id: Mapped[Optional[int]] = mapped_column(ForeignKey('vehicle.id'), nullable=True)
    spaceship_id: Mapped[Optional[int]] = mapped_column(ForeignKey('spaceship.id'), nullable=True)
    species_id: Mapped[Optional[int]] = mapped_column(ForeignKey('species.id'), nullable=True)
    film_id: Mapped[Optional[int]] = mapped_column(ForeignKey('film.id'), nullable=True)

    user: Mapped["User"] = relationship(back_populates="favorites")
    planet: Mapped["Planet"] = relationship()
    people: Mapped["People"] = relationship()
    vehicle: Mapped["Vehicle"] = relationship()
    spaceship: Mapped["Spaceship"] = relationship()
    species: Mapped["Species"] = relationship()
    film: Mapped["Film"] = relationship()

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "planet": self.planet.serialize() if self.planet else None,
            "people": self.people.serialize() if self.people else None,
            "vehicle": self.vehicle.serialize() if self.vehicle else None,
            "spaceship": self.spaceship.serialize() if self.spaceship else None,
            "species": self.species.serialize() if self.species else None,
            "film": self.film.serialize() if self.film else None
        }

class Todo(db.Model):
    __tablename__ = 'todo'
    id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String(200), nullable=False)
    done: Mapped[bool] = mapped_column(Boolean(), default=False)
    user_id: Mapped[int] = mapped_column(ForeignKey('user.id'), nullable=False)
    user: Mapped["User"] = relationship(back_populates="todos")

    def serialize(self):
        return {
            "id": self.id, 
            "label": self.label, 
            "done": self.done 
        }