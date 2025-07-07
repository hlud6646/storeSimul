# Fake Store

**Given the scope and intention of this project, would SQLite not be a more
appropriate solution? I mean, we're not persisting the database, or using
anything that's particular to postgres. We *are* installing on an container
though, which is both weird and hard to do with a full database service...**

This is a pretty kooky project and exists entirely for learning.
It is essesntially a simulation of a shop, with a database recording
customers, product inventory, orders etc. 

The inital idea was to have a project that showed a lot of database
knowledge, but it has branched out into:
- App frameworks in Java, Python etc.
- Database toolkits in the same;
- Containerisation.

Each part of the store is managed in a different language, but confronts similar tasks.
These are 
- IO;
- Database connectivity;
- Logging;
- Statistics;
- Data-faking.


## Components
These are the components of the simulation that are currently running.

### Customers (Python)
Built with Poetry. Sqlalchemy is used as an ORM to interact with the database.

### Products (Scala)
Built with Sbt. I avoided the very complicated looking 
Typelevel solutions for DB interaction and went for a basic aproach with java.sql.

### Suppliers (Haskell)
Built with cabal. Best fake data library of the lot. Not surprisingly, this was the most
comlicated, especialyl when it came to getting a working haskell compiler on a container. 
The current `docker compose build --no-cache suppliers` is above 10 minutes and not finished...

### Orders (Elixir)
Built with Mix, using the fully featured Ecto ORM system. This one is my favourite database API.

### Employees (Java)
Tooo... Maybe emplyees should occasionally pack the wrong item.


## Dashboard

A simple dashboard will show any DB interactions as they occur, a list of unshipped 
orders etc. To do that we'll need an API too...

## Dashboard API
Simple FastAPI that lets you peek at the databas/


## Containerisation
Initially I had a realistic architecture with each microservice defining it's own image, with
docker compose tying it all together.  This was good to play with, but is overkill for a toy project.
The new version has all services running in a single debian derived image. This is bad, but it works.
The disadvantage is that you have to install postgres and haskell on the server by yourself, which is 
a bit of a slog.

The single image also holds the database, and to simplify even further there is no attached volume. This
means that there is no data persistance, which is obviously very bad for a database but fine for this 
project.
