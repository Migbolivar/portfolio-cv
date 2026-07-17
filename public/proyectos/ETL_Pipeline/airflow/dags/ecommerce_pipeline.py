'''
E-commerce Analytics Pipeline
Author: Miguel Bolivar
Description: End-to-end ETL pipeline for online retail data
Schedule: @daily
'''

from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.providers.postgres.operators.postgres import PostgresOperator
from datetime import datetime, timedelta
import pandas as pd
import os

default_args = {
    'owner': 'miguel_bolivar',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'retries': 2,
    'retry_delay': timedelta(minutes=5),
    'email_on_failure': True,
    'email': ['miguelangelbolivarmella@gmail.com'],
}

dag = DAG(
    'ecommerce_analytics_pipeline',
    default_args=default_args,
    description='ETL: Raw Excel → Staging → Analytics Marts',
    schedule_interval='@daily',
    catchup=False,
    tags=['etl', 'retail', 'dbt'],
)


# ── TASK 1: EXTRACT ──────────────────────────────────
def extract_data(**context):
    '''Extract raw Excel data from source system'''
    source_path = '/data/raw/online_retail.xlsx'
    df = pd.read_excel(source_path)
    context['ti'].xcom_push(key='row_count', value=len(df))
    print(f'[EXTRACT] Loaded {len(df):,} rows from {source_path}')
    return source_path


# ── TASK 2: VALIDATE ──────────────────────────────────
def validate_data(**context):
    '''Data quality checks before transformation'''
    source = context['ti'].xcom_pull(task_ids='extract_data')
    df = pd.read_excel(source)
    
    # Quality checks
    null_customer = df['CustomerID'].isna().sum()
    null_desc = df['Description'].isna().sum()
    negative_qty = (df['Quantity'] <= 0).sum()
    negative_price = (df['UnitPrice'] <= 0).sum()
    
    report = {
        'total_rows': len(df),
        'null_customer_id': int(null_customer),
        'null_description': int(null_desc),
        'negative_quantity': int(negative_qty),
        'negative_price': int(negative_price),
        'passed': (null_customer + null_desc + negative_qty + negative_price) < len(df) * 0.3
    }
    
    context['ti'].xcom_push(key='quality_report', value=report)
    
    if not report['passed']:
        raise ValueError(f'Data quality check FAILED: {report}')
    
    print(f'[VALIDATE] ✓ Quality check passed: {report}')


# ── TASK 3: TRANSFORM ──────────────────────────────────
def transform_data(**context):
    '''Clean and transform raw data into staging format'''
    source = context['ti'].xcom_pull(task_ids='extract_data')
    df = pd.read_excel(source)
    
    # Clean
    df = df.dropna(subset=['CustomerID', 'Description'])
    df = df[df['Quantity'] > 0]
    df = df[df['UnitPrice'] > 0]
    
    # Transform
    df['CustomerID'] = df['CustomerID'].astype(int)
    df['TotalPrice'] = df['Quantity'] * df['UnitPrice']
    df['InvoiceDate'] = pd.to_datetime(df['InvoiceDate'])
    df['OrderMonth'] = df['InvoiceDate'].dt.to_period('M').astype(str)
    df['Country'] = df['Country'].str.strip().str.title()
    
    # Save staging
    output_path = '/data/processed/staging_orders.csv'
    df.to_csv(output_path, index=False)
    
    context['ti'].xcom_push(key='clean_rows', value=len(df))
    context['ti'].xcom_push(key='clean_customers', value=df['CustomerID'].nunique())
    
    print(f'[TRANSFORM] Cleaned: {len(df):,} rows, {df["CustomerID"].nunique()} customers → {output_path}')


# ── TASK 4: LOAD to PostgreSQL ──────────────────────────
load_to_db = PostgresOperator(
    task_id='load_to_postgres',
    postgres_conn_id='analytics_db',
    sql='''
    TRUNCATE TABLE staging.orders;
    \\copy staging.orders FROM '/data/processed/staging_orders.csv' CSV HEADER;
    SELECT COUNT(*) AS loaded_rows FROM staging.orders;
    ''',
    dag=dag,
)


# ── TASK 5: RUN DBT ──────────────────────────────────
def run_dbt_models(**context):
    '''Execute dbt transformations for analytics marts'''
    import subprocess
    
    result = subprocess.run(
        ['dbt', 'run', '--project-dir', '/dbt', '--profiles-dir', '/dbt'],
        capture_output=True, text=True
    )
    
    if result.returncode == 0:
        print('[DBT] ✓ All models built successfully')
    else:
        print(f'[DBT] ✗ Error: {result.stderr}')
        raise RuntimeError('dbt run failed')
    
    # Run tests
    test_result = subprocess.run(
        ['dbt', 'test', '--project-dir', '/dbt'],
        capture_output=True, text=True
    )
    print(f'[DBT] Tests: {test_result.stdout[-500:]}')


# ── DAG STRUCTURE ──────────────────────────────────
t1 = PythonOperator(task_id='extract_data', python_callable=extract_data, dag=dag)
t2 = PythonOperator(task_id='validate_data', python_callable=validate_data, dag=dag)
t3 = PythonOperator(task_id='transform_data', python_callable=transform_data, dag=dag)
t4 = PythonOperator(task_id='run_dbt_models', python_callable=run_dbt_models, dag=dag)

t1 >> t2 >> t3 >> load_to_db >> t4
