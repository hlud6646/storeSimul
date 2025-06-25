from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import os

app = FastAPI()

# CORS configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db_connection():
    conn = psycopg2.connect(
        host=os.environ.get("POSTGRES_HOST", "localhost"),
        database=os.environ.get("POSTGRES_DB", "store"),
        user=os.environ.get("POSTGRES_USER", "storesimul"),
        password=os.environ.get("POSTGRES_PASSWORD", "secret"),
        port=os.environ.get("POSTGRES_PORT", "5432")
    )
    return conn

@app.get("/recent_orders")
def read_recent_orders():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT po.id, c.name, po.created, po.address
        FROM purchase_order po
        JOIN customer c ON po.customer = c.id
        ORDER BY po.created DESC
        LIMIT 5;
    """)
    orders = cur.fetchall()
    cur.close()
    conn.close()
    return [{ "id": o[0], "customer": o[1], "date": o[2].strftime('%Y-%m-%d'), "address": o[3] } for o in orders]

@app.get("/top_products")
def read_top_products():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT p.id, p.name, SUM(pop.quantity) as total_sales
        FROM product p
        JOIN purchase_order_products pop ON p.id = pop.product
        GROUP BY p.id, p.name
        ORDER BY total_sales DESC
        LIMIT 5;
    """)
    products = cur.fetchall()
    cur.close()
    conn.close()
    return [{ "id": p[0], "name": p[1], "sales": p[2] } for p in products]

@app.get("/new_customers")
def read_new_customers():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT id, name, email, created
        FROM customer
        ORDER BY created DESC
        LIMIT 5;
    """)
    customers = cur.fetchall()
    cur.close()
    conn.close()
    return [{ "id": c[0], "name": c[1], "email": c[2], "joined": c[3].strftime('%Y-%m-%d') } for c in customers]

@app.get("/orders_over_time")
def read_orders_over_time():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""
        SELECT
            to_timestamp(floor((extract(epoch from created) / 10)) * 10) AT TIME ZONE 'UTC' as time_window,
            COUNT(id) as order_count
        FROM
            purchase_order
        GROUP BY
            time_window
        ORDER BY
            time_window;
    """)
    orders_data = cur.fetchall()
    cur.close()
    conn.close()
    return [{ "date": row[0].strftime('%Y-%m-%d %H:%M:%S'), "orders": row[1] } for row in orders_data]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8005) 