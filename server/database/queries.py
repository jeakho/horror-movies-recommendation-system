def select_movie_titles_by_substr():
    return f"""
        SELECT json_object('id', filmid, 'title', title)
        FROM movies
        WHERE resourceid = 2 AND title LIKE ?
        LIMIT ?
    """


def select_movie_titles_by_ids(ids_len):
    return f"""
        SELECT json_object('id', filmid, 'title', title)
        FROM movies
        WHERE resourceid = 2 AND filmid IN ({ ', '.join(['?'] * ids_len) })
    """

def select_movies(movies_len):
    return f"""
        SELECT json_object('id', filmid, 'title', title, 'rating', rating, 'imageUrl', image_uri)
        FROM movies
        WHERE filmid = { ' or filmid = '.join(['?'] * movies_len) }
    """


def select_movie_details():
    return f"""
        SELECT json_object(
            'id', m.filmid,
            'title', m.title,
            'rating', m.rating,
            'imageUrl', m.image_uri,
            'releaseDate', m.release_date,
            'countries', json(m.countries),
            'directors', json(m.directors),
            'annotation', m.annotation,
            'genres', json(m.genres),
            'reviews', 
                CASE WHEN COUNT(r.filmid) > 0
                    THEN json_group_array(r.review)
                    ELSE json_array()
                END
        )
        FROM movies m
        LEFT JOIN reviews r ON m.filmid = r.filmid
        WHERE m.filmid = ?
        GROUP BY m.filmid
    """


def select_movies_type_1(site_id=0):
    return f"""
        SELECT json_object('movieId', m.filmid, 'rating', m.rating, 'reviews', json_group_array(r.reference))
        FROM movies m
        INNER JOIN 'references' r on m.filmid = r.filmid
        WHERE { "" if site_id == 0 else "m.resourceid = " + str(site_id) + " AND" } m.rating IS NOT NULL
        GROUP BY r.filmid
    """


def select_annotations(site_id=0):
    return f"""
        SELECT json_object('movieId', filmid, 'annotation', annotation)
        FROM movies m
        { "" if site_id == 0 else "WHERE m.resourceid = " + str(site_id) }
    """