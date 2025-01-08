from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from pathlib import Path
from loguru import logger
from faker import Faker
from faker.providers import internet
from numpy.random import exponential
from time import sleep

from models import Customer

SECONDS_PER_MINUTE = 60

# Configure logging.
log_dir = Path(__file__).parent.parent / 'logs'
log_dir.mkdir(exist_ok=True)
log_path = log_dir / 'create.log'
if not log_path.exists():
    log_path.touch()
logger.add(log_path, level="DEBUG")

# Configure database connection.
engine = create_engine('postgresql://storesimuladmin@localhost:5432/storesimul')

# Configure data faker.
faker = Faker('en_AU')
faker.add_provider(internet)

# Add customers according to a poisson process with mean interval 5 seconds.
while True:
    with Session(engine) as session:
        customer = Customer(name=faker.name(), email=faker.ascii_email())
        session.add(customer)
        session.commit()
        logger.info(f'New customer: {customer} written to database.')
    sleep(exponential(5 * SECONDS_PER_MINUTE))
