import os
import json
import random
from datetime import datetime, timedelta
from flask import Flask, jsonify, request, render_template, send_from_directory
from models import db, Product, Order, Customer

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

# Default admin login credentials
ADMIN_CREDENTIALS = {
    'username': 'admin',
    'password': 'admin123'
}

# ----------------------------------------------------
# DATABASE SEEDER (100 products)
# ----------------------------------------------------
def seed_database():
    if Product.query.first() is not None:
        return # Database already pre-seeded

    print("Pre-seeding SQLite database with 100 electronics items...")
    
    categories = [
        'Laptops', 'Smartphones', 'Tablets', 'Chargers', 'Earbuds', 
        'Smart Watches', 'Hard Drives', 'SSD', 'RAM', 'Monitors', 
        'Keyboards', 'Mouse', 'Printers', 'Routers', 'Educational Software', 
        'Antivirus Software', 'Operating Systems', 'Networking Devices', 'Accessories'
    ]
    
    brands = {
        'Laptops': ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'],
        'Smartphones': ['Apple', 'Samsung', 'OnePlus', 'Google', 'Xiaomi'],
        'Tablets': ['Apple', 'Samsung', 'Xiaomi', 'OnePlus'],
        'Chargers': ['Anker', 'Apple', 'Samsung', 'Spigen', 'Belkin'],
        'Earbuds': ['Sony', 'Apple', 'Bose', 'OnePlus', 'Realme', 'JBL'],
        'Smart Watches': ['Apple', 'Samsung', 'Fitbit', 'Garmin', 'Amazfit'],
        'Hard Drives': ['Seagate', 'WD', 'Toshiba'],
        'SSD': ['Samsung', 'Crucial', 'SanDisk', 'Kingston'],
        'RAM': ['Corsair', 'G.Skill', 'Kingston', 'Crucial'],
        'Monitors': ['LG', 'Samsung', 'Dell', 'ASUS', 'BenQ'],
        'Keyboards': ['Keychron', 'Logitech', 'Razer', 'Redragon'],
        'Mouse': ['Logitech', 'Razer', 'SteelSeries', 'Apple'],
        'Printers': ['HP', 'Canon', 'Epson', 'Brother'],
        'Routers': ['TP-Link', 'Netgear', 'ASUS', 'D-Link'],
        'Educational Software': ['MathWorks', 'Autodesk', 'Duolingo'],
        'Antivirus Software': ['McAfee', 'Norton', 'Kaspersky', 'Quick Heal'],
        'Operating Systems': ['Microsoft', 'Red Hat'],
        'Networking Devices': ['Cisco', 'Ubiquiti', 'TP-Link'],
        'Accessories': ['Targus', 'Belkin', 'SteelSeries', 'Anker', 'Sony']
    }

    images = {
        'Laptops': 'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=400&q=80',
        'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        'Tablets': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80',
        'Chargers': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
        'Earbuds': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
        'Smart Watches': 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80',
        'Hard Drives': 'https://images.unsplash.com/photo-1597872200919-0127a44611fe?auto=format&fit=crop&w=400&q=80',
        'SSD': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        'RAM': 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
        'Monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
        'Keyboards': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
        'Mouse': 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80',
        'Printers': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80',
        'Routers': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
        'Educational Software': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
        'Antivirus Software': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
        'Operating Systems': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
        'Networking Devices': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
        'Accessories': 'https://images.unsplash.com/photo-1619737307100-55b82776856a?auto=format&fit=crop&w=400&q=80'
    }

    product_id_counter = 1
    
    # Let's generate 100 items distributed across categories
    for i in range(100):
        category = categories[i % len(categories)]
        brand = random.choice(brands[category])
        img_url = images[category]
        
        # Prices in INR matching real catalog
        if category == 'Laptops':
            price = random.choice([55000, 79900, 99900, 129900, 145000, 185000, 210000])
        elif category in ['Smartphones', 'Tablets', 'Monitors']:
            price = random.choice([15999, 24999, 39999, 44999, 64999, 89900, 108999])
        elif category in ['Printers', 'Routers', 'Smart Watches']:
            price = random.choice([4999, 8999, 12999, 15999, 22999, 36999])
        elif category in ['SSD', 'RAM', 'Keyboards', 'Mouse']:
            price = random.choice([2499, 4299, 5499, 7499, 10995, 13499, 16999])
        elif category in ['Educational Software', 'Operating Systems']:
            price = random.choice([4499, 8999, 13999, 18999, 24500])
        elif category == 'Antivirus Software':
            price = random.choice([799, 1299, 1999, 2499])
        else: # Accessories/Chargers
            price = random.choice([499, 899, 1299, 1899, 2499, 4999])
            
        qty = random.choice([0, 2, 4, 12, 25, 45, 80, 120]) # Include some out-of-stock and low-stock
        status = 'Out Of Stock' if qty == 0 else 'Low Stock' if qty <= 5 else 'In Stock'
        
        # Discount rule
        rule_name = "None"
        rule_desc = "Standard consumer rules apply"
        if i % 7 == 0:
            rule_name = "Today Offer"
            rule_desc = "Immediate flash deal applied"
        elif i % 11 == 0:
            rule_name = "Featured Sale"
            rule_desc = "Extra 5% off at cart on selected dates"
            
        discount_rules = {
            'rule': rule_name,
            'description': rule_desc
        }
        
        p_id = f"prod_{product_id_counter:03d}"
        product_id_counter += 1
        
        product_name = f"Enterprise {brand} {category[:-1] if category.endswith('s') else category} Series {random.choice(['X', 'Pro', 'Ultra', 'S', 'Max', 'Plus'])}"
        
        p = Product(
            id=p_id,
            name=product_name,
            brand=brand,
            description=f"Premium high-quality enterprise-grade {product_name} manufactured by {brand}. Fully compliant with MBA college project standard warranties, offering top-tier operations, luxury design build, and excellent performance in the Indian market.",
            category=category,
            price=float(price),
            gst=18.0,
            available_quantity=qty,
            stock_status=status,
            discount_rules=json.dumps(discount_rules),
            image=img_url,
            rating=round(random.uniform(4.1, 5.0), 1),
            reviews_count=random.randint(10, 480),
            featured=(i % 15 == 0),
            today_offer=(i % 7 == 0),
            latest=(i % 9 == 0)
        )
        db.session.add(p)
        
    # Also seed 5 default customers
    default_customers = [
        Customer(id='cust_001', name='Aarav Sharma', email='aarav.sharma@gmail.com', phone='9876543210', address='B-402, Shanti Kunj, Sector 56, Gurgaon, Haryana', joined_date='2025-10-12', orders_count=15, total_spent=124500.0),
        Customer(id='cust_002', name='Priya Patel', email='priya.patel@yahoo.com', phone='9123456789', address='A-12, Green Glen Layout, Outer Ring Road, Bengaluru, Karnataka', joined_date='2025-11-05', orders_count=8, total_spent=87400.0),
        Customer(id='cust_003', name='Sneha Reddy', email='sneha.reddy@gmail.com', phone='8877665544', address='Plot 42, Jubilee Hills, Hyderabad, Telangana', joined_date='2026-01-15', orders_count=12, total_spent=195600.0)
    ]
    for c in default_customers:
        db.session.add(c)
        
    db.session.commit()
    print("Pre-seeding completed successfully!")

# ----------------------------------------------------
# REST API ENDPOINTS
# ----------------------------------------------------

# Home / Index Page Router
@app.route('/')
def index():
    return render_template('index.html')

# Get products
@app.route('/api/products', methods=['GET'])
def get_products():
    prods = Product.query.all()
    return jsonify([p.to_dict() for p in prods])

# Add Product (Admin)
@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.json
    p_id = data.get('id')
    if not p_id:
        count = Product.query.count()
        p_id = f"prod_{(count + 1):03d}"
        
    qty = int(data.get('availableQuantity', 10))
    status = 'Out Of Stock' if qty == 0 else 'Low Stock' if qty <= 5 else 'In Stock'
    
    p = Product(
        id=p_id,
        name=data.get('name'),
        brand=data.get('brand'),
        description=data.get('description'),
        category=data.get('category'),
        price=float(data.get('price')),
        gst=float(data.get('gst', 18.0)),
        available_quantity=qty,
        stock_status=status,
        discount_rules=json.dumps(data.get('discountRules', {'rule': 'None', 'description': 'Standard'})),
        image=data.get('image'),
        rating=float(data.get('rating', 4.5)),
        reviews_count=int(data.get('reviewsCount', 15)),
        featured=data.get('featured', False),
        today_offer=data.get('todayOffer', False),
        latest=data.get('latest', False)
    )
    db.session.add(p)
    db.session.commit()
    return jsonify(p.to_dict()), 201

# Edit Product (Admin)
@app.route('/api/products/<id>', methods=['PUT'])
def edit_product(id):
    p = Product.query.get_or_450(id)
    if not p:
        p = Product.query.filter_by(id=id).first()
    if not p:
        return jsonify({'error': 'Product not found'}), 404
        
    data = request.json
    p.name = data.get('name', p.name)
    p.brand = data.get('brand', p.brand)
    p.description = data.get('description', p.description)
    p.category = data.get('category', p.category)
    p.price = float(data.get('price', p.price))
    p.gst = float(data.get('gst', p.gst))
    p.available_quantity = int(data.get('availableQuantity', p.available_quantity))
    
    # Recalculate status
    p.stock_status = 'Out Of Stock' if p.available_quantity == 0 else 'Low Stock' if p.available_quantity <= 5 else 'In Stock'
    p.image = data.get('image', p.image)
    p.rating = float(data.get('rating', p.rating))
    p.reviews_count = int(data.get('reviewsCount', p.reviews_count))
    p.discount_rules = json.dumps(data.get('discountRules', json.loads(p.discount_rules)))
    
    db.session.commit()
    return jsonify(p.to_dict())

# Delete Product (Admin)
@app.route('/api/products/<id>', methods=['DELETE'])
def delete_product(id):
    p = Product.query.filter_by(id=id).first()
    if not p:
        return jsonify({'error': 'Product not found'}), 404
    db.session.delete(p)
    db.session.commit()
    return jsonify({'success': True})

# Create Order (Checkout)
@app.route('/api/orders', methods=['POST'])
def create_order():
    data = request.json
    items = data.get('items', [])
    
    # Deduct stock and double check availability
    for item in items:
        p = Product.query.filter_by(id=item.get('productId')).first()
        if not p:
            return jsonify({'error': f"Product {item.get('name')} not found."}), 400
        if p.available_quantity < item.get('quantity'):
            return jsonify({'error': f"Insufficient stock for {p.name}. Only {p.available_quantity} left."}), 400
            
        p.available_quantity -= item.get('quantity')
        p.stock_status = 'Out Of Stock' if p.available_quantity == 0 else 'Low Stock' if p.available_quantity <= 5 else 'In Stock'
        
    # Save order
    order_id = f"ord_{random.randint(100000, 999999)}"
    order_number = f"TE-{datetime.now().year}-{random.randint(1000, 9999)}"
    est_delivery = (datetime.now() + timedelta(days=random.randint(2, 4))).strftime('%Y-%m-%d')
    
    order = Order(
        id=order_id,
        order_number=order_number,
        customer_name=data.get('customerName', 'Walk-in Customer'),
        customer_email=data.get('customerEmail', 'walkin@techelectronics.com'),
        customer_phone=data.get('customerPhone', '9999999999'),
        items_json=json.dumps(items),
        subtotal=float(data.get('subtotal')),
        discount_amount=float(data.get('discountAmount', 0)),
        gst_total=float(data.get('gstTotal', 0)),
        final_amount=float(data.get('finalAmount')),
        timestamp=datetime.now().isoformat(),
        status='Completed',
        estimated_delivery=est_delivery
    )
    db.session.add(order)
    
    # Update customer record
    c_email = order.customer_email.lower().strip()
    cust = Customer.query.filter_by(email=c_email).first()
    if cust:
        cust.orders_count += 1
        cust.total_spent += order.final_amount
    else:
        cust_id = f"cust_{(Customer.query.count() + 1):03d}"
        new_cust = Customer(
            id=cust_id,
            name=order.customer_name,
            email=order.customer_email,
            phone=order.customer_phone,
            address="Online Billing Address, India",
            joined_date=datetime.now().strftime('%Y-%m-%d'),
            orders_count=1,
            total_spent=order.final_amount
        )
        db.session.add(new_cust)
        
    db.session.commit()
    return jsonify(order.to_dict()), 201

# Get orders
@app.route('/api/orders', methods=['GET'])
def get_orders():
    orders = Order.query.order_by(Order.timestamp.desc()).all()
    return jsonify([o.to_dict() for o in orders])

# Get customers
@app.route('/api/customers', methods=['GET'])
def get_customers():
    custs = Customer.query.all()
    return jsonify([c.to_dict() for c in custs])

# Admin login
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if username == ADMIN_CREDENTIALS['username'] and password == ADMIN_CREDENTIALS['password']:
        return jsonify({'token': 'flask_session_token_xyz789', 'name': 'Director (MBA-PM)'})
    return jsonify({'error': 'Invalid Username or Password. Try admin / admin123'}), 401

# Analytics aggregates
@app.route('/api/analytics', methods=['GET'])
def get_analytics():
    all_orders = Order.query.all()
    total_rev = sum([o.final_amount for o in all_orders])
    
    # Mock some data if first launch is empty to make charts populated
    if not all_orders:
        total_rev = 3450000.0
        
    low_stock = Product.query.filter(Product.available_quantity > 0, Product.available_quantity <= 5).count()
    out_stock = Product.query.filter_by(available_quantity=0).count()
    total_prods = Product.query.count()
    
    analytics = {
        'totalRevenue': total_rev,
        'ordersToday': len(all_orders),
        'revenueToday': sum([o.final_amount for o in all_orders]),
        'lowStockCount': low_stock,
        'outOfStockCount': out_stock,
        'totalProductsCount': total_prods,
        'bestSellingProduct': {
            'name': 'MacBook Pro 16 M3 Max',
            'quantity': 8,
            'revenue': 2799200
        },
        'categorySales': [
            {'category': 'Laptops', 'value': 2450000},
            {'category': 'Smartphones', 'value': 750000},
            {'category': 'SSD', 'value': 120000}
        ],
        'dailyRevenue': [
            {'date': 'Mon', 'revenue': 112000},
            {'date': 'Tue', 'revenue': 145000},
            {'date': 'Wed', 'revenue': 98000},
            {'date': 'Thu', 'revenue': 134000},
            {'date': 'Fri', 'revenue': 156000},
            {'date': 'Sat', 'revenue': 180000},
            {'date': 'Sun', 'revenue': 110000}
        ]
    }
    return jsonify(analytics)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        seed_database()
    app.run(host='0.0.0.0', port=5000, debug=True)
