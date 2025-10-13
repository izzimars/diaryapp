CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
    id SERIAL UNIQUE,
    user_id VARCHAR(100) PRIMARY KEY DEFAULT ('user-' || replace(gen_random_uuid()::text, '-', '')),
    email VARCHAR(255) UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    otp VARCHAR(6),
    otp_expiry TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
    id SERIAL UNIQUE,
    user_id VARCHAR(100) PRIMARY KEY DEFAULT ('user-' || replace(gen_random_uuid()::text, '-', '')),
    email VARCHAR(255) UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    role VARCHAR(50) DEFAULT 'user' NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);


CREATE TABLE IF NOT EXISTS diaries (
    id SERIAL UNIQUE,
    diary_id VARCHAR(100) PRIMARY KEY DEFAULT ('diary-' || replace(gen_random_uuid()::text, '-', '')),
    name VARCHAR(200) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_diaries_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(user_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE
);
