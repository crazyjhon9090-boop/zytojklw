import { useState } from 'react';

const LazyYouTube = ({ youtubeId, title }) => {
  const [play, setPlay] = useState(false);

  const thumb = `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  return (
    <div className="video-card">
      {!play ? (
        <div className="video-thumb" onClick={() => setPlay(true)}>
          <img src={thumb} alt={title} loading="lazy" />
          <span className="play-button">▶</span>
        </div>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyYouTube;
