import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { 
  MapPin, User, Calendar, Tag, CreditCard, Clock, 
  ArrowLeft, RefreshCw, AlertCircle, Sparkles, CheckCircle2
} from 'lucide-react';

const ListingDetail = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Booking Form State
  const [checkIn, setCheckIn] = useState('');
  const [numberOfDays, setNumberOfDays] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const fetchListing = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/listings/${id}`);
      if (response.data && response.data.success) {
        setListing(response.data.listing);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load property details.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess(false);

    if (!isAuthenticated) {
      navigate(`/auth?mode=login&redirect=/listings/${id}`);
      return;
    }

    if (!checkIn) {
      setBookingError('Please select a check-in date.');
      return;
    }

    if (numberOfDays < 1) {
      setBookingError('Stay must be at least 1 day.');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await api.post('/bookings', {
        listingId: id,
        checkIn,
        numberOfDays: Number(numberOfDays),
      });

      if (response.data && response.data.success) {
        setBookingSuccess(true);
        setCheckIn('');
        setNumberOfDays(1);
      }
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Failed to create booking.');
      console.error(err);
    } finally {
      setBookingLoading(false);
    }
  };

  // Helper: calculate checkout date
  const getCheckOutDateString = () => {
    if (!checkIn || numberOfDays < 1) return '';
    const date = new Date(checkIn);
    date.setDate(date.getDate() + Number(numberOfDays));
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  // Curated list of high-quality images from Unsplash
  const fallbacks = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 max-w-7xl mx-auto px-4">
        <RefreshCw className="h-10 w-10 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Loading property details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto my-20 p-6 glass-panel border border-red-200 dark:border-red-500/20 text-center rounded-2xl">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-slate-900 dark:text-white text-lg font-bold">Error Loading Stay</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-2">{error || 'Listing not found.'}</p>
        <Link to="/" className="btn-primary mt-6 text-xs mx-auto py-2 px-4 rounded-lg inline-flex">
          Return Home
        </Link>
      </div>
    );
  }

  // Get index based on id hash, or use first image
  const displayImage = (listing.images && listing.images.length > 0 && listing.images[0])
    ? listing.images[0]
    : fallbacks[Math.abs(listing._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % fallbacks.length];

  const totalPrice = listing.price * numberOfDays;
  const isOwnListing = user?._id === listing.hostId?._id;
  const todayString = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-805 dark:text-slate-400 dark:hover:text-white transition-colors text-sm font-medium mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Listing Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Banner */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <img 
              src={displayImage} 
              alt={listing.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-flex items-center gap-1 bg-brand-600 px-3 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-3 w-3" />
                Featured Property
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight">
                {listing.title}
              </h1>
            </div>
          </div>

          {/* Location & Host */}
          <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 flex flex-wrap gap-4 sm:gap-6 justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-brand-500/10 text-brand-600 dark:text-brand-400 p-2.5 rounded-xl border border-brand-500/20">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Location</p>
                <p className="text-slate-900 dark:text-white text-sm font-medium">{listing.location || 'Not Specified'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-brand-500/10 text-brand-600 dark:text-brand-400 p-2.5 rounded-xl border border-brand-500/20">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Property Host</p>
                <p className="text-slate-900 dark:text-white text-sm font-medium">{listing.hostId?.email || 'Individual Host'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-brand-500/10 text-brand-600 dark:text-brand-400 p-2.5 rounded-xl border border-brand-500/20">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Price Per Night</p>
                <p className="text-brand-600 dark:text-brand-300 text-sm font-bold">₹{listing.price}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-4">
            <h2 className="text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-slate-800/60 pb-3">About this accommodation</h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>
        </div>

        {/* Booking Card sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative overflow-hidden">
            
            {/* Glow badge */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4 flex items-center gap-1.5">
              <CreditCard className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              Book Your Stay
            </h3>

            {/* Booking alerts */}
            {isOwnListing && (
              <div className="mb-5 p-3.5 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-500/20 rounded-xl text-yellow-700 dark:text-yellow-400 text-xs flex items-start gap-2 leading-relaxed">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>You are the host of this property. Booking is restricted on your own listings.</span>
              </div>
            )}

            {bookingSuccess && (
              <div className="mb-5 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-medium flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Stay Booked Successfully!</span>
                </div>
                <p className="text-xs text-slate-655 text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  Your reservation is confirmed. You can manage your stays in the bookings section.
                </p>
                <Link to="/bookings" className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold underline mt-1">
                  View My Bookings &rarr;
                </Link>
              </div>
            )}

            {bookingError && (
              <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-955/40 bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-xl text-red-655 text-red-600 dark:text-red-400 text-xs flex items-start gap-2 leading-relaxed">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{bookingError}</span>
              </div>
            )}

            {/* Price nightly badge */}
            <div className="flex justify-between items-baseline mb-6 border-b border-slate-205 dark:border-slate-800 pb-4">
              <span className="text-slate-500 dark:text-slate-400 text-sm">Price per night:</span>
              <span className="text-slate-900 dark:text-white text-2xl font-black">₹{listing.price}</span>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                  Check-in Date
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-405 dark:text-slate-500">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <input
                    type="date"
                    min={todayString}
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    onClick={(e) => {
                      try {
                        e.target.showPicker();
                      } catch (err) {
                        console.error('showPicker not supported', err);
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500 cursor-pointer"
                    disabled={isOwnListing || bookingSuccess}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                  Duration (Nights)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-405 dark:text-slate-500">
                    <Clock className="h-4 w-4" />
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={numberOfDays}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setNumberOfDays('');
                      } else {
                        setNumberOfDays(parseInt(val) || '');
                      }
                    }}
                    onBlur={() => {
                      if (!numberOfDays || numberOfDays < 1) {
                        setNumberOfDays(1);
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                    disabled={isOwnListing || bookingSuccess}
                    required
                  />
                </div>
              </div>

              {/* Computed parameters */}
              {checkIn && numberOfDays > 0 && (
                <div className="p-4 bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Check-out Date:</span>
                    <span className="text-slate-700 dark:text-slate-300 font-semibold">{getCheckOutDateString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 dark:border-slate-900 pt-2 font-medium">
                    <span className="text-slate-500 dark:text-slate-400">Total stays cost:</span>
                    <span className="text-brand-600 dark:text-brand-300 font-bold text-sm">₹{totalPrice}</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="submit"
                disabled={isOwnListing || bookingLoading || bookingSuccess}
                className="w-full btn-primary py-3 rounded-xl shadow-lg mt-6"
              >
                {bookingLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Booking Accommodation...</span>
                  </>
                ) : !isAuthenticated ? (
                  'Login to Book'
                ) : isOwnListing ? (
                  'Own Listing'
                ) : (
                  `Book Stay (₹${totalPrice})`
                )}
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListingDetail;
