DROP TABLE IF EXISTS books;

CREATE TABLE books (
    id INTEGER PRIMARY KEY NOT NULL,
    title TEXT,
    author TEXT,
    kind TEXT,
    available TEXT
);