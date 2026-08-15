import React, { useCallback, useEffect, useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import {
  addFavourite,
  isFavourite,
  removeFavourite,
} from '../../services/favourite.service';

interface SaveFavouriteButtonProps {
  professionalId: string;
  className?: string;
  // "icon" = compact heart used as an overlay on cards;
  // "button" = labelled button used on the profile page.
  variant?: 'icon' | 'button';
}

export const SaveFavouriteButton: React.FC<SaveFavouriteButtonProps> = ({
  professionalId,
  className = '',
  variant = 'icon',
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!professionalId) return;
    if (!isAuthenticated || user?.role !== 'user') {
      setSaved(false);
      return;
    }

    let active = true;
    isFavourite(professionalId)
      .then((fav) => {
        if (active) setSaved(fav);
      })
      .catch(() => {
        if (active) setSaved(false);
      });

    return () => {
      active = false;
    };
  }, [professionalId, isAuthenticated, user?.role]);

  const handleToggle = useCallback(async () => {
    if (!professionalId) return;

    if (!isAuthenticated || user?.role !== 'user') {
      navigate('/login', {
        state: { from: { pathname: window.location.pathname } },
      });
      return;
    }

    setBusy(true);
    try {
      if (saved) {
        await removeFavourite(professionalId);
        setSaved(false);
      } else {
        await addFavourite(professionalId);
        setSaved(true);
      }
    } catch {
      // Ignore transient errors (e.g. network) — state stays as-is.
    } finally {
      setBusy(false);
    }
  }, [professionalId, saved, isAuthenticated, user?.role, navigate]);

  if (variant === 'button') {
    return (
      <button
        onClick={handleToggle}
        disabled={busy}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 font-semibold px-8 py-3.5 rounded-full transition-all text-sm border ${
          saved
            ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20'
            : 'bg-white text-red-600 border-red-200 hover:bg-red-50 dark:bg-navy-800 dark:text-red-400 dark:border-red-900/50 dark:hover:bg-red-950/30'
        } ${className}`}
      >
        {busy ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
        )}
        {saved ? 'Saved to Favourites' : 'Save to Favourites'}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={busy}
      title={saved ? 'Remove from favourites' : 'Save to favourites'}
      aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
      className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
        saved
          ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/30'
          : 'bg-black/40 text-white border-white/20 hover:bg-red-600/80 hover:border-red-500'
      } ${className}`}
    >
      {busy ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
      )}
    </button>
  );
};

export default SaveFavouriteButton;
