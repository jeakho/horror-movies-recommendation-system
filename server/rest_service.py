from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from models import TFIDFEncodedMoviesSimilarityModel, TFIDFEncodedMoviesSimilarityDeepModel, \
    BOWEncodedMoviesSimilarityModel, BOWEncodedMoviesSimilarityDeepModel, MoviesSimilarityRAEModel, DocToVecModel, \
    RatingsModel
import database.database_service as db_service
import json
import urllib.parse

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
# app.json_encoder = json.dumps

# A sample list to store data
books = [
    {"id": 1, "title": "Book 1", "author": "Author 1"},
    {"id": 2, "title": "Book 2", "author": "Author 2"}
]

# Initializing models
tfidf_model = TFIDFEncodedMoviesSimilarityModel()
tfidf_deep_model = TFIDFEncodedMoviesSimilarityDeepModel()
bow_model = BOWEncodedMoviesSimilarityModel()
bow_deep_model = BOWEncodedMoviesSimilarityDeepModel()
rae_model = MoviesSimilarityRAEModel()
doc2vec_model = DocToVecModel()

ratings_model = RatingsModel()

movies_similarity_models = [tfidf_model, tfidf_deep_model, bow_model, bow_deep_model, rae_model, doc2vec_model]


# Route to get all movies
@app.route('/movies/<int:target_movie_id>', methods=['GET'])
def get_topn_similar_movies(target_movie_id):
    # Querying request parameters
    topn = request.args.get('topn', None)
    model_type = request.args.get('modelType', None)

    if None not in (topn, model_type):
        # Converting request parameters to numbers
        topn = int(topn)
        model_type = int(model_type)

        if model_type < 0 or model_type >= len(movies_similarity_models):
            return jsonify({'error': 'Unsupported model type!'}), 400

        # Get ids of most similar movies
        similarities = movies_similarity_models[model_type].most_similar(target_movie_id, topn + 1)

        # Get movies by those ids
        movies = db_service.retrieve_movies_by_ids([s[0] for s in similarities])

        # Add cosine similarity coefficient
        for ind, movie in enumerate(movies):
            movie['cosineSimilarity'] = str(similarities[ind][1])

        return jsonify(movies), 200

    else:
        return jsonify({'error': 'Missing required parameters!'}), 400


@app.route('/movies/best', methods=['GET'])
def get_best_movies():
    order = request.args.get('order', None)
    page_num = request.args.get('page_no', None)

    if None not in (order, page_num):
        order = int(order)
        page_num = int(page_num)

        # Define index bounds
        bounds = [order * (page_num - 1) * 10, order * (page_num * 10 - 1)]

        # Get movie ids and ratings from the bounds
        movie_ratings = ratings_model.get_ratings_by_range(min(bounds), max(bounds))

        # Get movies by those ids
        if order == -1:
            movie_ratings.reverse()
        movies = db_service.retrieve_movies_by_ids([m['movieId'] for m in movie_ratings])

        # Add predicted ratings
        for ind, movie in enumerate(movies):
            movie['predictedRating'] = str(movie_ratings[ind]['ratings'])

        return jsonify(movies), 200

    else:
        return jsonify({'error': 'Missing required request parameters!'}), 400


@app.route('/movieDetails/<int:movie_id>', methods=['GET'])
def get_movie_details(movie_id):
    with_predicted_rating = request.args.get('with_predicted_rating', None)

    if with_predicted_rating is not None:
        movie_details = db_service.retrieve_movie_details(movie_id)

        if with_predicted_rating == '1':
            try:
                movie_details['predictedRating'] = str(ratings_model.get_rating_by_id(movie_id))
            except:
                pass

        return jsonify(movie_details), 200

    else:
        return jsonify({'error': 'Missing required request parameters!'}), 400


# Route to get a specific book by ID
@app.route('/movietitles', methods=['GET'])
@app.route('/movietitles/<string:substr>', methods=['GET'])
def get_movie_titles_by_substr(substr=None):
    if substr is None:
        substr = ''

    limit_results = request.args.get('limit', None)
    movie_titles = db_service.retrieve_movie_titles_by_substr(substr, limit_results)

    if len(movie_titles) > 0:
        return jsonify(movie_titles)
    else:
        return jsonify({'error': f"No movies starting with '{substr}' found"}), 404


@app.route('/movietitles/ids/<string:encoded_ids_list>', methods=['GET'])
def get_movie_titles_by_ids(encoded_ids_list):
    try:
        ids_list = json.loads(urllib.parse.unquote(encoded_ids_list))
    except:
        return jsonify({'error': f"Invalid ids format!"}), 400

    try:
        return jsonify(db_service.retrieve_movie_titles_by_ids(ids_list))
    except:
        # return jsonify(ex)
        return jsonify({'error': f"Not all provided movie ids are present in the database!"}), 404


if __name__ == '__main__':
    app.run()
