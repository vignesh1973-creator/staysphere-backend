import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  LayoutDashboard, Plus, Edit, Trash2, Calendar, FileText, 
  MapPin, Tag, RefreshCw, Sparkles, User, HelpCircle, 
  TrendingUp, CheckCircle2, XOctagon, BookOpen, AlertCircle
} from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const HostDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not a host
  useEffect(() => {
    if (!loading && (!user || !user.isHost)) {
      navigate('/profile');
    }
  }, [user, loading, navigate]);

  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'bookings'
  
  // Listings States
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState('');
  
  // Bookings States
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');

  // Modal / Form States
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formPrice, setFormPrice] = useState(500);
  const [formImages, setFormImages] = useState('');
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Listing Specific Bookings details
  const [selectedListingDetail, setSelectedListingDetail] = useState(null);
  const [showListingBookingsModal, setShowListingBookingsModal] = useState(false);

  // Deletion States
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchHostListings = async () => {
    setListingsLoading(true);
    setListingsError('');
    try {
      const response = await api.get('/listings/host/my-listings');
      if (response.data && response.data.success) {
        setListings(response.data.listings || []);
      }
    } catch (err) {
      setListingsError(err.response?.data?.message || 'Failed to fetch your listings.');
      console.error(err);
    } finally {
      setListingsLoading(false);
    }
  };

  const fetchHostBookings = async () => {
    setBookingsLoading(true);
    setBookingsError('');
    try {
      const response = await api.get('/bookings/host/my-bookings');
      if (response.data && response.data.success) {
        setBookings(response.data.bookings || []);
      }
    } catch (err) {
      setBookingsError(err.response?.data?.message || 'Failed to fetch host bookings.');
      console.error(err);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isHost) {
      fetchHostListings();
      fetchHostBookings();
    }
  }, [user]);

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setCurrentListingId(null);
    setFormTitle('');
    setFormDescription('');
    setFormLocation('');
    setFormPrice(500);
    setFormImages('');
    setFormError('');
    setFormSuccess(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (listing) => {
    setIsEditing(true);
    setCurrentListingId(listing._id);
    setFormTitle(listing.title);
    setFormDescription(listing.description);
    setFormLocation(listing.location);
    setFormPrice(listing.price);
    // Since images can be an array, but Joi validator expects a string, join them
    setFormImages(listing.images && listing.images.length > 0 ? listing.images[0] : '');
    setFormError('');
    setFormSuccess(false);
    setShowModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess(false);

    // Form Client validations
    if (!formTitle || !formDescription || !formLocation || !formPrice) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (formPrice < 100 || formPrice > 9999) {
      setFormError('Nightly price must be between ₹100 and ₹9,999 due to system limits.');
      return;
    }

    const payload = {
      title: formTitle,
      description: formDescription,
      location: formLocation,
      price: Number(formPrice),
      images: formImages || undefined
    };

    try {
      if (isEditing) {
        const response = await api.put(`/listings/${currentListingId}`, payload);
        if (response.data && response.data.success) {
          setFormSuccess(true);
          fetchHostListings();
          setTimeout(() => setShowModal(false), 1500);
        }
      } else {
        const response = await api.post('/listings', payload);
        if (response.data && response.data.success) {
          setFormSuccess(true);
          fetchHostListings();
          setTimeout(() => setShowModal(false), 1500);
        }
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit listing.');
      console.error(err);
    }
  };

  const handleOpenDeleteModal = (id) => {
    setListingToDelete(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!listingToDelete) return;
    setDeleteLoading(true);
    try {
      const response = await api.delete(`/listings/${listingToDelete}`);
      if (response.data && response.data.success) {
        setListings(prev => prev.filter(item => item._id !== listingToDelete));
        setShowDeleteModal(false);
        setListingToDelete(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing.');
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleViewListingBookings = async (listingId) => {
    try {
      const response = await api.get(`/bookings/host/listing/${listingId}`);
      if (response.data && response.data.success) {
        setSelectedListingDetail(response.data);
        setShowListingBookingsModal(true);
      }
    } catch (err) {
      alert('Failed to fetch details for this listing.');
      console.error(err);
    }
  };

  // Helper calculations
  const totalEarnings = bookings
    .filter(b => b.status === 'Booked')
    .reduce((acc, curr) => acc + curr.totalPrice, 0);

  const activeBookingsCount = bookings.filter(b => b.status === 'Booked').length;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Predefined template placeholder images
  const defaultImage = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <LayoutDashboard className="h-7 w-7 text-brand-500" />
            Host Console
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage listings and view earnings for stays spheres.</p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="btn-primary text-sm py-2.5"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Listing</span>
        </button>
      </div>

      {/* Stats Counter Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Listings</p>
            <p className="text-slate-900 dark:text-white text-3xl font-extrabold mt-1">{listings.length}</p>
          </div>
          <div className="bg-brand-500/10 text-brand-600 dark:text-brand-400 p-3 rounded-xl border border-brand-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Active Bookings</p>
            <p className="text-slate-900 dark:text-white text-3xl font-extrabold mt-1">{activeBookingsCount}</p>
          </div>
          <div className="bg-brand-500/10 text-brand-600 dark:text-brand-400 p-3 rounded-xl border border-brand-500/20">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Earnings</p>
            <p className="text-emerald-600 dark:text-emerald-400 text-3xl font-extrabold mt-1">₹{totalEarnings}</p>
          </div>
          <div className="bg-emerald-500/10 text-emerald-655 text-emerald-600 dark:text-emerald-400 p-3 rounded-xl border border-emerald-500/20">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 mb-6">
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'listings'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-brand-500/5 dark:bg-brand-950/10'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          My Listings ({listings.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'bookings'
              ? 'border-brand-600 text-brand-600 dark:text-brand-400 bg-brand-500/5 dark:bg-brand-950/10'
              : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Customer Bookings ({bookings.length})
        </button>
      </div>

      {/* Tab: Listings View */}
      {activeTab === 'listings' && (
        <div>
          {listingsLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 text-brand-500 animate-spin mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-xs">Loading listings...</p>
            </div>
          ) : listingsError ? (
            <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-center max-w-md mx-auto my-10">
              <p className="font-semibold mb-2">{listingsError}</p>
              <button onClick={fetchHostListings} className="btn-secondary text-xs mx-auto py-1.5 mt-2">
                Try Again
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className="glass-panel text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-800">
              <FileText className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">No active listings</h3>
              <p className="text-slate-505 dark:text-slate-400 max-w-xs mx-auto text-sm mt-2 leading-relaxed font-normal">
                You haven't listed any stays yet. Create your first property listing to start receiving stays.
              </p>
              <button onClick={handleOpenCreateModal} className="btn-primary text-xs mx-auto py-2.5 px-5 rounded-xl mt-6">
                Create First Listing
              </button>
            </div>
          ) : (
            /* Listings grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => {
                const img = (item.images && item.images.length > 0) ? item.images[0] : defaultImage;
                return (
                  <div 
                    key={item._id}
                    className="glass-panel rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-40 bg-slate-100 dark:bg-slate-900 overflow-hidden relative">
                        <img src={img} alt={item.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-brand-600 dark:text-brand-300 font-bold text-xs border border-slate-200 dark:border-slate-800">
                          ₹{item.price}/night
                        </div>
                      </div>
                      
                      <div className="p-5 space-y-2">
                        <span className="text-[10px] text-brand-600 dark:text-brand-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                        <h3 className="text-slate-900 dark:text-white font-bold text-base line-clamp-1">{item.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-3 border-t border-slate-200 dark:border-slate-850 mt-auto flex justify-between gap-3">
                      <button
                        onClick={() => handleViewListingBookings(item._id)}
                        className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 font-semibold flex-grow text-left hover:underline"
                      >
                        View bookings log
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(item._id)}
                          className="p-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-red-500 dark:text-red-400 hover:text-red-655 dark:hover:text-red-300 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Bookings View */}
      {activeTab === 'bookings' && (
        <div>
          {bookingsLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 text-brand-500 animate-spin mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-xs">Loading customer booking logs...</p>
            </div>
          ) : bookingsError ? (
            <div className="p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-2xl text-center max-w-md mx-auto my-10">
              <p className="font-semibold mb-2">{bookingsError}</p>
              <button onClick={fetchHostBookings} className="btn-secondary text-xs mx-auto py-1.5 mt-2">
                Try Again
              </button>
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-panel text-center py-16 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Calendar className="h-12 w-12 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">No bookings received</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto text-sm mt-2 leading-relaxed font-normal">
                No travelers have booked your properties yet. Optimize listing descriptions to attract travelers.
              </p>
            </div>
          ) : (
            /* Bookings Table */
            <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
                      <th className="p-4 pl-6">Traveler / User</th>
                      <th className="p-4">Property</th>
                      <th className="p-4">Stay Dates</th>
                      <th className="p-4">Nights</th>
                      <th className="p-4">Payout</th>
                      <th className="p-4 pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-850">
                    {bookings.map((booking) => {
                      const { _id, checkIn, checkOut, numberOfDays, totalPrice, status, userId, listingId } = booking;
                      const isBooked = status === 'Booked';
                      
                      return (
                        <tr key={_id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                          <td className="p-4 pl-6">
                            <span className="font-medium text-slate-900 dark:text-white truncate block max-w-[150px]">{userId?.email || 'Guest User'}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate block max-w-[180px]">
                              {listingId ? listingId.title : 'Deleted Property'}
                            </span>
                          </td>
                          <td className="p-4 text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(checkIn)} - {formatDate(checkOut)}
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300 font-mono">{numberOfDays}</td>
                          <td className="p-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">₹{totalPrice}</td>
                          <td className="p-4 pr-6">
                            {isBooked ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                                <CheckCircle2 className="h-3 w-3" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-955/40 bg-red-955/40 bg-red-950/40 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-500/20">
                                <XOctagon className="h-3 w-3" />
                                Cancelled
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create/Edit Listing */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-2xl border border-slate-205 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-slate-900 dark:text-white font-extrabold text-xl mb-6">
              {isEditing ? 'Modify Property Listing' : 'List New Accommodation'}
            </h3>

            {formSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4.5 w-4.5" />
                <span>Property saved successfully!</span>
              </div>
            )}

            {formError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-start gap-1.5">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Property Title *
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. OCEAN FRONT VILLA GOA"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows="3"
                  placeholder="Describe your property, listing amenities, view details, etc."
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500 resize-none"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Location City / State *
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Goa, India"
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                    Nightly Price (₹100 - ₹9999) *
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="9999"
                    value={formPrice}
                    onChange={(e) => setFormPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formImages}
                  onChange={(e) => setFormImages(e.target.value)}
                  placeholder="Paste a direct image link (optional)"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Leaves blank to assign a premium default placeholder automatically.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800/60 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary text-xs py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 rounded-xl"
                >
                  {isEditing ? 'Save Changes' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Specific Listing Bookings Log */}
      {showListingBookingsModal && selectedListingDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            <h3 className="text-slate-900 dark:text-white font-extrabold text-lg mb-2 truncate pr-6">
              Bookings for: {selectedListingDetail.listing.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Nightly Price: ₹{selectedListingDetail.listing.price} | Total Bookings: {selectedListingDetail.bookingsCount}
            </p>

            {selectedListingDetail.bookings.length === 0 ? (
              <div className="text-center py-10 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/30">
                <p className="text-slate-500 dark:text-slate-400 text-sm">No reservations logged for this listing yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {selectedListingDetail.bookings.map((booking) => {
                  const isBooked = booking.status === 'Booked';
                  return (
                    <div 
                      key={booking._id} 
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex justify-between items-center text-xs"
                    >
                      <div className="space-y-1">
                        <p className="text-slate-900 dark:text-white font-semibold">Traveler: {booking.userId?.email || 'Guest'}</p>
                        <p className="text-slate-500 dark:text-slate-400">
                          {formatDate(booking.checkIn)} to {formatDate(booking.checkOut)} ({booking.numberOfDays} nights)
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-600 dark:text-emerald-400 font-extrabold">₹{booking.totalPrice}</p>
                        <span className={`inline-block text-[9px] font-bold mt-1 ${isBooked ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-5 border-t border-slate-200 dark:border-slate-800/60 mt-6">
              <button
                type="button"
                onClick={() => setShowListingBookingsModal(false)}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setListingToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Property Listing"
        message="Are you sure you want to delete this listing? All bookings under this listing will remain but will reference the property as deleted. This action is permanent."
        confirmText="Delete Listing"
        cancelText="Cancel"
        loading={deleteLoading}
        type="danger"
      />
    </div>
  );
};

export default HostDashboard;
