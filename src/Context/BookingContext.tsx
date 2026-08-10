import React, { createContext, useContext, useState } from 'react';
import { TradeCategory, BookingFormData, Professional } from '../types';

interface BookingContextType {
  isBookingOpen: boolean;
  openBooking: (initialData?: Partial<BookingFormData>) => void;
  closeBooking: () => void;
  bookingData: Partial<BookingFormData>;
  updateBookingData: (data: Partial<BookingFormData>) => void;

  /** Increments every time the booking modal is opened, so the wizard can reset itself */
  bookingOpenCount: number;

  isEmergencyOpen: boolean;
  openEmergencyModal: (trade?: TradeCategory) => void;
  closeEmergencyModal: () => void;
  /** Trade passed to the emergency modal (defaults to 'Plumber') */
  emergencyTrade: TradeCategory;
  emergencyOpenCount: number;

  selectedPro: Professional | null;
  openProModal: (pro: Professional) => void;
  closeProModal: () => void;

  userPostcode: string;
  setUserPostcode: (postcode: string) => void;

  userTradeFilter: TradeCategory | 'All';
  setUserTradeFilter: (trade: TradeCategory | 'All') => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const DEFAULT_POSTCODE = '';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingOpenCount, setBookingOpenCount] = useState(0);
  const [bookingData, setBookingData] = useState<Partial<BookingFormData>>({
    trade: 'Plumber',
    postcode: DEFAULT_POSTCODE,
    urgency: 'Standard',
  });

  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [emergencyOpenCount, setEmergencyOpenCount] = useState(0);
  const [emergencyTrade, setEmergencyTrade] = useState<TradeCategory>('Plumber');
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);

  const [userPostcode, setUserPostcode] = useState(DEFAULT_POSTCODE);
  const [userTradeFilter, setUserTradeFilter] = useState<TradeCategory | 'All'>('All');

  const openBooking = (initialData?: Partial<BookingFormData>) => {
    setBookingData((prev) => ({
      ...prev,
      trade: 'Plumber',
      urgency: 'Standard',
      ...initialData,
    }));
    setBookingOpenCount((c) => c + 1);
    setIsBookingOpen(true);
  };

  const closeBooking = () => {
    setIsBookingOpen(false);
  };

  const updateBookingData = (data: Partial<BookingFormData>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const openEmergencyModal = (trade?: TradeCategory) => {
    if (trade) setEmergencyTrade(trade);
    setEmergencyOpenCount((c) => c + 1);
    setIsEmergencyOpen(true);
  };

  const closeEmergencyModal = () => {
    setIsEmergencyOpen(false);
  };

  const openProModal = (pro: Professional) => {
    setSelectedPro(pro);
  };

  const closeProModal = () => {
    setSelectedPro(null);
  };

  return (
    <BookingContext.Provider
      value={{
        isBookingOpen,
        openBooking,
        closeBooking,
        bookingData,
        updateBookingData,
        bookingOpenCount,
        isEmergencyOpen,
        openEmergencyModal,
        closeEmergencyModal,
        emergencyTrade,
        emergencyOpenCount,
        selectedPro,
        openProModal,
        closeProModal,
        userPostcode,
        setUserPostcode,
        userTradeFilter,
        setUserTradeFilter,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
