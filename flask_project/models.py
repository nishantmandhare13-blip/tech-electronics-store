from flask_sqlalchemy import SQLAlchemy
import json

db = SQLAlchemy()

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    brand = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)  # in INR
    gst = db.Column(db.Float, default=18.0)      # e.g., 18%
    available_quantity = db.Column(db.Integer, nullable=False, default=10)
    stock_status = db.Column(db.String(50), nullable=False, default='In Stock')
    discount_rules = db.Column(db.Text, nullable=True) # JSON String
    image = db.Column(db.String(300), nullable=True)
    rating = db.Column(db.Float, default=4.5)
    reviews_count = db.Column(db.Integer, default=15)
    featured = db.Column(db.Boolean, default=False)
    today_offer = db.Column(db.Boolean, default=False)
    latest = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'brand': self.brand,
            'description': self.description,
            'category': self.category,
            'price': self.price,
            'gst': self.gst,
            'availableQuantity': self.available_quantity,
            'stockStatus': self.stock_status,
            'discountRules': json.loads(self.discount_rules) if self.discount_rules else {"rule": "None", "description": "Standard rules"},
            'image': self.image,
            'rating': self.rating,
            'reviewsCount': self.reviews_count,
            'featured': self.featured,
            'todayOffer': self.today_offer,
            'latest': self.latest
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.String(50), primary_key=True)
    order_number = db.Column(db.String(100), unique=True, nullable=False)
    customer_name = db.Column(db.String(150), nullable=False)
    customer_email = db.Column(db.String(150), nullable=False)
    customer_phone = db.Column(db.String(50), nullable=False)
    items_json = db.Column(db.Text, nullable=False)  # Serialized ordered items list
    subtotal = db.Column(db.Float, nullable=False)
    discount_amount = db.Column(db.Float, nullable=False)
    gst_total = db.Column(db.Float, nullable=False)
    final_amount = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='Completed')
    estimated_delivery = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'orderNumber': self.order_number,
            'customerName': self.customer_name,
            'customerEmail': self.customer_email,
            'customerPhone': self.customer_phone,
            'items': json.loads(self.items_json),
            'subtotal': self.subtotal,
            'discountAmount': self.discount_amount,
            'gstTotal': self.gst_total,
            'finalAmount': self.final_amount,
            'timestamp': self.timestamp,
            'status': self.status,
            'estimatedDelivery': self.estimated_delivery
        }

class Customer(db.Model):
    __tablename__ = 'customers'
    
    id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    phone = db.Column(db.String(50), nullable=False)
    address = db.Column(db.Text, nullable=False)
    joined_date = db.Column(db.String(100), nullable=False)
    orders_count = db.Column(db.Integer, default=0)
    total_spent = db.Column(db.Float, default=0.0)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'address': self.address,
            'joinedDate': self.joined_date,
            'ordersCount': self.orders_count,
            'totalSpent': self.total_spent
        }
