-- Vendors Table
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Items Table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Sales Logs Table
CREATE TABLE sales_logs (
    id SERIAL PRIMARY KEY,
    vendor_id INT REFERENCES vendors(id) ON DELETE CASCADE,
    item_id INT REFERENCES items(id),
    quantity INT NOT NULL,
    log_date DATE DEFAULT CURRENT_DATE
);

-- Forecasts Table
CREATE TABLE forecasts (
    id SERIAL PRIMARY KEY,
    vendor_id INT REFERENCES vendors(id) ON DELETE CASCADE,
    item_id INT REFERENCES items(id),
    forecast_quantity INT NOT NULL,
    forecast_date DATE DEFAULT CURRENT_DATE
);
