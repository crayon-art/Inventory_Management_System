from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY

# Create the SQLAlchemy db instance
db = SQLAlchemy()

#create models for the data being added

#db model for postgreSQL categories table
class Categories (db.Model):
    __tablename__ = 'categories' #link model with database table
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)

#db model for postgreSQL manufacturers table
class Manufacturers (db.Model):
    __tablename__ = 'manufacturers' #link model with database table
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)

#db model for postgreSQL suppliers table
class Suppliers (db.Model):
    __tablename__ = 'suppliers'  #link model with database table
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)

#db model for postgreSQL products table
class Products (db.Model):
    __tablename__ = 'products'   #link model with database table
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    manufacturer_id = db.Column(db.Integer, nullable=False)
    category_id = db.Column(db.Integer, nullable=False)
    units = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

#db model for postgreSQL products_suppliers table
class Product_Suppliers(db.Model):
    __tablename__ = 'products_suppliers'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    product_id = db.Column(db.Integer, nullable=False)
    supplier_id = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)

#db model for postgreSQL sales_invoice
class Sales_Receipts(db.Model):
    __tablename__ = 'sales_receipts'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.DateTime, server_default=func.timezone('+04', func.current_timestamp()))
    products = db.Column(ARRAY(db.String), nullable=True)
    units = db.Column(ARRAY(db.Integer), nullable = True)
    unit_price = db.Column(ARRAY(db.Float), nullable = True)
    price = db.Column(db.Float, nullable=False)
