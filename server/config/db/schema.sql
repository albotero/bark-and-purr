-- DATABASE initialization

CREATE DATABASE bark_and_purr;

\c bark_and_purr

-- CREATE TABLES

CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  surname VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  avatar_url VARCHAR(250) NOT NULL,
  avatar_key VARCHAR(250) NOT NULL,
  birthday DATE NOT NULL,
  address_line_1 VARCHAR(50) NOT NULL,
  address_line_2 VARCHAR(50) NOT NULL,
  city VARCHAR(50) NOT NULL,
  state VARCHAR(50) NOT NULL,
  country VARCHAR(50) NOT NULL,
  zip_code INT NOT NULL,
  notify_shipping BOOLEAN DEFAULT TRUE,
  notify_publication BOOLEAN DEFAULT TRUE,
  notify_review BOOLEAN DEFAULT TRUE,
  notify_purchase BOOLEAN DEFAULT TRUE,
  notify_pass_change BOOLEAN DEFAULT TRUE,
  language VARCHAR(2) DEFAULT 'es',
  is_active_user BOOLEAN DEFAULT TRUE,
  is_verified_user BOOLEAN DEFAULT FALSE
);

CREATE TABLE carts (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  is_active_cart BOOLEAN DEFAULT TRUE
);

CREATE TABLE products (
  id SERIAL NOT NULL PRIMARY KEY,
  vendor_id INT NOT NULL REFERENCES users(id),
  is_active_product BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  title VARCHAR(150) NOT NULL,
  description VARCHAR NOT NULL,
  price INT NOT NULL,
  stock INT NOT NULL
);

CREATE TABLE products_by_cart (
  id SERIAL NOT NULL PRIMARY KEY,
  cart_id INT NOT NULL REFERENCES carts(id),
  product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL
);

CREATE TABLE product_images (
  id SERIAL NOT NULL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id),
  url VARCHAR(250) NOT NULL,
  key VARCHAR(50) NOT NULL
);

CREATE TABLE favorites (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  product_id INT NOT NULL REFERENCES products(id)
)

CREATE TABLE reviews (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  product_id INT NOT NULL REFERENCES products(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rating INT NOT NULL,
  body VARCHAR
)