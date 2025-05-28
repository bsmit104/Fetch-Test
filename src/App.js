/* global React, ReactDOM, axios, Login, DogCard, ErrorBoundary */

const { useState, useEffect, useCallback } = React;
const API_BASE = 'https://frontend-take-home-service.fetch.com';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBreed, setSelectedBreed] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [sortOrder, setSortOrder] = useState('breed:asc');
  const [dogs, setDogs] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get(`${API_BASE}/dogs/breeds`, { withCredentials: true });
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchBreeds = async () => {
      const response = await axios.get(`${API_BASE}/dogs/breeds`, { withCredentials: true });
      setBreeds(response.data);
    };
    if (isAuthenticated) fetchBreeds();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchDogs = async () => {
      const params = {
        breeds: selectedBreed || searchQuery ? [selectedBreed || searchQuery] : undefined,
        zipCodes: zipCode ? [zipCode] : undefined,
        ageMin: ageMin ? parseInt(ageMin) : undefined,
        ageMax: ageMax ? parseInt(ageMax) : undefined,
        size: 10,
        from: page * 10,
        sort: sortOrder,
      };
      const response = await axios.get(`${API_BASE}/dogs/search`, {
        params,
        withCredentials: true,
      });
      const { resultIds, total, next, prev } = response.data;
      setTotal(total);
      setNext(next);
      setPrev(prev);

      const dogResponse = await axios.post(`${API_BASE}/dogs`, resultIds, { withCredentials: true });
      setDogs(dogResponse.data);
    };
    if (isAuthenticated) fetchDogs();
  }, [isAuthenticated, selectedBreed, searchQuery, zipCode, ageMin, ageMax, sortOrder, page]);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(async () => {
    await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
    setIsAuthenticated(false);
    setFavorites([]);
    setMatch(null);
    localStorage.removeItem('favorites');
  }, []);

  const toggleFavorite = useCallback((dogId) => {
    setFavorites((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  }, []);

  const generateMatch = useCallback(async () => {
    if (favorites.length === 0) {
      alert('Please add at least one dog to favorites before matching.');
      return;
    }
    if (!window.confirm('Generate a match from your favorite dogs?')) {
      return;
    }
    const response = await axios.post(`${API_BASE}/dogs/match`, favorites, { withCredentials: true });
    const matchId = response.data.match;
    const dogResponse = await axios.post(`${API_BASE}/dogs`, [matchId], { withCredentials: true });
    setMatch(dogResponse.data[0]);
  }, [favorites]);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-50">
      <nav className="fixed top-0 left-0 w-full bg-teal-600 text-white shadow-md z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Dog Adoption</h1>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-teal-200 transition">About</a>
            <a href="#" className="hover:text-teal-200 transition">Contact</a>
            <button
              onClick={handleLogout}
              className="bg-gray-600 text-white px-4 py-1 rounded-lg hover:bg-gray-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-6 pt-16">
        <h1 className="text-3xl font-semibold text-teal-700 mb-6">Find Your Furry Friend</h1>
        <div className="flex items-center gap-4 mb-6 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-800 mb-1">Search Breeds</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedBreed('');
                setPage(0);
              }}
              placeholder="Enter breed name..."
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-800 mb-1">Filter Breed</label>
            <select
              value={selectedBreed}
              onChange={(e) => {
                setSelectedBreed(e.target.value);
                setSearchQuery('');
                setPage(0);
              }}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Breeds</option>
              {breeds.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-800 mb-1">Zip Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => {
                setZipCode(e.target.value);
                setPage(0);
              }}
              placeholder="Enter zip code..."
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-800 mb-1">Min Age</label>
            <select
              value={ageMin}
              onChange={(e) => {
                setAgeMin(e.target.value);
                setPage(0);
              }}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Any</option>
              {[...Array(21).keys()].map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-800 mb-1">Max Age</label>
            <select
              value={ageMax}
              onChange={(e) => {
                setAgeMax(e.target.value);
                setPage(0);
              }}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Any</option>
              {[...Array(21).keys()].map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-800 mb-1">Sort By</label>
            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(0);
              }}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="breed:asc">Breed (A-Z)</option>
              <option value="breed:desc">Breed (Z-A)</option>
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
              <option value="age:asc">Age (Young to Old)</option>
              <option value="age:desc">Age (Old to Young)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-6">
          {dogs.map((dog) => (
            <DogCard
              key={dog.id}
              dog={dog}
              onFavorite={toggleFavorite}
              isFavorite={favorites.includes(dog.id)}
            />
          ))}
        </div>
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={!prev}
            className="px-6 py-2 bg-teal-500 text-white rounded-lg disabled:bg-gray-200 hover:bg-teal-600 transition"
          >
            Previous
          </button>
          <span className="text-gray-600">Page {page + 1}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!next}
            className="px-6 py-2 bg-teal-500 text-white rounded-md disabled:bg-gray-200 hover:bg-teal-600 transition"
          >
            Next
          </button>
        </div>
        <div className="bg-white p-8 border border-teal-200 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-teal-700 mb-4">Your Favorites</h2>
          <p className="text-gray-700 mb-4">{favorites.length} dogs in your favorites</p>
          <button
            onClick={generateMatch}
            className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600 transition disabled:bg-gray-200"
          >
            Get Matched
          </button>
          {match && (
            <div className="mt-6">
              <h3 className="text-xl font-medium text-teal-700 mb-4">Your Perfect Match!</h3>
              <DogCard
                dog={match}
                onFavorite={toggleFavorite}
                isFavorite={favorites.includes(match.id)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);