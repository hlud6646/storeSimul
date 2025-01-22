from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from pathlib import Path
from loguru import logger
from faker import Faker
from faker.providers import internet
from time import sleep
from math import log
from random import random
import os

from models import Customer

SECONDS_PER_MINUTE = 60

def exponential(rate):
    return -(1 / rate) * log(1 - random())

# Configure logging.
log_dir = Path(__file__).parent.parent / 'logs'
log_dir.mkdir(exist_ok=True)
log_path = log_dir / 'create.log'
if not log_path.exists():
    log_path.touch()
logger.add(log_path, level="DEBUG")

# Configure database connection.
pg_database = os.environ.get("POSTGRES_DB")
pg_user = os.environ.get("POSTGRES_USER")
pg_password = os.environ.get("POSTGRES_PASSWORD")
pg_port = os.environ.get("POSTGRES_PORT")
engine = create_engine(f'postgresql://{pg_user}:{pg_password}@localhost:{pg_port}/{pg_database}')

# Configure data faker.
faker = Faker('en_AU')
faker.add_provider(internet)


try:
    # Add customers according to a poisson process with mean interval 5 seconds.
    while True:
        with Session(engine) as session:
            customer = Customer(name=faker.name(),
                                email=faker.ascii_email(),
                                # TODO: implement.
                                primary_address=...fakeaddresss...)
            session.add(customer)
            session.commit()
            logger.info(f'New customer: {customer} written to database.')
        sleep(exponential(5 * SECONDS_PER_MINUTE))
except Exception as e:
    print(e)
