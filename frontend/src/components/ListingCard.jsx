import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag } from 'lucide-react';

const ListingCard = ({ listing }) => {
  const { _id, title, description, price, location, images } = listing;

  // Curated list of high-quality fallback hotel / villa images from Unsplash
  const fallbacks = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
  ];

  // Pick a fallback based on id hash, or use first image
  const displayImage = (images && images.length > 0 && images[0]) 
    ? images[0] 
    : fallbacks[Math.abs(_id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % fallbacks.length];

  return (
    <Link 
      to={`/listings/${_id}`}
      className="group block rounded-2xl overflow-hidden glass-panel glass-panel-hover flex flex-col h-full border border-slate-200/60 dark:border-slate-800/80 hover:border-brand-500/40"
    >
      {/* Listing Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-900">
        <img 
          src={displayImage} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-white/10 px-3 py-1 rounded-full text-brand-600 dark:text-brand-300 font-bold text-sm flex items-center gap-1 shadow-sm">
          <Tag className="h-3 w-3" />
          <span>₹{price}</span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">/ night</span>
        </div>
      </div>

      {/* Listing Details */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider mb-2">
            <MapPin className="h-3.5 w-3.5" />
            <span>{location || 'Unknown Location'}</span>
          </div>
          
          <h3 className="text-slate-900 dark:text-white font-semibold text-lg line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors mb-2">
            {title}
          </h3>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-200/60 dark:border-slate-800/60 mt-auto">
          <span className="text-xs text-slate-500 dark:text-slate-400">View listing details</span>
          <span className="text-brand-600 dark:text-brand-400 text-xs font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
            Book Now &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
