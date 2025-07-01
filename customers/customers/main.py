from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from pathlib import Path
from loguru import logger
from faker import Faker
from faker.providers import internet, address
from time import sleep
from math import log
from random import random
import os
from models import Customer

SECONDS_PER_MINUTE = 60

# Sample an exponential random variable with given rate.
def exponential(rate):
    return -(1 / rate) * log(1 - random())

# Configure logging.
# log_dir = Path(__file__).parent.parent / 'logs'
# log_dir.mkdir(exist_ok=True)
# log_path = log_dir / 'create_customer.log'
# if not log_path.exists():
#     log_path.touch()
# logger.add(log_path, level="DEBUG")

# Configure database connection.
pg_host     = os.environ.get("POSTGRES_HOST")     or "store-db"
pg_database = os.environ.get("POSTGRES_DB")       or "storesimul"
pg_user     = os.environ.get("POSTGRES_USER")     or "storesimul"
pg_password = os.environ.get("POSTGRES_PASSWORD") or "secret"
pg_port     = os.environ.get("POSTGRES_PORT")     or "5432"
engine = create_engine(f'postgresql://{pg_user}:{pg_password}@{pg_host}:{pg_port}/{pg_database}')

# Configure data faker.
faker = Faker('en_AU')
faker.add_provider(internet)

while True:
    with Session(engine) as session:
        customer = Customer(name=faker.name(),
                            email=faker.ascii_email(),
                            primary_address=faker.address())
        session.add(customer)
        session.commit()
        logger.info(f'New customer: {customer} written to database.')
    sleep(exponential(1 * SECONDS_PER_MINUTE) * int(os.environ['CUSTOMER_RATE']))
