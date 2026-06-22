import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Phone, MapPin, AlignLeft, Info, HelpCircle, 
  RefreshCw, CheckCircle2, ShieldAlert, Sparkles, Check
} from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const Profile = () => {
  const { user, profile, updateProfile, becomeHost, loading } = useAuth();
  const navigate = useNavigate();

  // Profile fields state
  const [name, setName] = useState('');
  const [gender, setGender] = useState('Male');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [avatar, setAvatar] = useState('');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [hostLoading, setHostLoading] = useState(false);
  const [showBecomeHostModal, setShowBecomeHostModal] = useState(false);

  // Sync profile details when loaded
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setGender(profile.gender || 'Male');
      setPhone(profile.phone || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setAvatar(profile.avatar || '');
    }
  }, [profile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setSaveError('');

    const res = await updateProfile({
      name,
      gender,
      phone,
      bio,
      location,
      avatar
    });

    setSaving(false);
    if (res.success) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setSaveError(res.error);
    }
  };

  const handleBecomeHost = async () => {
    setHostLoading(true);
    const res = await becomeHost();
    setHostLoading(false);
    setShowBecomeHostModal(false);
    if (res.success) {
      navigate('/host-dashboard');
    } else {
      setSaveError(res.error);
    }
  };

  // Pre-configured avatar templates for premium feel
  const avatarTemplates = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 max-w-7xl mx-auto px-4">
        <RefreshCw className="h-10 w-10 text-brand-500 animate-spin mb-4" />
        <p className="text-slate-500 dark:text-slate-400 text-sm">Retrieving your profile credentials...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Profile Settings</h1>
        <p className="text-slate-505 dark:text-slate-400 text-slate-500 text-sm mt-1">Manage your public bio, contact information, and role configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Role Callout */}
        <div className="md:col-span-1 space-y-6">
          {/* Avatar Card */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-brand-500 bg-slate-200 dark:bg-slate-900 mb-4">
              <img 
                src={avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            
            <h3 className="text-slate-900 dark:text-white font-semibold text-base truncate max-w-full">
              {name || 'StaySphere Guest'}
            </h3>
            <p className="text-slate-600 dark:text-slate-500 text-xs mt-1 truncate max-w-full">{user?.email}</p>

            {/* Role Badge */}
            <div className="mt-4">
              {user?.isHost ? (
                <span className="inline-flex items-center gap-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold px-3 py-1 rounded-full border border-brand-500/20">
                  <Sparkles className="h-3 w-3" />
                  Host Status Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 text-xs font-semibold px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700/30">
                  Standard Account
                </span>
              )}
            </div>
          </div>

          {/* Become Host Callout */}
          {!user?.isHost && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-205 dark:border-slate-800 bg-gradient-to-br from-brand-50/40 dark:from-brand-950/20 to-slate-100 dark:to-slate-950 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <h4 className="text-slate-905 dark:text-white text-slate-900 font-bold text-sm flex items-center gap-1.5 mb-2">
                <Sparkles className="h-4.5 w-4.5 text-brand-600 dark:text-brand-400" />
                Become a Host
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4">
                Want to rent out your property, set nightly rates, and earn additional income? Upgrade to a host account.
              </p>
              <button
                onClick={() => setShowBecomeHostModal(true)}
                disabled={hostLoading}
                className="w-full btn-primary text-xs py-2 rounded-xl"
              >
                Become Host Now
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Profile Edit Form */}
        <div className="md:col-span-2">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-3 mb-6">Personal details</h2>

            {saveSuccess && (
              <div className="mb-5 p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm font-medium flex items-center gap-2">
                <Check className="h-4.5 w-4.5" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {saveError && (
              <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-955/40 bg-red-950/40 border border-red-200 dark:border-red-500/30 rounded-xl text-red-655 text-red-600 dark:text-red-400 text-xs flex items-start gap-2">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleUpdate} className="space-y-5">
              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                    Display Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                      <User className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vignesh M"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                    Gender Selection
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-3.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-405 dark:text-slate-500">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                    Current Location
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-405 dark:text-slate-500">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Goa, India"
                      className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bio Field */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                  Biography / Bio Description
                </label>
                <div className="relative">
                  <span className="absolute top-3 left-3 text-slate-405 dark:text-slate-500">
                    <AlignLeft className="h-4 w-4" />
                  </span>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="3"
                    placeholder="Tell other stayspheres about yourself..."
                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500 resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Avatar URL / Selection */}
              <div>
                <label className="block text-slate-600 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5 ml-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Paste URL or click a template below"
                  className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500 mb-3"
                />
                
                {/* Template picker */}
                <div className="flex gap-2.5 items-center">
                  <span className="text-slate-500 dark:text-slate-400 text-xs">Or choose a profile preset:</span>
                  <div className="flex gap-2">
                    {avatarTemplates.map((url, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setAvatar(url)}
                        className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${
                          avatar === url ? 'border-brand-500 scale-105' : 'border-transparent'
                        }`}
                      >
                        <img src={url} alt="Preset avatar" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-slate-205 dark:border-slate-800/60 border-slate-200 mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary py-2.5 px-6 rounded-xl"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Saving changes...
                    </>
                  ) : (
                    'Save Details'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
      <ConfirmationModal
        isOpen={showBecomeHostModal}
        onClose={() => setShowBecomeHostModal(false)}
        onConfirm={handleBecomeHost}
        title="Become a Property Host"
        message="Are you sure you want to become a host? This will grant you access to the Host Console where you can create and manage your property listings."
        confirmText="Become Host"
        cancelText="Maybe Later"
        loading={hostLoading}
        type="info"
      />
    </div>
  );
};

export default Profile;
