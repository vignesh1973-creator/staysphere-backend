import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  Calendar, MapPin, DollarSign, Clock, RefreshCw, 
  AlertCircle, CheckCircle2, ChevronRight, XOctagon 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../components/ConfirmationModal';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Cancellation Modal States
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/bookings/my-bookings');
      if (response.data && response.data.success) {
        setBookings(response.data.bookings || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bookings.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenCancelModal = (id) => {
    setBookingToCancel(id);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    setCancelLoading(true);
    try {
      const response = await api.delete(`/bookings/${bookingToCancel}`);
      if (response.data && response.data.success) {
        // Optimistically update status to 'Cancelled'
        setBookings(prevBookings => 
          prevBookings.map(b => b._id === bookingToCancel ? { ...b, status: 'Cancelled' } : b)
        );
        setShowCancelModal(false);
        setBookingToCancel(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
      console.error(err);
    } finally {
      setCancelLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Fallbacks for missing listing photos
  const fallbackImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 max-w-7xl mx-auto px-4">
        <RefreshCw className="h-10 w-10 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-400 text-sm">Fetching your booking logs...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">My Booking History</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Review all your current and past accommodation reservations.</p>
      </div>

      {error ? (
        <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-center py-10 max-w-md mx-auto my-10">
          <p className="font-semibold mb-2">{error}</p>
          <button onClick={fetchBookings} className="btn-secondary text-xs mx-auto py-1.5 mt-4">
            Try Again
          </button>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-panel text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Calendar className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-slate-900 dark:text-white text-lg font-bold">No reservations found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm mt-2 leading-relaxed font-normal">
            You haven't booked any accommodation yet. Start exploring properties to make your first stay reservation!
          </p>
          <Link to="/" className="btn-primary text-xs mx-auto py-2.5 px-5 rounded-xl mt-6 inline-flex">
            Browse Accommodations
          </Link>
        </div>
      ) : (
        /* Bookings List */
        <div className="space-y-6">
          {bookings.map((booking) => {
            const { _id, checkIn, checkOut, numberOfDays, totalPrice, status, listingId } = booking;
            
            // Check if listingId populated correctly (it might be null if the listing was deleted)
            if (!listingId) {
              return (
                <div key={_id} className="glass-panel p-5 rounded-2xl border border-slate-200 dark:border-slate-800 opacity-60 flex justify-between items-center text-xs text-slate-600 dark:text-slate-400">
                  <span>Booking ID: {_id} - Accommodation details unavailable (Property has been removed by the host).</span>
                  <span className="font-bold">Total Cost: ₹{totalPrice}</span>
                </div>
              );
            }

            const img = (listingId.images && listingId.images.length > 0) ? listingId.images[0] : fallbackImage;
            const isBooked = status === 'Booked';

            return (
              <div 
                key={_id}
                className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-md flex flex-col md:flex-row"
              >
                {/* Property Image Column */}
                <div className="md:w-64 h-48 md:h-auto bg-slate-100 dark:bg-slate-900 relative shrink-0">
                  <img src={img} alt={listingId.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    {isBooked ? (
                      <span className="bg-emerald-500/90 text-white font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-400/20 shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="bg-red-500/90 text-white font-bold text-xs px-2.5 py-1 rounded-full border border-red-400/20 shadow-sm flex items-center gap-1">
                        <XOctagon className="h-3 w-3" />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Booking details info */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: Property details */}
                    <div className="md:col-span-2 space-y-2">
                      <h3 className="text-slate-900 dark:text-white font-bold text-lg hover:text-brand-600 dark:hover:text-brand-300 transition-colors">
                        <Link to={`/listings/${listingId._id}`}>{listingId.title}</Link>
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 text-xs flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                        <span>{listingId.location}</span>
                      </p>
                      
                      {/* Stay dates */}
                      <div className="flex gap-4 pt-3 text-xs">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Check In</p>
                          <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{formatDate(checkIn)}</p>
                        </div>
                        <div className="border-l border-slate-200 dark:border-slate-800 pl-4">
                          <p className="text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Check Out</p>
                          <p className="text-slate-800 dark:text-slate-200 font-medium mt-0.5">{formatDate(checkOut)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Booking summaries */}
                    <div className="glass-panel p-4 rounded-xl border border-slate-200 dark:border-slate-850 flex flex-col justify-center space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          Duration:
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">{numberOfDays} night{numberOfDays > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                          Rate:
                        </span>
                        <span className="text-slate-700 dark:text-slate-300 font-semibold">₹{listingId.price}/night</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-800 pt-2 text-xs font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">Total Price:</span>
                        <span className="text-brand-600 dark:text-brand-300 text-sm font-extrabold">₹{totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions row */}
                  <div className="flex justify-between items-center pt-5 border-t border-slate-200 dark:border-slate-850 mt-6 md:mt-0">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Booking ID: {_id}</span>
                    
                    {isBooked && (
                      <button
                        onClick={() => handleOpenCancelModal(_id)}
                        disabled={actionLoading}
                        className="btn-danger text-xs py-1.5 px-4 rounded-lg flex items-center gap-1"
                      >
                        <XOctagon className="h-3.5 w-3.5" />
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setBookingToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
        title="Cancel Stay Reservation"
        message="Are you sure you want to cancel this booking? This action is permanent and cannot be undone."
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        loading={cancelLoading}
        type="danger"
      />
    </div>
  );
};

export default Bookings;
