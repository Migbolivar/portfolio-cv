-- ============================================================
-- CHINOOK MUSIC STORE — SQL Data Analysis Queries
-- 20 queries: Easy → Medium → Hard (portfolio-ready)
-- ============================================================

-- ============================================================
-- LEVEL 1: EASY (8 queries) — Basic SELECT, JOIN, GROUP BY
-- ============================================================

-- Q1: Who is the senior-most employee by hire date?
SELECT first_name, last_name, title, hire_date
FROM employee
ORDER BY hire_date ASC
LIMIT 1;

-- Q2: Which countries have the most invoices?
SELECT billing_country, COUNT(*) AS total_invoices
FROM invoice
GROUP BY billing_country
ORDER BY total_invoices DESC;

-- Q3: Top 5 cities by total invoice amount
SELECT billing_city, SUM(total) AS total_revenue
FROM invoice
GROUP BY billing_city
ORDER BY total_revenue DESC
LIMIT 5;

-- Q4: Best customer (highest total spent)
SELECT c.customer_id, c.first_name, c.last_name, SUM(i.total) AS total_spent
FROM customer c
JOIN invoice i ON c.customer_id = i.customer_id
GROUP BY c.customer_id
ORDER BY total_spent DESC
LIMIT 1;

-- Q5: How many tracks are in each genre?
SELECT g.name AS genre, COUNT(t.track_id) AS track_count
FROM genre g
LEFT JOIN track t ON g.genre_id = t.genre_id
GROUP BY g.genre_id
ORDER BY track_count DESC;

-- Q6: Albums with the most tracks
SELECT a.title AS album, ar.name AS artist, COUNT(t.track_id) AS tracks
FROM album a
JOIN artist ar ON a.artist_id = ar.artist_id
JOIN track t ON a.album_id = t.album_id
GROUP BY a.album_id
ORDER BY tracks DESC
LIMIT 10;

-- Q7: Monthly revenue trend
SELECT strftime('%Y-%m', invoice_date) AS month, 
       SUM(total) AS monthly_revenue,
       COUNT(*) AS invoice_count
FROM invoice
GROUP BY month
ORDER BY month;

-- Q8: Customers by country
SELECT country, COUNT(*) AS customer_count
FROM customer
GROUP BY country
ORDER BY customer_count DESC;

-- ============================================================
-- LEVEL 2: MEDIUM (7 queries) — Multi-JOIN, Subqueries, CTEs
-- ============================================================

-- Q9: Top 5 artists by total track sales (revenue)
SELECT ar.name AS artist, COUNT(il.track_id) AS tracks_sold,
       ROUND(SUM(il.unit_price * il.quantity), 2) AS total_revenue
FROM artist ar
JOIN album al ON ar.artist_id = al.artist_id
JOIN track t ON al.album_id = t.album_id
JOIN invoice_line il ON t.track_id = il.track_id
GROUP BY ar.artist_id
ORDER BY total_revenue DESC
LIMIT 5;

-- Q10: All Rock music listeners (customers who bought Rock tracks)
SELECT DISTINCT c.email, c.first_name, c.last_name, g.name AS genre
FROM customer c
JOIN invoice i ON c.customer_id = i.customer_id
JOIN invoice_line il ON i.invoice_id = il.invoice_id
JOIN track t ON il.track_id = t.track_id
JOIN genre g ON t.genre_id = g.genre_id
WHERE g.name = 'Rock'
ORDER BY c.email;

-- Q11: Top 10 rock artists by number of tracks
SELECT ar.name AS artist, COUNT(t.track_id) AS rock_tracks
FROM artist ar
JOIN album al ON ar.artist_id = al.artist_id
JOIN track t ON al.album_id = t.album_id
JOIN genre g ON t.genre_id = g.genre_id
WHERE g.name = 'Rock'
GROUP BY ar.artist_id
ORDER BY rock_tracks DESC
LIMIT 10;

-- Q12: Tracks longer than the average track length
SELECT name, milliseconds, 
       ROUND(milliseconds / 1000.0, 1) AS seconds
FROM track
WHERE milliseconds > (SELECT AVG(milliseconds) FROM track)
ORDER BY milliseconds DESC
LIMIT 10;

-- Q13: Customer spending by country (with customer count)
SELECT c.country, 
       COUNT(DISTINCT c.customer_id) AS customer_count,
       ROUND(SUM(i.total), 2) AS total_revenue,
       ROUND(SUM(i.total) / COUNT(DISTINCT c.customer_id), 2) AS avg_per_customer
FROM customer c
JOIN invoice i ON c.customer_id = i.customer_id
GROUP BY c.country
ORDER BY total_revenue DESC;

-- Q14: Most popular genre by invoice count
SELECT g.name AS genre, 
       COUNT(il.invoice_line_id) AS times_purchased,
       ROUND(SUM(il.unit_price * il.quantity), 2) AS total_revenue
FROM genre g
JOIN track t ON g.genre_id = t.genre_id
JOIN invoice_line il ON t.track_id = il.track_id
GROUP BY g.genre_id
ORDER BY times_purchased DESC;

-- Q15: Employees and their sales performance
SELECT e.first_name || ' ' || e.last_name AS employee,
       COUNT(i.invoice_id) AS invoices_managed,
       ROUND(SUM(i.total), 2) AS total_sales
FROM employee e
JOIN customer c ON e.employee_id = c.support_rep_id
JOIN invoice i ON c.customer_id = i.customer_id
GROUP BY e.employee_id
ORDER BY total_sales DESC;

-- ============================================================
-- LEVEL 3: HARD (5 queries) — CTEs + Window Functions
-- ============================================================

-- Q16: Customer spending per artist (shows customer taste)
WITH customer_artist_spending AS (
    SELECT c.customer_id, c.first_name, c.last_name, 
           ar.name AS artist,
           ROUND(SUM(il.unit_price * il.quantity), 2) AS amount_spent
    FROM customer c
    JOIN invoice i ON c.customer_id = i.customer_id
    JOIN invoice_line il ON i.invoice_id = il.invoice_id
    JOIN track t ON il.track_id = t.track_id
    JOIN album al ON t.album_id = al.album_id
    JOIN artist ar ON al.artist_id = ar.artist_id
    GROUP BY c.customer_id, ar.artist_id
)
SELECT * FROM customer_artist_spending
ORDER BY amount_spent DESC
LIMIT 20;

-- Q17: Most popular genre per country (Window Function)
WITH genre_sales_by_country AS (
    SELECT c.country, g.name AS genre, 
           COUNT(il.invoice_line_id) AS purchases,
           ROW_NUMBER() OVER (PARTITION BY c.country ORDER BY COUNT(il.invoice_line_id) DESC) AS rank
    FROM customer c
    JOIN invoice i ON c.customer_id = i.customer_id
    JOIN invoice_line il ON i.invoice_id = il.invoice_id
    JOIN track t ON il.track_id = t.track_id
    JOIN genre g ON t.genre_id = g.genre_id
    GROUP BY c.country, g.genre_id
)
SELECT country, genre, purchases
FROM genre_sales_by_country
WHERE rank = 1
ORDER BY purchases DESC;

-- Q18: Top customer per country (Window Function)
WITH customer_country_rank AS (
    SELECT c.country, 
           c.first_name || ' ' || c.last_name AS customer,
           ROUND(SUM(i.total), 2) AS total_spent,
           ROW_NUMBER() OVER (PARTITION BY c.country ORDER BY SUM(i.total) DESC) AS rank
    FROM customer c
    JOIN invoice i ON c.customer_id = i.customer_id
    GROUP BY c.country, c.customer_id
)
SELECT country, customer, total_spent
FROM customer_country_rank
WHERE rank = 1
ORDER BY total_spent DESC;

-- Q19: Customer Lifetime Value with segments (CTE + CASE)
WITH clv AS (
    SELECT c.customer_id, 
           c.first_name || ' ' || c.last_name AS customer,
           c.country,
           COUNT(DISTINCT i.invoice_id) AS total_orders,
           ROUND(SUM(i.total), 2) AS lifetime_value,
           ROUND(AVG(i.total), 2) AS avg_order_value
    FROM customer c
    JOIN invoice i ON c.customer_id = i.customer_id
    GROUP BY c.customer_id
)
SELECT customer, country, total_orders, lifetime_value, avg_order_value,
       CASE 
           WHEN lifetime_value >= 45 THEN 'Premium'
           WHEN lifetime_value >= 40 THEN 'Gold'
           WHEN lifetime_value >= 35 THEN 'Silver'
           ELSE 'Bronze'
       END AS segment
FROM clv
ORDER BY lifetime_value DESC;

-- Q20: Month-over-Month revenue growth (Window Function LAG)
WITH monthly AS (
    SELECT strftime('%Y-%m', invoice_date) AS month,
           ROUND(SUM(total), 2) AS revenue
    FROM invoice
    GROUP BY month
)
SELECT month, revenue,
       ROUND(LAG(revenue) OVER (ORDER BY month), 2) AS previous_month,
       ROUND(revenue - LAG(revenue) OVER (ORDER BY month), 2) AS change,
       CASE 
           WHEN LAG(revenue) OVER (ORDER BY month) > 0 
           THEN ROUND((revenue - LAG(revenue) OVER (ORDER BY month)) / LAG(revenue) OVER (ORDER BY month) * 100, 1)
           ELSE NULL 
       END AS pct_change
FROM monthly
ORDER BY month;
