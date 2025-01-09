# Fake Store


This is a pretty kooky project and exists entirely for learning.
It is essesntially a simulation of a shop, with a database recording
customers, product inventory, orders etc. 

The inital idea was to have a project that showed a lot of database
knowledge, but this seems to be branching out in a few different angles.
For example, the project also addresses
- App factories in Java, Python etc.
- Database toolkits in the same;
- Containerisation;
- Azure

Since each part of the store is managed by a process in a different language, 
the same basic programming constructs are encountered in a variety of styles. 
It's interesting to see how Haskell/Elixir/Python... hande 
- IO;
- Database connectivity;
- Logging;
- Statistics;
- Data-faking.

## Components

### Customers
This is a Python project managed with Poetry. Sqlalchemy is used as an ORM to 
interact with the database.

### Products
Scala app managed with Sbt. I avoided the very complicated looking 
Typelevel solutions for DB interaction and went for a basic aproach with java.sql.

### Suppliers
Haskell app managed with cabal. Best fake data library of the lot.

### Orders
Elixir app using fully featured Ecto ORM system. This one is my favourite.


### Employees
TODO in Java...


## Dashboard

A simple dashboard should show any DB interactions as they occur, a list of unshipped 
orders etc.


## Todo
Maybe this is taking it too far, but it would be funny to have some employees pack the wrong
orders and things like that.


