"""
PySpark ETL Pipeline — Medallion Architecture
Author: Miguel Bolivar
Dataset: 500K e-commerce orders
Architecture: Bronze -> Silver -> Gold (Data Lakehouse)
"""

from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
from pyspark.sql.window import Window

spark = SparkSession.builder \
    .appName("Ecommerce-DataLake-ETL") \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.sql.adaptive.coalescePartitions.enabled", "true") \
    .config("spark.sql.shuffle.partitions", "200") \
    .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
    .getOrCreate()

spark.sparkContext.setLogLevel("WARN")
BASE = "/opt/data_lake"

# ===== BRONZE: Raw Ingestion =====
print("[BRONZE] Ingesting raw data...")
bronze_df = spark.read.parquet(f"{BASE}/bronze/raw_orders.parquet")

total_raw = bronze_df.count()
null_customers = bronze_df.filter(col("customer_id").isNull()).count()
empty_countries = bronze_df.filter(col("country") == "").count()
negative_prices = bronze_df.filter(col("unit_price") < 0).count()

print(f"Raw records:       {total_raw:,}")
print(f"Null customers:    {null_customers}")
print(f"Empty countries:   {empty_countries}")
print(f"Negative prices:   {negative_prices}")

# ===== SILVER: Clean & Enrich =====
print("[SILVER] Cleaning and enriching...")
silver_df = bronze_df \
    .filter(col("customer_id").isNotNull()) \
    .filter(col("quantity") > 0) \
    .filter(col("unit_price") > 0) \
    .filter(col("country") != "") \
    .withColumn("order_date", to_date(col("order_date"))) \
    .withColumn("total_amount", round(col("quantity") * col("unit_price"), 2)) \
    .withColumn("order_month", date_format(col("order_date"), "yyyy-MM")) \
    .withColumn("day_of_week", date_format(col("order_date"), "EEEE")) \
    .withColumn("is_weekend", when(col("day_of_week").isin("Saturday","Sunday"), True).otherwise(False)) \
    .withColumn("price_segment",
        when(col("unit_price") <= 20, "Budget")
        .when(col("unit_price") <= 100, "Mid-Range")
        .when(col("unit_price") <= 300, "Premium")
        .otherwise("Luxury"))

silver_df = silver_df.dropDuplicates(["order_id"])
silver_df.write.mode("overwrite").partitionBy("order_month").parquet(f"{BASE}/silver/orders")
clean_count = silver_df.count()
print(f"Silver records:    {clean_count:,}")

# ===== GOLD: Analytics Marts =====
print("[GOLD] Building analytics marts...")

daily_revenue = silver_df.groupBy("order_date").agg(
    countDistinct("order_id").alias("total_orders"),
    round(sum("total_amount"), 2).alias("total_revenue"),
    round(avg("total_amount"), 2).alias("avg_order_value")
).orderBy("order_date")
daily_revenue.write.mode("overwrite").parquet(f"{BASE}/gold/daily_revenue")
print(f"  daily_revenue: {daily_revenue.count()} days")

customer_metrics = silver_df.groupBy("customer_id").agg(
    countDistinct("order_id").alias("total_orders"),
    round(sum("total_amount"), 2).alias("lifetime_value"),
    min("order_date").alias("first_order"),
    max("order_date").alias("last_order"),
    countDistinct("order_month").alias("active_months")
).withColumn("customer_lifespan_days", datediff(col("last_order"), col("first_order"))) \
 .withColumn("value_segment",
    when(col("lifetime_value") > 5000, "High Value")
    .when(col("lifetime_value") > 1000, "Medium Value")
    .when(col("lifetime_value") > 100, "Low Value")
    .otherwise("One-time"))
customer_metrics.write.mode("overwrite").parquet(f"{BASE}/gold/customer_metrics")
print(f"  customer_metrics: {customer_metrics.count()} customers")

category_perf = silver_df.groupBy("category", "order_month").agg(
    countDistinct("order_id").alias("orders"),
    round(sum("total_amount"), 2).alias("revenue")
).orderBy("order_month", col("revenue").desc())
category_perf.write.mode("overwrite").partitionBy("order_month").parquet(f"{BASE}/gold/category_performance")
print(f"  category_performance: {category_perf.count()} rows")

country_revenue = silver_df.groupBy("country").agg(
    countDistinct("order_id").alias("total_orders"),
    round(sum("total_amount"), 2).alias("total_revenue"),
    round(avg("total_amount"), 2).alias("avg_order_value")
).orderBy(col("total_revenue").desc())
country_revenue.write.mode("overwrite").parquet(f"{BASE}/gold/country_revenue")
print(f"  country_revenue: {country_revenue.count()} countries")

# ===== SPARK SQL ANALYTICS =====
print("[SQL] Running analytics queries...")
silver_df.createOrReplaceTempView("orders")

spark.sql("""
    SELECT product, category, COUNT(*) AS orders,
           ROUND(SUM(total_amount), 2) AS revenue
    FROM orders GROUP BY product, category
    ORDER BY revenue DESC LIMIT 5
""").show(5, False)

# ===== PERFORMANCE OPTIMIZATION =====
silver_df.cache()
print(f"Cached: {silver_df.count():,} records")
silver_df.unpersist()

print("Pipeline complete!")
spark.stop()
