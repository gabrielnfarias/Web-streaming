import logoDark from './assets/logo-dark.png';
import { ReactComponent as LightMode } from './assets/light-mode.svg';
import { ReactComponent as ArrowLeftDark } from './assets/arrow-left-dark.svg';
import { ReactComponent as ArrowRightDark } from './assets/arrow-right-dark.svg';
import { ReactComponent as Rating } from './assets/rating.svg';
import { ReactComponent as Play } from './assets/play.svg';
import { ReactComponent as CloseDark } from './assets/close-dark.svg';
import './css/global.css';
import './css/style.css';
import { highlightMovie, playMovie, movies } from './services/movies';
import { useState } from 'react';

function App() {
  const [allMovies, setAllMovies] = useState([...movies.results]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [theme, setTheme] = useState('light');
  const [currentPage, setCurrentPage] = useState(0);
  const moviesPerPage = 6;
  const [searchQuery, setSearchQuery] = useState('');

  const currentDate = '2022-10-21';
  new Date(currentDate).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.body.classList.add('dark-theme');
    } else {
      setTheme('light');
      document.body.classList.remove('dark-theme');
    }
  };

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      setCurrentPage(0);
      if (searchQuery.trim() !== '') {
        const filteredMovies = movies.results.filter((movie) =>
          movie.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setAllMovies(filteredMovies);
      } else {
        setAllMovies([...movies.results]);
      }
      setSearchQuery('');
    }
  };
  return (
    <>
      <header className={`header size ${theme === 'dark' ? 'dark-theme' : ''}`}>
        <div className="header__container-logo">
          <img src={logoDark} alt="Logo" />
          <h1 className="header__title">CUBOS FLIX</h1>
        </div>
        <div className="header__container-right">
          <input
            className="input"
            type="text"
            placeholder="Pesquisar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <LightMode className="btn-theme" onClick={toggleTheme} />
        </div>
      </header>
      <div className="container size">
        <div className="movies-container">
          <ArrowLeftDark
            className="btn-prev"
            onClick={() => {
              const newPage =
                currentPage === 0
                  ? Math.ceil(allMovies.length / moviesPerPage) - 1
                  : currentPage - 1;
              setCurrentPage(newPage);
            }}
          />
          <div className="movies">
            {allMovies
              .slice(currentPage * moviesPerPage, (currentPage + 1) * moviesPerPage)
              .map((movie) => (
                <div
                  key={movie.id}
                  className="movie"
                  style={{ backgroundImage: `url(${movie.poster_path})` }}
                  onClick={() => {
                    setSelectedMovie(movie);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="movie__info">
                    <span className="movie__title" title={movie.title}>
                      {movie.title}
                    </span>
                    <span className="movie__rating">
                      <span>{movie.rating}</span>
                      <Rating />
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <ArrowRightDark
            className="btn-next"
            onClick={() => {
              const newPage =
                (currentPage + 1) % Math.ceil(allMovies.length / moviesPerPage);
              setCurrentPage(newPage);
            }}
          />
        </div>
        <div className={`highlight-container ${theme === 'dark' ? 'dark-theme' : ''}`}>
          <div className="highlight size">
            <a
              className="highlight__video-link"
              key={playMovie.key}
              href="#"
              target="_blank"
            >
              <div
                className="highlight__video"
                style={{
                  backgroundImage: `url(${highlightMovie.backdrop_path})`,
                  backgroundSize: 'cover'
                }}
              >
                <Play />
              </div>
            </a>
            <div className="highlight__info">
              <div className="highlight__title-rating">
                <h1 className="highlight__title">{highlightMovie.title}</h1>
                <span className="highlight__rating">{highlightMovie.vote_average}</span>
              </div>
              <div className="highlight__genre-launch">
                <span className="highlight__genres">
                  {highlightMovie.genres.map((genre) => genre.name).join(', ')}
                </span>
                <span className="highlight__launch">{currentDate}</span>
              </div>
              <p className="highlight__description">{highlightMovie.overview}</p>
            </div>
          </div>
        </div>
        {selectedMovie && (
          <div className={`modal ${isModalOpen ? '' : 'hidden'}`}>
            <div className="modal__body">
              <CloseDark className="modal__close" onClick={closeModal} />
              <h3 className="modal__title">{selectedMovie.title}</h3>
              <img
                className="modal__img"
                alt="modal__img"
                src={selectedMovie.backdrop_path}
              />
              <p className="modal__description">{selectedMovie.overview}</p>
              <div className="modal__genre-average">
                <div className="modal__genres">
                  <span className="modal__genre">Gênero1</span>
                  <span className="modal__genre">Gênero2</span>
                  <span className="modal__genre">Gênero3</span>
                </div>
                <div className="modal__average">{selectedMovie.vote_average}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
