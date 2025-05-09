-- EXECUTE WITH
-- $ psql -U username -a -f ./server/config/db/schema.sql

-- DATABASE initialization

CREATE DATABASE bark_and_purr;

\c bark_and_purr

-- ADD SUPPORT TO ACCENT INSENSITIVE SEARCH
CREATE EXTENSION unaccent;

-- CREATE ENUMS

CREATE TYPE cart_status AS ENUM ('active', 'canceled', 'payment_pending', 'payment_rejected', 'paid');

-- CREATE TABLES

CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  surname VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url VARCHAR(250) NOT NULL,
  avatar_key VARCHAR(250) NOT NULL,
  birthday DATE NOT NULL,
  address_line_1 VARCHAR(50),
  address_line_2 VARCHAR(50),
  city VARCHAR(50),
  state VARCHAR(50),
  country VARCHAR(50),
  zip_code INT,
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
  status cart_status DEFAULT 'active',
  status_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiration TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + '1 day')
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
);

CREATE TABLE reviews (
  id SERIAL NOT NULL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  product_id INT NOT NULL REFERENCES products(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  rating INT NOT NULL,
  body VARCHAR
);

-- AI MOCK DATA

-- Insert mock users (Chilean pet owners and vendors)
INSERT INTO users (surname, last_name, email, password_hash, avatar_url, avatar_key, birthday, address_line_1, address_line_2, city, state, country, zip_code, notify_shipping, notify_publication, notify_review, notify_purchase, notify_pass_change, language, is_active_user, is_verified_user)
VALUES
('Javiera', 'González', 'javierag@example.cl', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'https://example.com/avatars/javiera.jpg', 'javiera-avatar-key', '1990-05-15', 'Av. Providencia 1234', 'Depto 502', 'Santiago', 'Región Metropolitana', 'Chile', 7500000, TRUE, TRUE, TRUE, TRUE, TRUE, 'es', TRUE, TRUE),
('Diego', 'Muñoz', 'diego.munoz@tiendamascotas.cl', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'https://example.com/avatars/diego.jpg', 'diego-avatar-key', '1985-08-22', 'San Martín 456', NULL, 'Valparaíso', 'Valparaíso', 'Chile', 2340000, TRUE, FALSE, TRUE, FALSE, TRUE, 'es', TRUE, TRUE),
('Camila', 'Rojas', 'camila.rojas@example.cl', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'https://example.com/avatars/camila.jpg', 'camila-avatar-key', '1992-11-30', 'Los Leones 789', 'Casa 2', 'Concepción', 'Biobío', 'Chile', 4030000, TRUE, TRUE, TRUE, TRUE, TRUE, 'es', TRUE, TRUE),
('Sebastián', 'Silva', 'seba.silva@petshopchile.cl', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'https://example.com/avatars/sebastian.jpg', 'sebastian-avatar-key', '1988-07-18', 'Pedro de Valdivia 321', NULL, 'Santiago', 'Región Metropolitana', 'Chile', 7500000, FALSE, TRUE, FALSE, TRUE, FALSE, 'es', TRUE, TRUE),
('Francisca', 'Vargas', 'fran.vargas@example.cl', '$2a$10$xJwL5v5Jz5U5Z5U5Z5U5Ze', 'https://example.com/avatars/francisca.jpg', 'francisca-avatar-key', '1995-03-10', 'Las Hualtatas 654', 'Casa B', 'Viña del Mar', 'Valparaíso', 'Chile', 2520000, FALSE, FALSE, FALSE, FALSE, TRUE, 'es', TRUE, FALSE);

-- Insert mock products (pet-related with Chilean context)
INSERT INTO products (vendor_id, is_active_product, title, description, price, stock)
VALUES
(2, TRUE, 'Comedero automático PetSmart', 'Comedero programable para mascotas, ideal para dueños trabajadores', 59990, 20),
(2, TRUE, 'Arnés Paseo Seguro para perros', 'Arnés reflectante para paseos nocturnos en Santiago', 24990, 35),
(4, TRUE, 'Rascador para gatos Chileno', 'Rascador con madera de pino radiata y lana natural', 34990, 15),
(4, TRUE, 'Acuario 50L con diseño nacional', 'Acuario con filtro y calentador para clima chileno', 89990, 8),
(2, FALSE, 'Transportín para gatos modelo Andino', 'Transportín resistente para viajes a la cordillera', 19990, 0),
(4, TRUE, 'Snacks dentales Perro Feliz', 'Snacks con calafate, antioxidante natural de la Patagonia', 12990, 50),
(2, TRUE, 'Cama térmica para perros del sur', 'Cama aislante para climas fríos del sur de Chile', 45990, 12),
(4, TRUE, 'Juguete interactivo Gato Chileno', 'Juguete con plumas de aves nacionales', 8990, 30);

-- Insert mock images for the products
INSERT INTO product_images (product_id, url, key) VALUES
-- Product 1: Comedero automático (Pet Feeder)
(1, 'https://images.pexels.com/photos/4588047/pexels-photo-4588047.jpeg', 'auto_feeder_1'),
(1, 'https://images.pexels.com/photos/4588059/pexels-photo-4588059.jpeg', 'auto_feeder_2'),
-- Product 2: Arnés (Dog Harness)
(2, 'https://images.pexels.com/photos/5731864/pexels-photo-5731864.jpeg', 'harness_1'),
(2, 'https://images.pexels.com/photos/3361739/pexels-photo-3361739.jpeg', 'harness_2'),
-- Product 3: Rascador (Cat Scratcher)
(3, 'https://images.pexels.com/photos/96428/pexels-photo-96428.jpeg', 'scratch_post_1'),
(3, 'https://images.pexels.com/photos/6853286/pexels-photo-6853286.jpeg', 'scratch_post_2'),
-- Product 4: Acuario (Aquarium)
(4, 'https://images.pexels.com/photos/2156311/pexels-photo-2156311.jpeg', 'aquarium_1'),
(4, 'https://images.pexels.com/photos/2156316/pexels-photo-2156316.jpeg', 'aquarium_2'),
-- Product 5: Transportín (Pet Carrier)
(5, 'https://images.pexels.com/photos/1904105/pexels-photo-1904105.jpeg', 'carrier_1'),
(5, 'https://images.pexels.com/photos/1904106/pexels-photo-1904106.jpeg', 'carrier_2'),
-- Product 6: Snacks (Dog Treats)
(6, 'https://images.pexels.com/photos/4587978/pexels-photo-4587978.jpeg', 'treats_1'),
(6, 'https://images.pexels.com/photos/5515881/pexels-photo-5515881.jpeg', 'treats_2'),
-- Product 7: Cama térmica (Dog Bed)
(7, 'https://images.pexels.com/photos/7752794/pexels-photo-7752794.jpeg', 'bed_1'),
(7, 'https://images.pexels.com/photos/7752796/pexels-photo-7752796.jpeg', 'bed_2'),
-- Product 8: Juguete (Cat Toy)
(8, 'https://images.pexels.com/photos/6853287/pexels-photo-6853287.jpeg', 'toy_1'),
(8, 'https://images.pexels.com/photos/6853288/pexels-photo-6853288.jpeg', 'toy_2');


-- Insert mock carts
INSERT INTO carts (user_id, status, status_time)
VALUES
(1, 'paid', CURRENT_TIMESTAMP - INTERVAL '2 days'),
(1, 'canceled', CURRENT_TIMESTAMP - INTERVAL '10 days'),
(3, 'active', CURRENT_TIMESTAMP - INTERVAL '1 hour'),
(5, 'active', CURRENT_TIMESTAMP);

-- Insert products into carts (Chilean pesos values)
INSERT INTO products_by_cart (cart_id, product_id, quantity)
VALUES
(1, 1, 1),  -- Javiera tiene un comedero automático en su carro
(1, 2, 2),  -- y dos arneses
(1, 6, 3),  -- y tres paquetes de snacks
(3, 3, 1),  -- Camila tiene un rascador
(3, 7, 1);  -- y una cama térmica

-- Insert product images with Chilean references
INSERT INTO product_images (product_id, url, key)
VALUES
(1, 'https://example.com/products/comedero-auto.jpg', 'comedero-auto-key'),
(1, 'https://example.com/products/comedero-detalle.jpg', 'comedero-detalle-key'),
(2, 'https://example.com/products/arnes-nocturno.jpg', 'arnes-nocturno-key'),
(3, 'https://example.com/products/rascador-chileno.jpg', 'rascador-chileno-key'),
(3, 'https://example.com/products/rascador-detalle.jpg', 'rascador-detalle-key'),
(4, 'https://example.com/products/acuario-chile.jpg', 'acuario-chile-key'),
(5, 'https://example.com/products/transportin-andino.jpg', 'transportin-key'),
(6, 'https://example.com/products/snacks-calafate.jpg', 'snacks-calafate-key'),
(7, 'https://example.com/products/cama-sur-chile.jpg', 'cama-sur-key'),
(8, 'https://example.com/products/juguete-plumas.jpg', 'juguete-plumas-key');

-- Insert favorites
INSERT INTO favorites (user_id, product_id)
VALUES
(1, 3),  -- A Javiera le gusta el rascador chileno
(1, 7),  -- y la cama térmica
(3, 2),  -- A Camila le gusta el arnés reflectante
(3, 4),  -- y el acuario
(5, 1),  -- A Francisca le gusta el comedero automático
(5, 6);  -- y los snacks de calafate

-- Insert reviews with Chilean Spanish expressions
INSERT INTO reviews (user_id, product_id, rating, body)
VALUES
(1, 2, 5, 'El arnés es la raja! Mi perro queda super seguro en los paseos por el cerro'),
(1, 6, 4, 'Buenísimos los snacks, a mi perro le encantan y tienen ingredientes nacionales'),
(3, 3, 5, 'El rascador es de excelente calidad, típico chileno, bien hecho'),
(3, 8, 3, 'Está bueno el juguete pero se rompió rápido, podría ser más resistente'),
(5, 1, 4, 'Funciona bacán pero la app a veces se tranca'),
(1, 7, 5, 'La mejor compra! Mi perro ahora duerme calentito en las noches frías de Concepción'),
(4, 1, 3, 'Aunque funciona, no es tan buena. Le doy 3 estrellas');