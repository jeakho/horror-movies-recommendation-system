import sqlite3


def create_connection(db_file_path):
    conn = None
    try:
        conn = sqlite3.connect(db_file_path)
    except sqlite3.Error as e:
        print(e)

    return conn


def select(connection, sql_string, params = None):
    if params is None:
        params = []

    if connection is None:
        print('Connection has not been established!')
        return

    cursor = connection.cursor()
    cursor.execute(sql_string, params)

    return cursor.fetchall()

