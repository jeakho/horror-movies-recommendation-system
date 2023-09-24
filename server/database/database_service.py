import json
import sqlite3
import database.operations as operations
import database.queries as queries

connection = None

def establish_connection():
    global connection
    connection = sqlite3.connect('D:/Diploma/horror-movie-recommendation-system/server/db/horror-movies-data.db', check_same_thread=False)


def retrieve_movie_titles_by_substr(substr, limit_results=10):
    if connection is None:
        establish_connection()
    if connection is None:
        raise Exception('Failed to establish connection!')

    res = operations.select(connection, queries.select_movie_titles_by_substr(), [substr + '%', limit_results])
    return [json.loads(movie_title[0]) for movie_title in res]


def retrieve_movie_titles_by_ids(ids):
    if connection is None:
        establish_connection()
    if connection is None:
        raise Exception('Failed to establish connection!')

    res = operations.select(connection, queries.select_movie_titles_by_ids(len(ids)), ids)
    movie_titles = [json.loads(mt[0]) for mt in res]

    ordered_movies_titles = []
    for id in ids:
        ordered_movies_titles.append(next(mt for mt in movie_titles if mt['id'] == id))

    return ordered_movies_titles


def retrieve_movies_by_ids(ids):
    if connection is None:
        establish_connection()
    if connection is None:
        raise Exception('Failed to establish connection!')

    res = operations.select(connection, queries.select_movies(len(ids)), ids)
    movies = [json.loads(movie[0]) for movie in res]

    ordered_movies = []
    for id in ids:
        ordered_movies.append(next(movie for movie in movies if movie['id'] == id))

    return ordered_movies


def retrieve_movie_details(movie_id):
    if connection is None:
        establish_connection()
    if connection is None:
        raise Exception('Failed to establish connection!')

    res = operations.select(connection, queries.select_movie_details(), [movie_id])
    return json.loads(res[0][0])


def retrieve_movies_type_1(site_id=0):
    if connection is None:
        establish_connection()

    if connection is None:
        raise Exception('Failed to establish connection!')

    return [json.loads(movie[0]) for movie in operations.select(connection, queries.select_movies_type_1(site_id))]


def retrieve_annotations(site_id=0):
    if connection is None:
        establish_connection()

    if connection is None:
        raise Exception('Failed to establish connection!')

    return [json.loads(annotation[0]) for annotation in operations.select(connection, queries.select_annotations(site_id))]