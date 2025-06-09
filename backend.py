from flask import Flask, request, jsonify, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
import pandas as pd
import json
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///productivity.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads'

db = SQLAlchemy(app)
CORS(app)

# Modelo base com funcionalidades CRUD
class BaseModel(db.Model):
    __abstract__ = True
    
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def save(self):
        db.session.add(self)
        db.session.commit()
        return self
    
    def delete(self):
        db.session.delete(self)
        db.session.commit()
    
    def to_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

# Modelo para Vitórias Diárias
class DailyWin(BaseModel):
    __tablename__ = 'daily_wins'
    
    text = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    notes = db.Column(db.Text)
    date = db.Column(db.Date, default=datetime.utcnow().date)
    
    def to_dict(self):
        data = super().to_dict()
        data['created_at'] = self.created_at.isoformat() if self.created_at else None
        data['updated_at'] = self.updated_at.isoformat() if self.updated_at else None
        data['date'] = self.date.isoformat() if self.date else None
        return data

# Modelo para Projetos
class Project(BaseModel):
    __tablename__ = 'projects'
    
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='Em andamento')
    area = db.Column(db.String(100))  # UFF, ONS, Coding, etc.
    priority = db.Column(db.Integer, default=1)
    estimated_hours = db.Column(db.Float)
    actual_hours = db.Column(db.Float, default=0)
    
    def to_dict(self):
        data = super().to_dict()
        data['created_at'] = self.created_at.isoformat() if self.created_at else None
        data['updated_at'] = self.updated_at.isoformat() if self.updated_at else None
        return data

# Modelo para Tarefas
class Task(BaseModel):
    __tablename__ = 'tasks'
    
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    completed = db.Column(db.Boolean, default=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    due_date = db.Column(db.Date)
    
    project = db.relationship('Project', backref='tasks')
    
    def to_dict(self):
        data = super().to_dict()
        data['created_at'] = self.created_at.isoformat() if self.created_at else None
        data['updated_at'] = self.updated_at.isoformat() if self.updated_at else None
        data['due_date'] = self.due_date.isoformat() if self.due_date else None
        return data

# Decorador para rotas CRUD automáticas
def create_crud_routes(model, name):
    """Gera rotas CRUD automaticamente para um modelo"""
    
    @app.route(f'/api/{name}', methods=['GET'])
    def list_items():
        try:
            # Parâmetros de paginação
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            
            # Filtros
            filters = {}
            for key, value in request.args.items():
                if hasattr(model, key) and key not in ['page', 'per_page']:
                    filters[key] = value
            
            query = model.query
            
            # Aplicar filtros
            for key, value in filters.items():
                if value.lower() == 'true':
                    query = query.filter(getattr(model, key) == True)
                elif value.lower() == 'false':
                    query = query.filter(getattr(model, key) == False)
                else:
                    query = query.filter(getattr(model, key).like(f'%{value}%'))
            
            # Paginação
            items = query.paginate(page=page, per_page=per_page, error_out=False)
            
            return jsonify({
                'items': [item.to_dict() for item in items.items],
                'total': items.total,
                'page': page,