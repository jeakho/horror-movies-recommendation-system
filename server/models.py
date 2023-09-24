import numpy as np
from gensim.models import Doc2Vec
from keras.models import load_model
from sklearn.metrics.pairwise import cosine_similarity
import pickle


class RatingsModel:
    def __init__(self):
        with open('./model_data/encoded_ratings.pkl', 'rb') as f:
            self._movie_ratings = pickle.load(f)

    def get_ratings_by_range(self, left, right):
        if left == 0:
            return self._movie_ratings[:(right + 1)]
        elif right == 0:
            return self._movie_ratings[left:]
        else:
            return self._movie_ratings[left:(right + 1)]

    def get_rating_by_id(self, film_id):
        print(film_id)
        print(self._movie_ratings[0])
        return next(mr for mr in self._movie_ratings if mr['movieId'] == film_id)['ratings']
        # return self.model.predict(list_of_tokenized_reviews, verbose=0)


class MoviesSimilarityModel:
    def __init__(self, pickle_file_path):
        with open(pickle_file_path, 'rb') as f:
            self._movies_annotation = pickle.load(f)

    def most_similar(self, target_movie_id, topn):
        vectorized_annotations = np.array([ma['annotation'] for ma in self._movies_annotation])
        current_vectorized_annotation = next(
            ma['annotation'] for ma in self._movies_annotation if ma['movieId'] == target_movie_id)

        similarities = cosine_similarity([current_vectorized_annotation], vectorized_annotations)[0]

        closest_indices = np.flip(np.argsort(similarities)[-topn:])

        return [(self._movies_annotation[ind]['movieId'], similarities[ind]) for ind in closest_indices]


class TFIDFEncodedMoviesSimilarityModel(MoviesSimilarityModel):
    def __init__(self):
        MoviesSimilarityModel.__init__(self, './model_data/encoded_with_tfidf_encoder.pkl')


class TFIDFEncodedMoviesSimilarityDeepModel(MoviesSimilarityModel):
    def __init__(self):
        MoviesSimilarityModel.__init__(self, './model_data/encoded_with_tfidf_deep_encoder.pkl')


class BOWEncodedMoviesSimilarityModel(MoviesSimilarityModel):
    def __init__(self):
        MoviesSimilarityModel.__init__(self, './model_data/encoded_with_bow_encoder.pkl')


class BOWEncodedMoviesSimilarityDeepModel(MoviesSimilarityModel):
    def __init__(self):
        MoviesSimilarityModel.__init__(self, './model_data/encoded_with_bow_deep_encoder.pkl')


class MoviesSimilarityRAEModel(MoviesSimilarityModel):
    def __init__(self):
        MoviesSimilarityModel.__init__(self, './model_data/encoded_with_rae_encoder.pkl')


class DocToVecModel(MoviesSimilarityModel):
    def __init__(self):
        MoviesSimilarityModel.__init__(self, './model_data/encoded_with_doc2vec_encoder.pkl')
