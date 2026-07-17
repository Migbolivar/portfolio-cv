-- ============================================================
-- ANALYTICAL QUERIES — Star Schema
-- ============================================================

-- 🏆 Q1: Top 5 Products by Revenue
SELECT p.product_name, p.category,
       COUNT(*) AS orders,
       ROUND(SUM(f.total_amount), 2) AS revenue
FROM fact_sales f
JOIN dim_product p ON f.product_key = p.product_key
GROUP BY p.product_name, p.category
ORDER BY revenue DESC
LIMIT 5;


-- 📈 Q2: Monthly Revenue Trend
SELECT d.year, d.month_name,
       COUNT(DISTINCT f.order_id) AS total_orders,
       ROUND(SUM(f.total_amount), 2) AS revenue
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
GROUP BY d.year, d.month, d.month_name
ORDER BY d.year, d.month;


-- 🌍 Q3: Revenue by Region
SELECT c.region,
       COUNT(DISTINCT f.order_id) AS orders,
       ROUND(SUM(f.total_amount), 2) AS revenue,
       COUNT(DISTINCT f.customer_key) AS customers
FROM fact_sales f
JOIN dim_country c ON f.country_key = c.country_key
GROUP BY c.region
ORDER BY revenue DESC;


-- 👤 Q4: Customer Segment Performance
SELECT cu.segment,
       COUNT(DISTINCT f.customer_key) AS customers,
       ROUND(AVG(customer_revenue), 2) AS avg_ltv
FROM (
    SELECT customer_key, SUM(total_amount) AS customer_revenue
    FROM fact_sales
    GROUP BY customer_key
) f
JOIN dim_customer cu ON f.customer_key = cu.customer_key
GROUP BY cu.segment
ORDER BY avg_ltv DESC;


-- 📅 Q5: Weekend vs Weekday Performance
SELECT d.is_weekend,
       CASE WHEN d.is_weekend = 1 THEN 'Weekend' ELSE 'Weekday' END AS day_type,
       COUNT(*) AS transactions,
       ROUND(SUM(f.total_amount), 2) AS revenue,
       ROUND(AVG(f.total_amount), 2) AS avg_order
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
GROUP BY d.is_weekend;


-- 🛍️ Q6: Cross-Sell Opportunities
SELECT p1.product_name AS product_a, p2.product_name AS product_b,
       COUNT(*) AS bought_together
FROM fact_sales f1
JOIN fact_sales f2 ON f1.order_id = f2.order_id AND f1.product_key < f2.product_key
JOIN dim_product p1 ON f1.product_key = p1.product_key
JOIN dim_product p2 ON f2.product_key = p2.product_key
GROUP BY p1.product_name, p2.product_name
ORDER BY bought_together DESC
LIMIT 10;
