import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/api';
import ListingCard from '../components/ListingCard';
import { Search, MapPin, DollarSign, RefreshCw, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize filter state from search params
  const [locationInput, setLocationInput] = useState(searchParams.get('location') || '');
  const [minPriceInput, setMinPriceInput] = useState(searchParams.get('minprice') || '');
  const [maxPriceInput, setMaxPriceInput] = useState(searchParams.get('maxprice') || '');
  
  const [listings, setListings] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [totalItems, setTotalItems] = useState(0);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      const loc = searchParams.get('location');
      const minP = searchParams.get('minprice');
      const maxP = searchParams.get('maxprice');
      const pg = searchParams.get('page') || 1;

      if (loc) params.location = loc;
      if (minP) params.minprice = minP;
      if (maxP) params.maxprice = maxP;
      params.page = pg;
      params.limit = 8; // 8 items per page for ideal grid

      const response = await api.get('/listings', { params });
      if (response.data && response.data.success) {
        setListings(response.data.listings || []);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(response.data.currentPage || 1);
        setTotalItems(response.data.totalItems || 0);
      }
    } catch (err) {
      setError('Failed to load listings. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = {};
    if (locationInput) newParams.location = locationInput;
    if (minPriceInput) newParams.minprice = minPriceInput;
    if (maxPriceInput) newParams.maxprice = maxPriceInput;
    newParams.page = 1; // Reset to page 1 on new search
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setLocationInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
  };

  const handlePageChange = (pageNumber) => {
    const currentParams = Object.fromEntries(searchParams);
    currentParams.page = pageNumber;
    setSearchParams(currentParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 py-10 relative overflow-hidden rounded-3xl bg-white/80 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-2xl shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-600/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4 leading-tight relative">
          Find Your Perfect <br className="sm:hidden" />
          <span className="bg-gradient-to-r from-brand-600 dark:from-brand-400 via-violet-500 dark:via-violet-400 to-indigo-500 dark:to-indigo-300 bg-clip-text text-transparent font-black">
            Sphere of Comfort
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-sm sm:text-base leading-relaxed mb-8 relative">
          Discover handpicked accommodations, contact hosts directly, and complete your bookings securely. Your next adventure starts here.
        </p>

        {/* Search Bar Form */}
        <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="glass-panel p-2 sm:p-3 rounded-2xl sm:rounded-full border border-slate-200 dark:border-slate-700/80 shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            
            {/* Location Input */}
            <div className="flex-1 flex items-center gap-2 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
              <MapPin className="h-5 w-5 text-brand-500 dark:text-brand-400 shrink-0" />
              <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="Where are you going?"
                className="w-full bg-transparent text-slate-800 dark:text-white border-none focus:ring-0 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500 text-sm"
              />
            </div>

            {/* Price Toggle & Search */}
            <div className="flex items-center gap-2 shrink-0 sm:pl-2">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2.5 rounded-xl border transition-all ${
                  showFilters || minPriceInput || maxPriceInput 
                    ? 'border-brand-500/50 bg-brand-500/10 dark:bg-brand-950/30 text-brand-600 dark:text-brand-300' 
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Filters"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>

              <button type="submit" className="btn-primary w-full sm:w-auto sm:px-6 py-2.5 rounded-xl sm:rounded-full text-sm">
                <Search className="h-4.5 w-4.5" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Expandable Price Filters */}
          {showFilters && (
            <div className="glass-panel mt-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 text-left animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="text-slate-800 dark:text-white text-xs font-semibold uppercase tracking-wider mb-4">Filter by Price per Night</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs mb-1.5 ml-1">Minimum Price (₹)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <input
                      type="number"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 text-xs mb-1.5 ml-1">Maximum Price (₹)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                      <DollarSign className="h-4 w-4" />
                    </span>
                    <input
                      type="number"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      placeholder="e.g. 10000"
                      className="w-full bg-white dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-xl py-2 pl-9 pr-4 text-slate-800 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white px-3 py-1.5 transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-1.5 px-4 rounded-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Main Content Area */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-sans">Available Accommodations</h2>
            <p className="text-slate-500 text-sm mt-1">
              {totalItems > 0 ? `Showing ${listings.length} of ${totalItems} properties` : 'No stays found'}
            </p>
          </div>

          {(searchParams.get('location') || searchParams.get('minprice') || searchParams.get('maxprice')) && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 flex items-center gap-1.5 border border-brand-500/20 px-3 py-1.5 rounded-lg bg-brand-500/5 hover:bg-brand-500/10 transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              Reset Search Filters
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RefreshCw className="h-10 w-10 text-brand-500 animate-spin mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">Searching the sphere for matching stays...</p>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-950/20 border border-red-500/20 text-red-400 rounded-2xl text-center py-10 max-w-md mx-auto my-10">
            <p className="font-semibold mb-2">{error}</p>
            <button onClick={fetchListings} className="btn-secondary text-xs mx-auto py-1.5 mt-4">
              Try Again
            </button>
          </div>
        ) : listings.length === 0 ? (
          <div className="glass-panel text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-800">
            <SlidersHorizontal className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">No results found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm mt-2 leading-relaxed">
              We couldn't find any stays matching your filters. Try widening your search or altering price ranges.
            </p>
            <button onClick={handleClearFilters} className="btn-primary text-xs mx-auto py-2 px-4 rounded-lg mt-6">
              View All Listings
            </button>
          </div>
        ) : (
          <>
            {/* Listing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <div key={listing._id} className="animate-in fade-in duration-500">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2.5 mt-12 pt-8 border-t border-slate-200 dark:border-slate-850">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pg = i + 1;
                  return (
                    <button
                      key={pg}
                      onClick={() => handlePageChange(pg)}
                      className={`h-10 w-10 text-sm font-semibold rounded-xl transition-all ${
                        currentPage === pg
                          ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/25'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
