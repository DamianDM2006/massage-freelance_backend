DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS patient_info CASCADE;
DROP TABLE IF EXISTS client_credentials CASCADE;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS services;

CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  description TEXT NOT NULL
);

CREATE TABLE addresses (
  id SERIAL PRIMARY KEY,
  street_number_1 VARCHAR(100),
  street_number_2 VARCHAR(100),
  apt_unit VARCHAR(10),
  city VARCHAR(30),
  sub_district VARCHAR(40),
  district VARCHAR(40),
  provence_state VARCHAR(40),
  postal_code INT,
  CONSTRAINT unique_address_idx UNIQUE (
    street_number_1,
    street_number_2,
    apt_unit,
    city,
    sub_district,
    district,
    provence_state,
    postal_code   
  )
);

CREATE TABLE client_credentials (
  id SERIAL PRIMARY KEY,
  user_name VARCHAR(30) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

CREATE TABLE patient_info (
  id SERIAL PRIMARY KEY,
  client_id INT REFERENCES client_credentials(id) NOT NULL,
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

CREATE TABLE appointments (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  patient_id INT REFERENCES patient_info(id) NOT NULL,
  service_id INT REFERENCES services(id) NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT check_range CHECK (end_time > start_time),
  CONSTRAINT scheduled_times UNIQUE (date, start_time, end_time)
);

ALTER TABLE client_credentials
ADD COLUMN patient_id INT UNIQUE REFERENCES patient_info(id);
