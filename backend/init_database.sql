-- Create MOBILE_SYSTEM table
CREATE TABLE IF NOT EXISTS MOBILE_SYSTEM (
    id SERIAL PRIMARY KEY,
    users_name VARCHAR(255) NOT NULL,
    phone_nbr VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    operator_name VARCHAR(100),
    country_name VARCHAR(100),
    country_code VARCHAR(10)
);

-- Add some sample data (optional)
INSERT INTO MOBILE_SYSTEM (users_name, phone_nbr, description, operator_name, country_name, country_code) 
VALUES 
    ('John Doe', '+1234567890', 'Personal mobile number', 'Verizon', 'United States', '+1'),
    ('Jane Smith', '+9876543210', 'Work mobile number', 'AT&T', 'United States', '+1'),
    ('Ahmed Hassan', '+201234567890', 'Personal number', 'Vodafone', 'Egypt', '+20')
ON CONFLICT (phone_nbr) DO NOTHING;

-- Display the table structure
\d MOBILE_SYSTEM; 