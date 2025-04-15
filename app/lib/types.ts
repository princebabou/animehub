export interface Anime {
  mal_id: number;
  title: string;
  title_english: string;
  title_japanese: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  trailer: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  synopsis: string;
  genres: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
  studios: Array<{
    mal_id: number;
    type: string;
    name: string;
  }>;
}

export interface AnimeResponse {
  pagination: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
  data: Anime[];
}

export type Genre = {
  mal_id: number;
  name: string;
  count: number;
};

export interface GenreResponse {
  data: Genre[];
}

export type Season = "winter" | "spring" | "summer" | "fall";

export type AnimeType = "tv" | "movie" | "ova" | "special" | "ona" | "music";

export type AnimeStatus = "airing" | "complete" | "upcoming";

export type AnimeSort = "popularity" | "score" | "favorites" | "rank";
