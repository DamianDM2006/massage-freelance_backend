DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS client_credentials;
DROP TABLE IF EXISTS patient_info;
DROP TABLE IF EXISTS addresses;

CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  street_number_1 VARCHAR(100),
  street_number_2 VARCHAR(100),
  apt_unit VARCHAR(10),
  city VARCHAR(30),
  sub_district VARCHAR(40),
  district VARCHAR(40),
  provence_state VARCHAR(40),
  postal_code INT
);

CREATE TABLE patient_info (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(35) NOT NULL,
  nickname VARCHAR(30) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  address_id INT REFERENCES addresses(id),
  email VARCHAR(100),
  line_user_id VARCHAR(50),
  phone VARCHAR(20),
  birthdate DATE
);

CREATE TABLE client_credentials (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(30) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  patient_id INT REFERENCES patient_info(id) NOT NULL
);

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time TIME NOT NULL,
  patient_id INT REFERENCES patient_info(id) NOT NULL,
  service_id INT REFERENCES services(id) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false
);