# TradeHub — Unified B2B, B2C & C2C Marketplace Platform

TradeHub is a modern multi-commerce marketplace platform designed to bring **businesses, customers, individual sellers, and logistics providers** together in one unified ecosystem.

Unlike a traditional e-commerce website, TradeHub supports three major commerce models:

* **B2B — Business to Business**
* **B2C — Business to Customer**
* **C2C — Customer to Customer**

The platform enables users to buy and sell products, manage business inventories, list used products, communicate with sellers, manage orders, apply coupons, save products to wishlists, and access logistics services.

---

## 📑 Table of Contents

1. [Overview](#-overview)
2. [Platform Architecture](#-platform-architecture)
3. [Key Features](#-key-features)

   * [B2C Marketplace](#b2c-marketplace)
   * [B2B Marketplace](#b2b-marketplace)
   * [C2C Marketplace](#c2c-marketplace)
4. [User Roles](#-user-roles)
5. [Commerce Model Matrix](#-commerce-model-matrix)
6. [Tech Stack](#-tech-stack)
7. [Core Modules](#-core-modules)
8. [Project Structure](#-project-structure)
9. [Installation & Setup](#-installation--setup)
10. [Data Management & Privacy](#-data-management--privacy)
11. [Future Enhancements](#-future-enhancements)
12. [Team & Contributors](#-team--contributors)
13. [License](#-license)

---

## 📌 Overview

**TradeHub** is a unified marketplace platform built to support multiple types of online commerce within a single web application.

The platform combines traditional product shopping with business management, customer-to-customer selling, inventory tracking, order management, messaging, coupons, reviews, wishlists, and logistics services.

### Core Marketplace Ecosystem

```text
                    ┌─────────────────┐
                    │    TradeHub     │
                    │ Unified Platform│
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
         B2B                B2C                C2C
          │                  │                  │
     Businesses         Businesses         Individual
          ↕                  ↕               Sellers
     Businesses         Customers             ↕
                                           Customers
```

TradeHub aims to reduce the need for separate platforms by integrating:

> **B2B + B2C + C2C + Logistics + Communication**

---

## 🏗️ Platform Architecture

TradeHub follows a client-side web application architecture built using HTML, CSS, and JavaScript.

```text
                    ┌──────────────────┐
                    │   User Interface │
                    │ HTML / CSS / JS  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
         Authentication    Commerce       Services
              │              │              │
              │         ┌────┴────┐    ┌────┴─────┐
              │         │         │    │          │
            Users       B2B      B2C  Logistics Messages
                        │
                       C2C
              │
        Local Storage
```

The application consists of multiple independent modules responsible for authentication, products, carts, orders, coupons, reviews, messaging, logistics, inventory, and wishlists.

---

# ✨ Key Features

## B2C Marketplace

The B2C marketplace allows businesses to sell products directly to customers.

### Features

* Browse products
* Search and filter products
* View detailed product information
* Add products to cart
* Manage shopping cart
* Apply available coupons
* Checkout system
* Place orders
* View order history
* Track order status
* View detailed order information
* Add products to wishlist
* Submit and view product reviews

---

## B2B Marketplace

TradeHub also provides features designed for business users and wholesale operations.

### Business Features

* Business dashboard
* Add new products
* Edit existing products
* Delete and manage products
* Inventory management
* Stock monitoring
* Business order management
* Business coupons
* Business verification
* Customer and business communication
* Logistics management

This allows businesses to efficiently manage their products and marketplace activities.

---

## C2C Marketplace

The C2C module enables individual users to sell products directly to other customers.

### Features

* List used products for sale
* Create product listings
* Edit used product listings
* View sale details
* Manage personal listings
* Communicate with potential buyers

This feature expands TradeHub beyond traditional e-commerce and creates a marketplace for individual sellers.

---

## 🔐 Authentication System

TradeHub provides a complete user authentication flow.

### Features

* User registration
* User login
* Logout functionality
* Session management
* Customer accounts
* Business accounts
* Role-based user access
* Protected user functionality

---

## 📦 Product Management

Businesses can manage their product catalog directly through the platform.

### Features

* Add products
* Edit products
* Delete products
* View product details
* Browse product catalog
* Product categorization
* Product search
* Product availability management

---

## 🛒 Smart Shopping Cart

The cart module provides customers with a complete shopping experience.

### Features

* Add products to cart
* Remove products
* Update quantities
* Calculate totals
* Manage cart items
* Proceed to checkout

---

## 📋 Order Management

TradeHub includes a dedicated order management system.

### Features

* Create orders
* View order history
* View order details
* Manage business orders
* Track order status
* Order progress monitoring

---

## 🚚 Logistics Marketplace

One of the major features of TradeHub is its integrated logistics system.

### Features

* Browse logistics services
* List logistics services
* View logistics details
* Book logistics services
* Manage logistics bookings
* View booking details

This allows logistics providers and users to interact directly through the platform.

---

## 💬 Messaging System

TradeHub includes a communication system that allows users to interact within the marketplace.

### Features

* Customer-to-seller communication
* Business communication
* Product-related conversations
* Marketplace messaging interface

---

## 📊 Inventory Management

Business users can manage their available stock through the inventory module.

### Features

* Track product inventory
* Monitor stock levels
* Update inventory
* Manage product availability
* Low-stock awareness

---

## 🎟️ Coupons & Offers

Businesses can create and manage promotional offers.

### Features

* Business coupons
* Discount codes
* Promotional offers
* Coupon application during checkout

---

## ❤️ Wishlist System

Customers can save products for future purchases.

### Features

* Add products to wishlist
* Remove products from wishlist
* View saved products
* Quick access to favorite items

---

## ⭐ Product Reviews

Users can share their experience with products.

### Features

* Add reviews
* View reviews
* Product feedback
* Customer experience sharing

---

# 👥 User Roles

## Customer

A customer can:

* Browse products
* Search products
* Add products to cart
* Manage wishlist
* Apply coupons
* Place orders
* Track orders
* Review products
* Communicate with sellers
* Sell used products through the C2C marketplace
* Book logistics services

---

## Business User

A business user can:

* Access the business dashboard
* Add and manage products
* Edit products
* Manage inventory
* View business orders
* Create coupons
* Apply for business verification
* Communicate with customers
* Access logistics features
* Participate in B2B and B2C commerce

---

## Individual Seller

An individual seller can:

* List used products
* Edit product listings
* Manage sales
* View sale details
* Communicate with interested buyers

---

# 🔄 Commerce Model Matrix

| Feature               |    B2C   |    B2B   |     C2C    |
| --------------------- | :------: | :------: | :--------: |
| Product Browsing      |     ✅    |     ✅    |      ✅     |
| Product Selling       | Business | Business | Individual |
| Shopping Cart         |     ✅    |     ✅    |      —     |
| Checkout              |     ✅    |     ✅    |      —     |
| Order Management      |     ✅    |     ✅    |      —     |
| Used Product Sales    |     —    |     —    |      ✅     |
| Inventory Management  |     —    |     ✅    |      —     |
| Business Coupons      |     —    |     ✅    |      —     |
| Business Verification |     —    |     ✅    |      —     |
| Messaging             |     ✅    |     ✅    |      ✅     |
| Logistics Support     |     ✅    |     ✅    |      ✅     |

---

# 🧩 Core Modules

TradeHub is divided into several JavaScript modules.

### `auth.js`

Handles:

* Registration
* Login
* User authentication
* Session management

### `products.js`

Handles:

* Product listing
* Product details
* Product management
* Product search and filtering

### `cart.js`

Handles:

* Shopping cart
* Quantity updates
* Cart calculations
* Checkout preparation

### `orders.js`

Handles:

* Order creation
* Order history
* Order details
* Order tracking

### `wishlist.js`

Handles:

* Saving products
* Removing wishlist items
* Wishlist management

### `reviews.js`

Handles:

* Product reviews
* Customer feedback
* Review display

### `coupons.js`

Handles:

* Coupon creation
* Coupon management
* Discount application

### `messages.js`

Handles:

* User communication
* Customer-to-seller messaging
* Marketplace conversations

### `logistics.js`

Handles:

* Logistics services
* Logistics listings
* Service bookings
* Booking details

### `app.js`

Handles:

* Global application functionality
* Shared utilities
* Navigation and common behavior

---

# 🛠️ Tech Stack

### Frontend

* **HTML5** — Application structure
* **CSS3** — Styling and responsive design
* **JavaScript (ES6+)** — Application logic and interactivity

### Browser Storage

* **Local Storage** — Client-side data persistence and session-related data management

### UI Technologies

* CSS Flexbox
* CSS Grid
* Responsive layouts
* Modern web interface components

---

# 📂 Project Structure

```text
TradeHub/
│
├── assets/
│   ├── icons/
│   └── images/
│       └── Truck1-TradeH.webp
│
├── css/
│   ├── auth.css
│   ├── inventory.css
│   ├── products.css
│   └── style.css
│
├── js/
│   ├── app.js
│   ├── auth.js
│   ├── cart.js
│   ├── coupons.js
│   ├── logistics.js
│   ├── messages.js
│   ├── orders.js
│   ├── products.js
│   ├── reviews.js
│   └── wishlist.js
│
├── pages/
│   │
│   ├── login.html
│   ├── register.html
│   │
│   ├── customer-dashboard.html
│   ├── business-dashboard.html
│   │
│   ├── products.html
│   ├── product-details.html
│   ├── add-product.html
│   ├── edit-product.html
│   │
│   ├── cart.html
│   ├── checkout.html
│   │
│   ├── orders.html
│   ├── order-details.html
│   ├── business-orders.html
│   │
│   ├── wishlist.html
│   │
│   ├── inventory.html
│   │
│   ├── business-coupons.html
│   ├── business-verification.html
│   │
│   ├── sell-used-product.html
│   ├── edit-used-product.html
│   ├── sale-details.html
│   │
│   ├── messages.html
│   │
│   ├── logistics.html
│   ├── list-logistics.html
│   ├── logistics-details.html
│   ├── logistics-bookings.html
│   └── logistics-booking-details.html
│
├── index.html
│
└── README.md
```

---

# ⚙️ Installation & Setup

## Prerequisites

You only need a modern web browser to run this project.

Recommended tools:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Visual Studio Code
* Live Server extension for VS Code

---

## Clone the Repository

```bash
git clone <your-repository-url>
```

Move into the project folder:

```bash
cd TradeHub
```

---

## Launch the Application

### Option 1: Directly Open

Open:

```text
index.html
```

in your preferred web browser.

### Option 2: Using VS Code Live Server

1. Open the TradeHub folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click on `index.html`.
4. Select **Open with Live Server**.

---

# 💾 Data Management & Privacy

TradeHub currently uses client-side browser storage for application data.

### Stored Data May Include

* User account information
* Session data
* Cart items
* Wishlist items
* Product data
* Orders
* Inventory information
* Coupons
* Reviews
* Messages
* Logistics bookings

> **Note:** Since this is a frontend-based project, clearing browser storage may remove locally stored application data.

---

# 🎯 Project Objective

The main objective of TradeHub is to create a single platform capable of supporting multiple forms of commerce.

Instead of using separate platforms for:

* Online shopping
* Wholesale business
* Used product selling
* Inventory management
* Logistics
* Business communication

TradeHub integrates these features into one marketplace ecosystem.

### TradeHub Vision

> **One Platform. Multiple Markets. Endless Possibilities.**

---

# 🔮 Future Enhancements

Future versions of TradeHub can include:

* Backend server integration
* Database connectivity
* Secure password encryption
* JWT authentication
* Cloud data storage
* Real-time messaging
* Online payment gateway
* AI-based product recommendations
* Advanced search and filtering
* Real-time order tracking
* Seller ratings
* Verified business badges
* Email notifications
* Mobile application
* Admin dashboard
* Analytics and reporting

---

# 👨‍💻 Team & Contributors

This project was developed collaboratively by a team of three members.

### Member 1 — Core Development

Responsible primarily for:

* Major application development
* Core marketplace functionality
* Primary feature implementation
* Overall project architecture

### Member 2 — Feature Development & Testing

Contributed to:

* Feature implementation
* Frontend improvements
* Module development
* Testing and debugging

### Member 3 — Supporting Contribution

Contributed to:

* Supporting features
* Minor improvements
* Testing and project assistance

---

# 📄 License

This project is developed for **educational and learning purposes**.

Feel free to explore, learn from, and improve the project.

---

# ⭐ TradeHub

### **Buy. Sell. Trade. Connect. — All in One Place.**

**TradeHub — Your Complete Multi-Marketplace Ecosystem.**
