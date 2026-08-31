import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";
import AuthView from "./pages/Auth/AuthView";
import FavouritesView from "./pages/Favourites/FavouritesView";
import HomeView from "./pages/Home/HomeView";
import useHomeViewModel from "./pages/Home/useHomeViewModel";

function App() {
  const { user, authLoading } = useAuth();
  const {
    query,
    setQuery,
    movies,
    loading,
    error,
    handleSearch,
    reloadInitialMovies,
    handleFavourite,
  } = useHomeViewModel();

  const authLoadingView = (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center text-neutral-300">
      Loading authentication...
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <Header
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        onHomeClick={reloadInitialMovies}
      />
      <Routes>
        <Route
          path="/"
          element={
            <HomeView
              movies={movies}
              loading={loading}
              error={error}
              onFavourite={handleFavourite}
            />
          }
        />
        <Route
          path="/auth"
          element={
            authLoading ? (
              authLoadingView
            ) : user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthView />
            )
          }
        />
        <Route
          path="/favourites"
          element={
            authLoading ? (
              authLoadingView
            ) : user ? (
              <FavouritesView />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
