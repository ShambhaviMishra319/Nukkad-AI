# Nukkad-AI

>>created database> added some tables

>>created app.py and nlp_parser in ai services that takes a text like "sold 20 oranges" it parses it

>>connect node.js backend to it ,so that When a vendor logs "Sold 10 bananas and 5 apples" ->
-> your backend calls the AI -> gets structured data -> saves it in PostgreSQL
    >accept request in express
    >call the AI service /parse-log
    >parsr the response ("sold 20 oranges")
    >store each item in sales_logs table in postgres