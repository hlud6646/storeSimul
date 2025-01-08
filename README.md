# Fake Store

This project aims to develop/explore
- Database creation and management; 
- Database tookkits (in other languages);
- App factories;
- Database logging.
- Simple web stuff.

For each aspect of a store's database (imagine customers, suppliers, orders, etc) a
different process mimicks creation/fulfilment. Each will be written in a different
language, to explore a range of database connection tools. 

For example, a Java program will periodically create a new customer and write to the
DB. An Elixir program will periodically create suppliers/products and a Python program
will randomly create orders.

A simple dashboard should show any DB interactions as they occur, a list of unshipped 
orders etc. This could be a Hono app.

