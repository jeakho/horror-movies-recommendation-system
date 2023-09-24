export interface MovieTitle {
    id: number;
    title: string
}

export interface MovieInfo extends MovieTitle {
    rating: number | null;
    imageUrl: string;
    cosineSimilarity?: number;
    predictedRating?: number;
}

export interface MovieDetailedInfo extends MovieInfo {
    releaseDate: string;
    countries: string[];
    directors: string[];
    annotation: string;
    genres: string[];
    reviews: string[];
}