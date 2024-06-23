import os
import logging
from dotenv import load_dotenv
from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from dbmodels import db, Manufacturers, Suppliers, Products, Product_Suppliers, Categories,Sales_Invoice
from sqlalchemy import create_engine
from datetime import datetime
from sqlalchemy.exc import OperationalError
from sqlalchemy import text
from sqlalchemy import asc

# # Load variables from .env file into environment
load_dotenv()

app = Flask(__name__)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DBINFO')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Configure logging
logging.basicConfig(level=logging.DEBUG)


#server route handling
@app.route("/", methods=['GET'])
def home():
    #Render the html homepage
    html_file_path = os.path.join('index.html')
    return render_template(html_file_path)

@app.route("/inventory", methods=['GET'])
def inventory():
    #Render the html page for inventory
    html_file_path = os.path.join('inventory.html')

    # Check if the request wants JSON data
    if request.args.get('format') == 'json':

        try:
            # Convert data to a format that can be easily sent to the frontend, for example, JSON
            inventory_data = []
            filt = False
            logging.debug(f"ARGUEMENTS: {len(request.args)}")

            #check if the filter is enabled or not
            if len(request.args)>1:
                args = request.args.to_dict()
                args.pop('format', None)
                filter_field, filter_value = next(iter(args.items()))
                filt = True
                logging.debug(f"Filter field: {filter_field}, Filter value: {filter_value}")

            # Load data from the database
            products = Products.query.all()
            manufacturers = Manufacturers.query.all()
            categories = Categories.query.all()
            suppliers = Suppliers.query.all()
            product_suppliers = Product_Suppliers.query.all()


            # Loop through products and match manufacturer, category, and supplier
            for product in products:
                # Find manufacturer
                manufacturer_name = next((manufacturer.name for manufacturer in manufacturers if manufacturer.id == product.manufacturer_id), None)

                # Find category
                category_name = next((category.name for category in categories if category.id == product.category_id), None)

                # Find suppliers and their prices
                supplier_name = None
                supplier_price = None
                for ps in product_suppliers:
                    if ps.product_id == product.id:
                        supplier = next((supplier for supplier in suppliers if supplier.id == ps.supplier_id), None)
                        if supplier:
                            supplier_name = supplier.name
                            supplier_price = ps.price
                            break

                # Log the full names to check if they are correct here
                logging.debug(f"Product ID: {product.id}, Name: {product.name}, Manufacturer: {manufacturer_name}, Category: {category_name}, Supplier: {supplier_name}")

                # Append product data with manufacturer, category, and supplier names to inventory_data

                if filt == True:

                    if filter_field == "Product":
                        if product.name==filter_value:
                            inventory_data.append({
                                "id":product.id,
                                "name": product.name,
                                "manufacturer": manufacturer_name,
                                "category": category_name,
                                "supplier": supplier_name,
                                "units": product.units,
                                "costPrice": supplier_price,
                                "salePrice": product.price
                            })

                    if filter_field == "Manufacturer":
                        if manufacturer_name==filter_value:
                            inventory_data.append({
                                "id":product.id,
                                "name": product.name,
                                "manufacturer": manufacturer_name,
                                "category": category_name,
                                "supplier": supplier_name,
                                "units": product.units,
                                "costPrice": supplier_price,
                                "salePrice": product.price
                            })

                    if filter_field == "Supplier":
                        if supplier_name==filter_value:
                            inventory_data.append({
                                "id":product.id,
                                "name": product.name,
                                "manufacturer": manufacturer_name,
                                "category": category_name,
                                "supplier": supplier_name,
                                "units": product.units,
                                "costPrice": supplier_price,
                                "salePrice": product.price
                            })

                    if filter_field == "Category":
                        if category_name==filter_value:
                            inventory_data.append({
                                "id":product.id,
                                "name": product.name,
                                "manufacturer": manufacturer_name,
                                "category": category_name,
                                "supplier": supplier_name,
                                "units": product.units,
                                "costPrice": supplier_price,
                                "salePrice": product.price
                            })

                else:
                    inventory_data.append({
                        "id":product.id,
                        "name": product.name,
                        "manufacturer": manufacturer_name,
                        "category": category_name,
                        "supplier": supplier_name,
                        "units": product.units,
                        "costPrice": supplier_price,
                        "salePrice": product.price
                    })

            # Sort inventory_data by product ID
            inventory_data = sorted(inventory_data, key=lambda x: x['id'])
            logging.debug(f"DATA: {inventory_data}")
            return jsonify(inventory_data), 200
        except Exception as e:
                return jsonify({"error": str(e)}), 500

    else:
        # Render the HTML page
        return render_template(html_file_path)


@app.route("/inventory/<filter>", methods =['GET'])
def filter_list(filter):
    data = []

    try:
        # Load data from the database
        products = Products.query.all()
        products_ao = Products.query.order_by(asc(Products.name)).all()
        manufacturers = Manufacturers.query.all()
        categories = Categories.query.all()
        suppliers = Suppliers.query.all()
        product_supplers = Product_Suppliers.query.all()

        for p in products:
            if filter == "Product":
                if p.name not in data:
                    data.append(p.name)

            elif filter == "Manufacturer":
                for m in manufacturers:
                    if m.id==p.manufacturer_id:
                        if m.name not in data:
                            data.append(m.name)

            elif filter == "Category":
                for c in categories:
                    if c.id==p.category_id:
                        if c.name not in data:
                            data.append(c.name)

            elif filter == "Supplier":
                for ps in product_supplers:
                    if p.id==ps.product_id:
                        for s in suppliers:
                            if s.id == ps.supplier_id:
                                if s.name not in data:
                                    data.append(s.name)

        for p in products_ao:
            if filter == "Products":
                    data.append([p.id, p.name, p.units, p.price])

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/inventory/<int:product_id>/units", methods =['GET'])
def get_units(product_id):
    data = []

    try:
        # Load data from the database
        products = Products.query.all()

        for p in products:
            if p.id == product_id:
                data.append(p.units)

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/inventory", methods=['POST'])
def submit():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    #populate the database with the information of the new item
    try:
        # Extract data from the request
        product_name = data.get('product_name')
        manufacturer_name = data.get('manufacturer')
        supplier_name = data.get('supplier')
        category = data.get('category')
        units = data.get('units')
        costPrice = data.get('costPrice')
        salePrice = data.get('salePrice')

        logging.debug(f"Received data: {data}")
        logging.debug(f"product: {product_name}")
        logging.debug(f"manufacturer: {manufacturer_name}")
        logging.debug(f"supplier: {supplier_name}")
        logging.debug(f"category: {category}")
        logging.debug(f"units: {units}")
        logging.debug(f"CP: {costPrice}")
        logging.debug(f"SP: {salePrice}")

        #update manufacturer table and extract manufacturer id
        existing_manufacturer = Manufacturers.query.filter_by(name=manufacturer_name).first()
        if existing_manufacturer:
            manufacturer_id = existing_manufacturer.id
            logging.debug(f"Manufacturer exists: {existing_manufacturer.id}")

        else:
            new_manufacturer = Manufacturers(
                name=manufacturer_name
            )
            db.session.add(new_manufacturer)
            db.session.commit()
            manufacturer_id = new_manufacturer.id
            logging.debug(f"Manufacturer: {manufacturer_id}")


        #update supplier table and extract supplier id
        existing_supplier = Suppliers.query.filter_by(name=supplier_name).first()
        if existing_supplier:
            supplier_id = existing_supplier.id

        else:
            new_supplier = Suppliers(
                name=supplier_name
            )
            db.session.add(new_supplier)
            db.session.commit()
            supplier_id = new_supplier.id
            logging.debug(f"Supplier: {supplier_id}")


        # extract category id from category table based on category name
        category_row = Categories.query.filter_by(name=category).first()
        category_id=category_row.id
        logging.debug(f"Category: {category_id}")

        # If the product does not exist, create a new one
        new_product = Products(
            name=product_name,
            manufacturer_id=manufacturer_id,
            category_id=category_id,
            units=units,
            price=salePrice
        )

        db.session.add(new_product)
        db.session.commit()
        logging.debug(f"New Product: {new_product}")

        #update the products_suppliers table
        product_id=new_product.id

        existing_product_supplier = Product_Suppliers.query.filter_by(product_id=product_id, supplier_id=supplier_id).first()
        if existing_product_supplier:
            existing_product_supplier.price = costPrice
        else:
            new_product_supplier = Product_Suppliers(
            product_id=product_id,
            supplier_id=supplier_id,
            price=costPrice
            )
        db.session.add(new_product_supplier)
        db.session.commit()

        return jsonify({"message": "Product created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#Route handler for edititing inventory items
@app.route("/inventory/<int:id>", methods=['PUT'])
def edit(id):
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400


    # Extract data from the request
    #id = data.get('product_id')
    product_name = data.get('product_name')
    manufacturer_name = data.get('manufacturer')
    supplier_name = data.get('supplier')
    category = data.get('category')
    units = data.get('units')
    costPrice = data.get('costPrice')
    salePrice = data.get('salePrice')

    logging.debug(f"Received data: {data}")

    try:
        # Retrieve the product based on row number
        product = db.session.get(Products, id)
        if product is None:
            return jsonify({"error": "Product not found"}), 404

        logging.debug(f"Product found: {product}")

        #update manufacturer table and extract manufacturer id
        existing_manufacturer = Manufacturers.query.filter_by(name=manufacturer_name).first()
        if existing_manufacturer:
            manufacturer_id = existing_manufacturer.id
            logging.debug(f"Manufacturer ID: (existing)")
        else:
            new_manufacturer = Manufacturers(
                name=manufacturer_name
            )
            db.session.add(new_manufacturer)
            db.session.commit()
            manufacturer_id = new_manufacturer.id

            logging.debug(f"Manufacturer ID: {manufacturer_id}")

        #update supplier table and extract supplier id
        existing_supplier = Suppliers.query.filter_by(name=supplier_name).first()
        if existing_supplier:
            supplier_id = existing_supplier.id
            logging.debug(f"Supplier ID (existing): {supplier_id}")
        else:
            new_supplier = Suppliers(
                name=supplier_name
            )
            db.session.add(new_supplier)
            db.session.commit()
            supplier_id = new_supplier.id

            logging.debug(f"Supplier ID: {supplier_id}")

        # extract category id from category table based on category name
        category_row = Categories.query.filter_by(name=category).first()
        if not category_row:
            logging.error(f"Category {category} not found")
            return jsonify({"error": "Category not found"}), 404
        category_id=category_row.id

        logging.debug(f"Category ID: {category_id}")

        # Update product details
        product.name = product_name
        product.manufacturer_id = manufacturer_id
        product.category_id = category_id
        product.units = units
        product.price = salePrice
        db.session.commit()
        logging.debug("Product updated successfully")


        #delete product/supplier entry in products_suppliers table for id
        product_supplier = Product_Suppliers.query.filter_by(product_id=id).all()
        for ps in product_supplier:
            db.session.delete(ps)
        db.session.commit()
        logging.debug("Product suppliers deleted successfully")

        #update the products_suppliers table
        existing_product_supplier = Product_Suppliers.query.filter_by(product_id=product.id, supplier_id=supplier_id).first()
        if existing_product_supplier:
            existing_product_supplier.price = costPrice
        else:
            new_product_supplier = Product_Suppliers(
            product_id=product.id,
            supplier_id=supplier_id,
            price=costPrice
        )
        db.session.add(new_product_supplier)
        db.session.commit()

        logging.debug("Product supplier updated successfully")

        return jsonify({"message": "Product updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

#Route handler for edititing inventory items
@app.route("/inventory/<int:id>", methods=['DELETE'])
def delete(id):

    try:
        # Retrieve the product based on row number
        product = db.session.get(Products, id)
        if product is None:
            return jsonify({"error": "Product not found"}), 404

        logging.debug(f"Product found: {product}")

        #delete product/supplier entry in products_suppliers table for id
        product_supplier = Product_Suppliers.query.filter_by(product_id=id).all()
        for ps in product_supplier:
            db.session.delete(ps)
        db.session.commit()
        logging.debug("Product suppliers deleted successfully")

        # delete product from product table
        db.session.delete(product)
        db.session.commit()
        logging.debug("Product deleted successfully")
        return jsonify({"message": "Product deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

@app.route("/sales", methods=['GET'])
def sales():
    # Render the Sales page
    html_file_path = os.path.join('sales.html')

    # Check if the request wants JSON data
    if request.args.get('format') == 'json':

        try:
            # Convert data to a format that can be easily sent to the frontend, for example, JSON
            sales_data = []

            #Load data from the database
            sales = Sales_Invoice.query.all()
            logging.debug(f"sales_data: {sales}")

            for s in sales:
                # Convert to ISO 8601 string
                date = s.date.isoformat()
                sales_data.append({
                    "id":s.id,
                    "date":date,
                    "price": s.price
                })

            # Sort inventory_data by product ID
            sales_data = sorted(sales_data, key=lambda x: x['id'])
            logging.debug(f"DATA: {sales_data}")
            return jsonify(sales_data), 200

        except Exception as e:
                return jsonify({"error": str(e)}), 500

    else:
        #render the html page
        return render_template(html_file_path)

@app.route("/sales/newsale", methods=['GET'])
def newsale():
        # Render the New Sale page
        html_file_path = os.path.join('newsale.html')
        return render_template(html_file_path)

@app.route("/sales/<int:id>", methods=['GET'])
def template(id):

    if request.args.get('format') == 'json':
        #variables to store data
        data=[]
        unit_price =[]
        price = []
        try:
            # Retrieve the invoice based on id
            sales_invoice = db.session.get(Sales_Invoice, id)
            if sales_invoice is None:
                return jsonify({"error": "Product not found"}), 404

            logging.debug(f"Invoice found: {sales_invoice}")

            #Retrieve product price info from Products table
            products = sales_invoice.products
            for i in range(len(products)):
                product_result = Products.query.filter_by(name=products[i]).first()
                price.append((product_result.price)*(sales_invoice.units[i]))
                unit_price.append(product_result.price)

            # Convert to ISO 8601 string
                date = sales_invoice.date.isoformat()

            data.append({
                "id" : sales_invoice.id,
                "date": date,
                "products" : sales_invoice.products,
                "units" : sales_invoice.units,
                "price" : price,
                "totalPrice" : sales_invoice.price,
                "unitPrice" : unit_price
            })

            logging.debug(f"DATA: {data}")
            return jsonify(data), 200

        except Exception as e:
                return jsonify({"error": str(e)}), 500
    else:
        # Render the details page
        html_file_path = os.path.join('details.html')
        return render_template(html_file_path)


@app.route("/sales/<int:id>", methods=['DELETE'])
def delete_invoice(id):

    try:
        # Retrieve the invoice based on id
        sales_invoice = db.session.get(Sales_Invoice, id)
        if sales_invoice is None:
            return jsonify({"error": "Product not found"}), 404

        logging.debug(f"Invoice found: {sales_invoice}")

        #Delete invoice at id
        db.session.delete(sales_invoice)
        db.session.commit()
        logging.debug("Invoice successfully deleted")
        return jsonify({"message": "Invoice deleted successfully"}), 200

    except Exception as e:
            return jsonify({"error": str(e)}), 500

@app.route("/sales/newsale", methods=['POST'])
def submit_invoice():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No input data provided"}), 400

    #populate the database with the information of the new item
    try:
        # Extract data from the request
        productsArr = data.get('products')
        products_Id = data.get('productsId')
        unitsArr = data.get('units')
        salePrice = data.get('price')

        logging.debug(f"Received data: {data}")
        logging.debug(f"product: {productsArr}")
        logging.debug(f"product_id: {products_Id}")
        logging.debug(f"units: {unitsArr}")
        logging.debug(f"total price: {salePrice}")

        #update product count
        all_products = Products.query.all()
        # for pid in products_Id:
        for i in range(len(products_Id)):
            for pall in all_products:
                if products_Id[i] == pall.id:
                        logging.debug(f"units: {pall.units} - {unitsArr[i]}")
                        pall.units=pall.units-unitsArr[i]
                        db.session.commit()
                        break

        # Create a new invoice
        new_invoice = Sales_Invoice(
            products=productsArr,
            units=unitsArr,
            price=salePrice
        )

        db.session.add(new_invoice)
        db.session.commit()
        logging.debug(f"New Product: {new_invoice}")

        return jsonify({"message": "Product created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/price/<product>", methods=['GET'])
def prod_price(product):
    #create array to store extracted data to be sent back to frontend
    price = 0.00
    try:
        #query databse for info on the product
        product_result = Products.query.filter_by(name=product).first()
        price = product_result.price
        return jsonify(price), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Set debug mode to True
    app.debug = True
    # Get the port number from the environment variable, default to 5000 if not set
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
