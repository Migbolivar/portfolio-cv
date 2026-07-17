-- ============================================================
-- E-COMMERCE DATA WAREHOUSE — Star Schema
-- Author: Miguel Bolivar
-- ============================================================

-- ═══ DIMENSION TABLES ═══

CREATE TABLE dim_date (
    date_key        INTEGER PRIMARY KEY,
    full_date       DATE NOT NULL,
    year            INTEGER NOT NULL,
    quarter         INTEGER NOT NULL,
    month           INTEGER NOT NULL,
    month_name      VARCHAR(20),
    day             INTEGER NOT NULL,
    day_of_week     INTEGER NOT NULL,
    day_name        VARCHAR(20),
    is_weekend      BOOLEAN
);

CREATE TABLE dim_product (
    product_key     VARCHAR(20) PRIMARY KEY,
    product_name    VARCHAR(200),
    category        VARCHAR(50)
);

CREATE TABLE dim_customer (
    customer_key    INTEGER PRIMARY KEY,
    first_purchase  DATE,
    country         VARCHAR(50),
    segment         VARCHAR(20)  -- VIP, Regular, New
);

CREATE TABLE dim_country (
    country_key     INTEGER PRIMARY KEY,
    country_name    VARCHAR(50),
    region          VARCHAR(30)  -- Europe, Asia, Americas, Oceania
);


-- ═══ FACT TABLE ═══

CREATE TABLE fact_sales (
    order_id        VARCHAR(20),
    date_key        INTEGER REFERENCES dim_date(date_key),
    product_key     VARCHAR(20) REFERENCES dim_product(product_key),
    customer_key    INTEGER REFERENCES dim_customer(customer_key),
    country_key     INTEGER REFERENCES dim_country(country_key),
    quantity        INTEGER NOT NULL,
    unit_price      DECIMAL(10,2) NOT NULL,
    total_amount    DECIMAL(12,2) NOT NULL,
    PRIMARY KEY (order_id, product_key, date_key)
);

-- ═══ INDEXES ═══
CREATE INDEX idx_fact_date ON fact_sales(date_key);
CREATE INDEX idx_fact_product ON fact_sales(product_key);
CREATE INDEX idx_fact_customer ON fact_sales(customer_key);
