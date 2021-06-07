CREATE DATABASE shared_list;

CREATE TABLE list_item(
  item_id SERIAL,
  user_id uuid,
  description VARCHAR(255) NOT NULL,
  creator VARCHAR(255) NOT NULL,
  creator_name VARCHAR(255),
  editors VARCHAR(255),
  editors_name VARCHAR(255),
  PRIMARY KEY (item_id) 
);

CREATE TABLE users(
  user_id UUID DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password  VARCHAR(255) NOT NULL,
  guests_email VARCHAR(255),
  guests_name VARCHAR(255),
  PRIMARY KEY (user_id)
);