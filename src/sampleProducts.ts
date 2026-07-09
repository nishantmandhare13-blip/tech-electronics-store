import { Product } from './types';

// Unsplash high quality product images for electronics
const IMAGES = {
  Laptops: 'https://images.unsplash.com/photo-1496181130204-755241524eab?auto=format&fit=crop&w=400&q=80',
  Smartphones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
  Tablets: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80',
  Chargers: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
  Earbuds: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80',
  SmartWatches: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80',
  HardDrives: 'https://images.unsplash.com/photo-1597872200919-0127a44611fe?auto=format&fit=crop&w=400&q=80',
  SSD: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
  RAM: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
  Monitors: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
  Keyboards: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400&q=80',
  Mouse: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=400&q=80',
  Printers: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=400&q=80',
  Routers: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80',
  Software: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80',
  Accessories: 'https://images.unsplash.com/photo-1619737307100-55b82776856a?auto=format&fit=crop&w=400&q=80'
};

const rawProductsList = [
  // Laptops (10 items)
  { name: 'MacBook Pro 16 M3 Max', brand: 'Apple', category: 'Laptops', price: 349900, qty: 15, rating: 4.9, img: IMAGES.Laptops, featured: true },
  { name: 'Dell XPS 15 9530', brand: 'Dell', category: 'Laptops', price: 210000, qty: 8, rating: 4.7, img: IMAGES.Laptops, latest: true },
  { name: 'HP Spectre x360', brand: 'HP', category: 'Laptops', price: 155000, qty: 12, rating: 4.6, img: IMAGES.Laptops, todayOffer: true },
  { name: 'Lenovo ThinkPad X1 Carbon Gen 11', brand: 'Lenovo', category: 'Laptops', price: 185000, qty: 5, rating: 4.8, img: IMAGES.Laptops },
  { name: 'ASUS ROG Zephyrus G14', brand: 'ASUS', category: 'Laptops', price: 145000, qty: 3, rating: 4.7, img: IMAGES.Laptops, lowStock: true },
  { name: 'Acer Swift Go 14 OLED', brand: 'Acer', category: 'Laptops', price: 79900, qty: 25, rating: 4.4, img: IMAGES.Laptops },
  { name: 'Samsung Galaxy Book3 Pro', brand: 'Samsung', category: 'Laptops', price: 129900, qty: 10, rating: 4.5, img: IMAGES.Laptops },
  { name: 'Microsoft Surface Laptop 5', brand: 'Microsoft', category: 'Laptops', price: 105000, qty: 0, rating: 4.3, img: IMAGES.Laptops }, // Out of stock
  { name: 'Lenovo Legion 5 Pro', brand: 'Lenovo', category: 'Laptops', price: 115000, qty: 14, rating: 4.6, img: IMAGES.Laptops },
  { name: 'Apple MacBook Air 13 M2', brand: 'Apple', category: 'Laptops', price: 99900, qty: 35, rating: 4.8, img: IMAGES.Laptops, featured: true },

  // Smartphones (10 items)
  { name: 'iPhone 15 Pro Max 256GB', brand: 'Apple', category: 'Smartphones', price: 159900, qty: 18, rating: 4.9, img: IMAGES.Smartphones, featured: true },
  { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Smartphones', price: 129999, qty: 22, rating: 4.8, img: IMAGES.Smartphones, latest: true },
  { name: 'OnePlus 12 5G', brand: 'OnePlus', category: 'Smartphones', price: 64999, qty: 30, rating: 4.7, img: IMAGES.Smartphones, todayOffer: true },
  { name: 'Google Pixel 8 Pro', brand: 'Google', category: 'Smartphones', price: 106999, qty: 12, rating: 4.6, img: IMAGES.Smartphones },
  { name: 'Xiaomi 14 Ultra', brand: 'Xiaomi', category: 'Smartphones', price: 99999, qty: 6, rating: 4.5, img: IMAGES.Smartphones },
  { name: 'iPhone 15 128GB', brand: 'Apple', category: 'Smartphones', price: 79900, qty: 40, rating: 4.7, img: IMAGES.Smartphones },
  { name: 'Samsung Galaxy A55 5G', brand: 'Samsung', category: 'Smartphones', price: 39999, qty: 25, rating: 4.3, img: IMAGES.Smartphones },
  { name: 'Motorola Edge 50 Pro', brand: 'Motorola', category: 'Smartphones', price: 31999, qty: 15, rating: 4.4, img: IMAGES.Smartphones },
  { name: 'Nothing Phone (2)', brand: 'Nothing', category: 'Smartphones', price: 44999, qty: 4, rating: 4.5, img: IMAGES.Smartphones },
  { name: 'Realme GT 6', brand: 'Realme', category: 'Smartphones', price: 40999, qty: 18, rating: 4.3, img: IMAGES.Smartphones },

  // Tablets (7 items)
  { name: 'iPad Pro 11 M4 OLED', brand: 'Apple', category: 'Tablets', price: 99900, qty: 14, rating: 4.9, img: IMAGES.Tablets, featured: true },
  { name: 'Samsung Galaxy Tab S9 Ultra', brand: 'Samsung', category: 'Tablets', price: 108999, qty: 8, rating: 4.8, img: IMAGES.Tablets },
  { name: 'iPad Air 11 M2', brand: 'Apple', category: 'Tablets', price: 59900, qty: 20, rating: 4.7, img: IMAGES.Tablets, todayOffer: true },
  { name: 'Xiaomi Pad 6', brand: 'Xiaomi', category: 'Tablets', price: 26999, qty: 45, rating: 4.5, img: IMAGES.Tablets },
  { name: 'OnePlus Pad', brand: 'OnePlus', category: 'Tablets', price: 37999, qty: 12, rating: 4.6, img: IMAGES.Tablets, latest: true },
  { name: 'Lenovo Tab P12', brand: 'Lenovo', category: 'Tablets', price: 25999, qty: 0, rating: 4.2, img: IMAGES.Tablets },
  { name: 'iPad 10th Gen 64GB', brand: 'Apple', category: 'Tablets', price: 39900, qty: 30, rating: 4.6, img: IMAGES.Tablets },

  // Chargers (5 items)
  { name: 'Anker 737 GaNPrime 120W', brand: 'Anker', category: 'Chargers', price: 8999, qty: 50, rating: 4.8, img: IMAGES.Chargers, todayOffer: true },
  { name: 'Apple 20W USB-C Power Adapter', brand: 'Apple', category: 'Chargers', price: 1900, qty: 120, rating: 4.7, img: IMAGES.Chargers },
  { name: 'Samsung 45W Travel Adapter', brand: 'Samsung', category: 'Chargers', price: 2999, qty: 75, rating: 4.6, img: IMAGES.Chargers },
  { name: 'Spigen ArcStation Pro 40W', brand: 'Spigen', category: 'Chargers', price: 1899, qty: 40, rating: 4.5, img: IMAGES.Chargers },
  { name: 'Belkin BoostCharge Pro 3-in-1', brand: 'Belkin', category: 'Chargers', price: 13999, qty: 15, rating: 4.8, img: IMAGES.Chargers, featured: true },

  // Earbuds (7 items)
  { name: 'Sony WF-1000XM5 ANC Earbuds', brand: 'Sony', category: 'Earbuds', price: 24990, qty: 25, rating: 4.8, img: IMAGES.Earbuds, featured: true },
  { name: 'Apple AirPods Pro 2nd Gen', brand: 'Apple', category: 'Earbuds', price: 24900, qty: 60, rating: 4.9, img: IMAGES.Earbuds, todayOffer: true },
  { name: 'Bose QuietComfort Ultra Buds', brand: 'Bose', category: 'Earbuds', price: 25900, qty: 15, rating: 4.7, img: IMAGES.Earbuds },
  { name: 'OnePlus Buds 3', brand: 'OnePlus', category: 'Earbuds', price: 5499, qty: 80, rating: 4.5, img: IMAGES.Earbuds, latest: true },
  { name: 'Realme Buds Air 5 Pro', brand: 'Realme', category: 'Earbuds', price: 4999, qty: 95, rating: 4.4, img: IMAGES.Earbuds },
  { name: 'JBL Tune 235TWS', brand: 'JBL', category: 'Earbuds', price: 3999, qty: 110, rating: 4.2, img: IMAGES.Earbuds },
  { name: 'Sennheiser Momentum True Wireless 4', brand: 'Sennheiser', category: 'Earbuds', price: 29990, qty: 8, rating: 4.7, img: IMAGES.Earbuds },

  // Smart Watches (7 items)
  { name: 'Apple Watch Ultra 2 GPS+Cellular', brand: 'Apple', category: 'Smart Watches', price: 89900, qty: 10, rating: 4.9, img: IMAGES.SmartWatches, featured: true },
  { name: 'Samsung Galaxy Watch6 Classic', brand: 'Samsung', category: 'Smart Watches', price: 36999, qty: 18, rating: 4.7, img: IMAGES.SmartWatches },
  { name: 'Apple Watch Series 9 GPS 45mm', brand: 'Apple', category: 'Smart Watches', price: 44900, qty: 25, rating: 4.8, img: IMAGES.SmartWatches, latest: true },
  { name: 'Fitbit Sense 2 Health Tracker', brand: 'Fitbit', category: 'Smart Watches', price: 22999, qty: 14, rating: 4.4, img: IMAGES.SmartWatches },
  { name: 'Garmin Venu 3 GPS Smartwatch', brand: 'Garmin', category: 'Smart Watches', price: 44990, qty: 8, rating: 4.8, img: IMAGES.SmartWatches },
  { name: 'OnePlus Watch 2 Dual-Engine', brand: 'OnePlus', category: 'Smart Watches', price: 24999, qty: 20, rating: 4.6, img: IMAGES.SmartWatches, todayOffer: true },
  { name: 'Amazfit GTR 4 Smart Watch', brand: 'Amazfit', category: 'Smart Watches', price: 16999, qty: 0, rating: 4.3, img: IMAGES.SmartWatches },

  // Hard Drives (5 items)
  { name: 'Seagate Expansion 2TB External', brand: 'Seagate', category: 'Hard Drives', price: 6299, qty: 45, rating: 4.4, img: IMAGES.HardDrives },
  { name: 'WD My Passport 4TB External HDD', brand: 'WD', category: 'Hard Drives', price: 9899, qty: 30, rating: 4.5, img: IMAGES.HardDrives },
  { name: 'Seagate One Touch 5TB HDD', brand: 'Seagate', category: 'Hard Drives', price: 11999, qty: 15, rating: 4.5, img: IMAGES.HardDrives },
  { name: 'WD Elements 1.5TB Portable Drive', brand: 'WD', category: 'Hard Drives', price: 5199, qty: 40, rating: 4.3, img: IMAGES.HardDrives },
  { name: 'Toshiba Canvio Basics 2TB HDD', brand: 'Toshiba', category: 'Hard Drives', price: 5899, qty: 55, rating: 4.2, img: IMAGES.HardDrives },

  // SSD (7 items)
  { name: 'Samsung 990 Pro 2TB PCIe 4.0 NVMe', brand: 'Samsung', category: 'SSD', price: 16499, qty: 35, rating: 4.9, img: IMAGES.SSD, featured: true },
  { name: 'Crucial T700 2TB PCIe 5.0 NVMe', brand: 'Crucial', category: 'SSD', price: 28999, qty: 12, rating: 4.8, img: IMAGES.SSD, latest: true },
  { name: 'SanDisk Extreme Portable SSD 1TB', brand: 'SanDisk', category: 'SSD', price: 9499, qty: 50, rating: 4.6, img: IMAGES.SSD, todayOffer: true },
  { name: 'WD Black SN850X 1TB NVMe Gen4', brand: 'WD', category: 'SSD', price: 9299, qty: 42, rating: 4.8, img: IMAGES.SSD },
  { name: 'Samsung T7 Shield 2TB Portable', brand: 'Samsung', category: 'SSD', price: 14999, qty: 28, rating: 4.7, img: IMAGES.SSD },
  { name: 'Kingston NV2 1TB PCIe 4.0 NVMe', brand: 'Kingston', category: 'SSD', price: 5499, qty: 85, rating: 4.3, img: IMAGES.SSD },
  { name: 'Silicon Power 1TB SATA III SSD', brand: 'Silicon Power', category: 'SSD', price: 4599, qty: 60, rating: 4.2, img: IMAGES.SSD },

  // RAM (6 items)
  { name: 'Corsair Vengeance DDR5 32GB 6000MHz', brand: 'Corsair', category: 'RAM', price: 11299, qty: 30, rating: 4.8, img: IMAGES.RAM, featured: true },
  { name: 'G.Skill Trident Z5 RGB 32GB DDR5', brand: 'G.Skill', category: 'RAM', price: 13499, qty: 18, rating: 4.9, img: IMAGES.RAM, latest: true },
  { name: 'Kingston Fury Beast 16GB DDR5 5200', brand: 'Kingston', category: 'RAM', price: 5499, qty: 45, rating: 4.6, img: IMAGES.RAM },
  { name: 'Crucial RAM 8GB DDR4 3200MHz Laptop', brand: 'Crucial', category: 'RAM', price: 1899, qty: 100, rating: 4.5, img: IMAGES.RAM },
  { name: 'Corsair Vengeance LPX 16GB DDR4 Kit', brand: 'Corsair', category: 'RAM', price: 3899, qty: 75, rating: 4.7, img: IMAGES.RAM, todayOffer: true },
  { name: 'G.Skill Ripjaws V 16GB DDR4 3600', brand: 'G.Skill', category: 'RAM', price: 4299, qty: 0, rating: 4.6, img: IMAGES.RAM },

  // Monitors (7 items)
  { name: 'LG Ultragear 27-inch QHD IPS 144Hz', brand: 'LG', category: 'Monitors', price: 22499, qty: 20, rating: 4.7, img: IMAGES.Monitors, todayOffer: true },
  { name: 'Samsung Odyssey G9 49" Curved Dual QHD', brand: 'Samsung', category: 'Monitors', price: 134900, qty: 4, rating: 4.8, img: IMAGES.Monitors, featured: true },
  { name: 'Dell UltraSharp 27 4K USB-C Hub Monitor', brand: 'Dell', category: 'Monitors', price: 48999, qty: 10, rating: 4.8, img: IMAGES.Monitors, latest: true },
  { name: 'ASUS TUF Gaming 24" FHD 165Hz Monitor', brand: 'ASUS', category: 'Monitors', price: 12999, qty: 25, rating: 4.5, img: IMAGES.Monitors },
  { name: 'BenQ Mobiuz EX2510S 165Hz IPS', brand: 'BenQ', category: 'Monitors', price: 15499, qty: 18, rating: 4.4, img: IMAGES.Monitors },
  { name: 'Acer Nitro 27" WQHD Curved Monitor', brand: 'Acer', category: 'Monitors', price: 18999, qty: 0, rating: 4.3, img: IMAGES.Monitors },
  { name: 'LG 32-inch 4K UHD Smart Monitor', brand: 'LG', category: 'Monitors', price: 31999, qty: 12, rating: 4.5, img: IMAGES.Monitors },

  // Keyboards (6 items)
  { name: 'Keychron K2 V2 Wireless Mechanical', brand: 'Keychron', category: 'Keyboards', price: 7499, qty: 25, rating: 4.8, img: IMAGES.Keyboards, featured: true },
  { name: 'Logitech MX Keys S Premium Wireless', brand: 'Logitech', category: 'Keyboards', price: 12995, qty: 30, rating: 4.7, img: IMAGES.Keyboards, latest: true },
  { name: 'Razer BlackWidow V4 Mechanical Keyboard', brand: 'Razer', category: 'Keyboards', price: 16999, qty: 15, rating: 4.6, img: IMAGES.Keyboards },
  { name: 'Logitech K380 Multi-Device Bluetooth', brand: 'Logitech', category: 'Keyboards', price: 2799, qty: 85, rating: 4.5, img: IMAGES.Keyboards, todayOffer: true },
  { name: 'Redragon K552 RGB Mechanical Keyboard', brand: 'Redragon', category: 'Keyboards', price: 2999, qty: 50, rating: 4.4, img: IMAGES.Keyboards },
  { name: 'SteelSeries Apex Pro TFX Mechanical', brand: 'SteelSeries', category: 'Keyboards', price: 22999, qty: 5, rating: 4.8, img: IMAGES.Keyboards },

  // Mouse (6 items)
  { name: 'Logitech MX Master 3S Wireless Mouse', brand: 'Logitech', category: 'Mouse', price: 10995, qty: 45, rating: 4.9, img: IMAGES.Mouse, featured: true },
  { name: 'Razer DeathAdder V3 Pro Wireless', brand: 'Razer', category: 'Mouse', price: 13999, qty: 20, rating: 4.7, img: IMAGES.Mouse, latest: true },
  { name: 'Logitech G502 Hero High Performance', brand: 'Logitech', category: 'Mouse', price: 4499, qty: 65, rating: 4.6, img: IMAGES.Mouse, todayOffer: true },
  { name: 'SteelSeries Rival 3 Wireless Gaming Mouse', brand: 'SteelSeries', category: 'Mouse', price: 3499, qty: 35, rating: 4.3, img: IMAGES.Mouse },
  { name: 'Apple Magic Mouse Multi-Touch Black', brand: 'Apple', category: 'Mouse', price: 9500, qty: 15, rating: 4.1, img: IMAGES.Mouse },
  { name: 'Corsair Harpoon RGB Wireless Mouse', brand: 'Corsair', category: 'Mouse', price: 3999, qty: 0, rating: 4.4, img: IMAGES.Mouse },

  // Printers (5 items)
  { name: 'HP Smart Tank 580 All-in-One Ink Wi-Fi', brand: 'HP', category: 'Printers', price: 13499, qty: 16, rating: 4.5, img: IMAGES.Printers, todayOffer: true },
  { name: 'Canon PIXMA G3012 Wireless Ink Tank', brand: 'Canon', category: 'Printers', price: 14299, qty: 22, rating: 4.4, img: IMAGES.Printers },
  { name: 'Epson EcoTank L3250 Multi-Function Wi-Fi', brand: 'Epson', category: 'Printers', price: 15999, qty: 18, rating: 4.6, img: IMAGES.Printers, featured: true },
  { name: 'HP LaserJet Pro M126nw Monochrome Printer', brand: 'HP', category: 'Printers', price: 20499, qty: 8, rating: 4.5, img: IMAGES.Printers },
  { name: 'Brother HL-L2321D Single Function Laser', brand: 'Brother', category: 'Printers', price: 10999, qty: 25, rating: 4.6, img: IMAGES.Printers, latest: true },

  // Routers (5 items)
  { name: 'TP-Link Archer AX73 AX5400 Wi-Fi 6', brand: 'TP-Link', category: 'Routers', price: 8999, qty: 30, rating: 4.7, img: IMAGES.Routers, todayOffer: true },
  { name: 'Netgear Nighthawk RAX50 AX5400 Wi-Fi 6', brand: 'Netgear', category: 'Routers', price: 18999, qty: 12, rating: 4.6, img: IMAGES.Routers, featured: true },
  { name: 'ASUS RT-AX82U Dual-Band AX5400 RGB', brand: 'ASUS', category: 'Routers', price: 14499, qty: 15, rating: 4.7, img: IMAGES.Routers, latest: true },
  { name: 'TP-Link Deco X20 Whole Home Mesh System', brand: 'TP-Link', category: 'Routers', price: 13999, qty: 20, rating: 4.8, img: IMAGES.Routers },
  { name: 'D-Link DIR-825 AC1200 Dual Band Router', brand: 'D-Link', category: 'Routers', price: 2199, qty: 85, rating: 4.1, img: IMAGES.Routers },

  // Educational Software (4 items)
  { name: 'MATLAB Student Suite Desktop Licence', brand: 'MathWorks', category: 'Educational Software', price: 8999, qty: 100, rating: 4.7, img: IMAGES.Software },
  { name: 'AutoCAD LT 1-Year Commercial Licence', brand: 'Autodesk', category: 'Educational Software', price: 24500, qty: 100, rating: 4.6, img: IMAGES.Software, featured: true },
  { name: 'Duolingo Super Annual Subscription Code', brand: 'Duolingo', category: 'Educational Software', price: 4499, qty: 100, rating: 4.8, img: IMAGES.Software, todayOffer: true },
  { name: 'Rosetta Stone lifetime All Languages Code', brand: 'Rosetta Stone', category: 'Educational Software', price: 14999, qty: 100, rating: 4.5, img: IMAGES.Software },

  // Antivirus Software (4 items)
  { name: 'McAfee Total Protection 3-Devices 1-Year', brand: 'McAfee', category: 'Antivirus Software', price: 1299, qty: 250, rating: 4.3, img: IMAGES.Software },
  { name: 'Norton 360 Deluxe 5-Devices 1-Year Code', brand: 'Norton', category: 'Antivirus Software', price: 1999, qty: 200, rating: 4.5, img: IMAGES.Software, todayOffer: true },
  { name: 'Kaspersky Total Security 1-Device 1-Year', brand: 'Kaspersky', category: 'Antivirus Software', price: 799, qty: 300, rating: 4.4, img: IMAGES.Software, latest: true },
  { name: 'Quick Heal Total Security 1-Device 3-Year', brand: 'Quick Heal', category: 'Antivirus Software', price: 2499, qty: 180, rating: 4.6, img: IMAGES.Software },

  // Operating Systems (3 items)
  { name: 'Windows 11 Professional Retail Box', brand: 'Microsoft', category: 'Operating Systems', price: 13999, qty: 45, rating: 4.6, img: IMAGES.Software, featured: true },
  { name: 'Windows 11 Home OEM Digital Key', brand: 'Microsoft', category: 'Operating Systems', price: 9299, qty: 120, rating: 4.5, img: IMAGES.Software },
  { name: 'Red Hat Enterprise Linux Desktop 1-Year', brand: 'Red Hat', category: 'Operating Systems', price: 18999, qty: 15, rating: 4.4, img: IMAGES.Software },

  // Networking Devices (4 items)
  { name: 'Cisco CBS250-24T-4G 24-Port Smart Switch', brand: 'Cisco', category: 'Networking Devices', price: 28500, qty: 8, rating: 4.7, img: IMAGES.Routers, featured: true },
  { name: 'Ubiquiti UniFi U6-Pro Wi-Fi 6 AP', brand: 'Ubiquiti', category: 'Networking Devices', price: 16999, qty: 14, rating: 4.8, img: IMAGES.Routers, latest: true },
  { name: 'TP-Link 8-Port Gigabit PoE+ Desktop Switch', brand: 'TP-Link', category: 'Networking Devices', price: 4899, qty: 35, rating: 4.5, img: IMAGES.Routers },
  { name: 'D-Link 16-Port Gigabit Unmanaged Switch', brand: 'D-Link', category: 'Networking Devices', price: 3499, qty: 22, rating: 4.3, img: IMAGES.Routers },

  // Accessories (8 items)
  { name: 'Targus Premium Ergonomic Laptop Stand', brand: 'Targus', category: 'Accessories', price: 2499, qty: 65, rating: 4.6, img: IMAGES.Accessories, todayOffer: true },
  { name: 'Belkin Premium Braided HDMI 2.1 Cable 2m', brand: 'Belkin', category: 'Accessories', price: 1299, qty: 150, rating: 4.7, img: IMAGES.Accessories },
  { name: 'SteelSeries QcK Heavy Large Gaming Mouse Pad', brand: 'SteelSeries', category: 'Accessories', price: 1899, qty: 80, rating: 4.8, img: IMAGES.Accessories },
  { name: 'Anker PowerExpand 8-in-1 USB-C Hub', brand: 'Anker', category: 'Accessories', price: 4999, qty: 45, rating: 4.6, img: IMAGES.Accessories, latest: true },
  { name: 'Sony MDR-ZX110A Wired Headphone No Mic', brand: 'Sony', category: 'Accessories', price: 999, qty: 120, rating: 4.2, img: IMAGES.Accessories },
  { name: 'Logitech C922 Pro Stream FHD Webcam', brand: 'Logitech', category: 'Accessories', price: 9495, qty: 25, rating: 4.6, img: IMAGES.Accessories, featured: true },
  { name: 'SanDisk Ultra Dual 64GB USB OTG Drive', brand: 'SanDisk', category: 'Accessories', price: 699, qty: 200, rating: 4.4, img: IMAGES.Accessories },
  { name: 'AmazonBasics Universal Travel Adapter', brand: 'AmazonBasics', category: 'Accessories', price: 899, qty: 110, rating: 4.3, img: IMAGES.Accessories }
];

export const sampleProducts: Product[] = rawProductsList.map((p, idx) => {
  const stockStatus = p.qty === 0 ? 'Out Of Stock' : p.qty <= 5 ? 'Low Stock' : 'In Stock';
  
  // Custom discount description based on category
  let discountRules = { rule: 'None', description: 'Standard consumer rules apply' };
  if (p.featured) {
    discountRules = { rule: 'Featured Spark', description: 'Extra 5% off at cart on selected dates' };
  } else if (p.todayOffer) {
    discountRules = { rule: 'Today Super Saver', description: 'Immediate flash deal applied' };
  } else if (p.category === 'Accessories') {
    discountRules = { rule: 'Bulk Accs', description: 'Get 5% off when buying 3+ Accessories' };
  }

  return {
    id: `prod_${(idx + 1).toString().padStart(3, '0')}`,
    name: p.name,
    brand: p.brand,
    description: `High-quality enterprise-grade ${p.name} from ${p.brand}. Built for reliability, ultimate speed, and durable performance. Full official manufacturer warranty included with lifetime support for businesses and students alike. Includes original packaging, license keys if applicable, manual, and priority support in India. GST registered invoice provided.`,
    category: p.category,
    price: p.price,
    gst: p.category.toLowerCase().includes('software') || p.category.toLowerCase().includes('operating') ? 18 : 18, // Standard 18% electronics GST in India
    availableQuantity: p.qty,
    stockStatus,
    discountRules,
    image: p.img,
    rating: p.rating,
    reviewsCount: Math.floor(Math.random() * 450) + 12,
    featured: p.featured || false,
    todayOffer: p.todayOffer || false,
    latest: p.latest || false
  };
});
