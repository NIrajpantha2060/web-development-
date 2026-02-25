import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { bookingAPI } from '../../services/api';
import '../css/ApplyRideModal.css';

const ApplyRideModal = ({ isOpen, onClose, ride, onSuccess }) => {
  // Current step: 'confirm' | 'payment-setup' | 'mpin-setup' | 'mpin-verify' | 'processing' | 'success'
  const [currentStep, setCurrentStep] = useState('confirm');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [seatsToBook, setSeatsToBook] = useState(1);
  
  // Payment status from backend
  const [paymentStatus, setPaymentStatus] = useState({
    hasMpinSetup: false,
    hasPaymentSetup: false,
    cardLastFour: null,
    cardBrand: null,
    cardHolderName: null
  });
  
  // Debit Card form
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    cardHolderName: '',
    cardExpiry: '',
    cvv: ''
  });
  
  // MPIN inputs
  const [mpin, setMpin] = useState(['', '', '', '']);
  const [confirmMpin, setConfirmMpin] = useState(['', '', '', '']);
  const mpinRefs = [useRef(), useRef(), useRef(), useRef()];
  const confirmMpinRefs = [useRef(), useRef(), useRef(), useRef()];
  
  // Booking result
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchPaymentStatus();
      setCurrentStep('confirm');
      setMpin(['', '', '', '']);
      setConfirmMpin(['', '', '', '']);
      setMessage({ type: '', text: '' });
      setSeatsToBook(1);
      setCardForm({
        cardNumber: '',
        cardHolderName: '',
        cardExpiry: '',
        cvv: ''
      });
    }
  }, [isOpen]);

  const fetchPaymentStatus = async () => {
    try {
      const status = await bookingAPI.getPaymentStatus();
      setPaymentStatus(status);
    } catch (error) {
      console.error('Error fetching payment status:', error);
    }
  };

  if (!isOpen || !ride) return null;

  const {
    id: rideId,
    driverName = 'Anonymous',
    from = '',
    to = '',
    date = '',
    time = '',
    price = 0,
    availableSeats = 0,
    bookedSeats = 0
  } = ride;

  const remainingSeats = availableSeats - (bookedSeats || 0);
  const totalAmount = (parseFloat(price) || 0) * seatsToBook;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric'
    });
  };

  // Handle MPIN input
  const handleMpinChange = (index, value, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return;
    
    const newMpin = isConfirm ? [...confirmMpin] : [...mpin];
    newMpin[index] = value.slice(-1);
    
    if (isConfirm) {
      setConfirmMpin(newMpin);
      if (value && index < 3) {
        confirmMpinRefs[index + 1].current?.focus();
      }
    } else {
      setMpin(newMpin);
      if (value && index < 3) {
        mpinRefs[index + 1].current?.focus();
      }
    }
  };

  const handleMpinKeyDown = (index, e, isConfirm = false) => {
    if (e.key === 'Backspace') {
      const currentMpin = isConfirm ? confirmMpin : mpin;
      if (!currentMpin[index] && index > 0) {
        if (isConfirm) {
          confirmMpinRefs[index - 1].current?.focus();
        } else {
          mpinRefs[index - 1].current?.focus();
        }
      }
    }
  };

  const getMpinString = () => mpin.join('');
  const getConfirmMpinString = () => confirmMpin.join('');

  // Step 1: Confirm booking - proceed to payment
  const handleConfirmBooking = async () => {
    setMessage({ type: '', text: '' });
    
    // Check if payment is set up
    if (!paymentStatus.hasPaymentSetup) {
      setCurrentStep('payment-setup');
      return;
    }
    
    // Check if MPIN is set up
    if (!paymentStatus.hasMpinSetup) {
      setCurrentStep('mpin-setup');
      return;
    }
    
    // Both are set up, proceed to MPIN verification
    setCurrentStep('mpin-verify');
  };

  // Step 2: Setup debit card
  const handlePaymentSetup = async () => {
    const { cardNumber, cardHolderName, cardExpiry, cvv } = cardForm;
    
    // Validation
    if (!cardNumber || !cardHolderName || !cardExpiry || !cvv) {
      toast.warning('Please fill in all card details');
      setMessage({ type: 'error', text: 'Please fill in all card details' });
      return;
    }
    
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length !== 16) {
      toast.warning('Card number must be 16 digits');
      setMessage({ type: 'error', text: 'Card number must be 16 digits' });
      return;
    }
    
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry)) {
      toast.warning('Invalid expiry. Use MM/YY format');
      setMessage({ type: 'error', text: 'Invalid expiry. Use MM/YY format' });
      return;
    }
    
    if (cvv.length !== 3) {
      toast.warning('CVV must be 3 digits');
      setMessage({ type: 'error', text: 'CVV must be 3 digits' });
      return;
    }
    
    setLoading(true);
    try {
      const response = await bookingAPI.setupPayment({
        cardNumber: cleanCardNumber,
        cardHolderName,
        cardExpiry,
        cvv
      });
      
      toast.success('Debit card linked successfully! 💳');
      setPaymentStatus(prev => ({
        ...prev,
        hasPaymentSetup: true,
        cardLastFour: response.paymentInfo.cardLastFour,
        cardBrand: response.paymentInfo.cardBrand,
        cardHolderName: response.paymentInfo.cardHolderName
      }));
      
      // Next: Check MPIN
      if (!paymentStatus.hasMpinSetup) {
        setCurrentStep('mpin-setup');
      } else {
        setCurrentStep('mpin-verify');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to link debit card');
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to link debit card' });
    } finally {
      setLoading(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardInputChange = (field, value) => {
    if (field === 'cardNumber') {
      setCardForm(prev => ({ ...prev, cardNumber: formatCardNumber(value) }));
    } else if (field === 'cardExpiry') {
      const cleaned = value.replace(/[^0-9/]/g, '');
      if (cleaned.length <= 5) {
        setCardForm(prev => ({ ...prev, cardExpiry: formatExpiry(cleaned.replace('/', '')) }));
      }
    } else if (field === 'cvv') {
      const cleaned = value.replace(/[^0-9]/g, '').slice(0, 3);
      setCardForm(prev => ({ ...prev, cvv: cleaned }));
    } else {
      setCardForm(prev => ({ ...prev, [field]: value }));
    }
  };

  // Step 3: Setup MPIN
  const handleMpinSetup = async () => {
    const mpinStr = getMpinString();
    const confirmStr = getConfirmMpinString();
    
    if (mpinStr.length !== 4) {
      toast.warning('Please enter a 4-digit MPIN');
      setMessage({ type: 'error', text: 'Please enter a 4-digit MPIN' });
      return;
    }
    
    if (mpinStr !== confirmStr) {
      toast.warning('MPINs do not match. Please try again.');
      setMessage({ type: 'error', text: 'MPINs do not match. Please try again.' });
      return;
    }
    
    setLoading(true);
    try {
      await bookingAPI.setupMpin(mpinStr);
      toast.success('MPIN set up successfully! 🔐');
      setPaymentStatus(prev => ({ ...prev, hasMpinSetup: true }));
      
      // Proceed to complete booking with the MPIN
      await completeBooking(mpinStr);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to set up MPIN');
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to set up MPIN' });
      setLoading(false);
    }
  };

  // Step 4: Verify MPIN and complete booking
  const handleMpinVerify = async () => {
    const mpinStr = getMpinString();
    
    if (mpinStr.length !== 4) {
      toast.warning('Please enter your 4-digit MPIN');
      setMessage({ type: 'error', text: 'Please enter your 4-digit MPIN' });
      return;
    }
    
    await completeBooking(mpinStr);
  };

  // Complete booking with payment
  const completeBooking = async (mpinStr) => {
    setLoading(true);
    setCurrentStep('processing');
    setMessage({ type: '', text: '' });
    
    try {
      const response = await bookingAPI.applyForRide(rideId, seatsToBook, mpinStr);
      setBookingResult(response);
      setCurrentStep('success');
      toast.success('Ride booked successfully! 🎉');
      
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed. Please try again.');
      setMessage({ type: 'error', text: error.response?.data?.message || 'Booking failed. Please try again.' });
      setCurrentStep('mpin-verify');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (currentStep === 'success') {
      onClose(true); // Indicate success to parent
    } else {
      onClose(false);
    }
  };

  // Render different steps
  const renderConfirmStep = () => (
    <>
      <div className="apply-modal-header">
        <h2>Book This Ride</h2>
        <button className="modal-close-btn" onClick={handleClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="apply-modal-body">
        <div className="ride-summary-card">
          <div className="route-info">
            <div className="route-point">
              <span className="route-dot from"></span>
              <span className="route-text">{from}</span>
            </div>
            <div className="route-line-vertical"></div>
            <div className="route-point">
              <span className="route-dot to"></span>
              <span className="route-text">{to}</span>
            </div>
          </div>
          
          <div className="ride-meta">
            <div className="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{formatDate(date)}</span>
            </div>
            <div className="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <span>{time}</span>
            </div>
          </div>
          
          <div className="driver-name-row">
            <span className="label">Driver:</span>
            <span className="value">{driverName}</span>
          </div>
        </div>
        
        <div className="booking-options">
          <div className="seats-selector">
            <label>Number of Seats</label>
            <div className="seats-input">
              <button 
                onClick={() => setSeatsToBook(Math.max(1, seatsToBook - 1))}
                disabled={seatsToBook <= 1}
              >
                -
              </button>
              <span>{seatsToBook}</span>
              <button 
                onClick={() => setSeatsToBook(Math.min(remainingSeats, seatsToBook + 1))}
                disabled={seatsToBook >= remainingSeats}
              >
                +
              </button>
            </div>
            <span className="seats-available">{remainingSeats} seat(s) available</span>
          </div>
          
          <div className="price-summary">
            <div className="price-row">
              <span>Price per seat</span>
              <span>Rs. {price}</span>
            </div>
            <div className="price-row">
              <span>Seats</span>
              <span>x {seatsToBook}</span>
            </div>
            <div className="price-row total">
              <span>Total Amount</span>
              <span>Rs. {totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {message.text && (
          <div className={`apply-message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
      
      <div className="apply-modal-footer">
        <button className="btn-cancel" onClick={handleClose}>Cancel</button>
        <button className="btn-proceed" onClick={handleConfirmBooking} disabled={loading}>
          Proceed to Payment
        </button>
      </div>
    </>
  );

  const renderPaymentSetupStep = () => (
    <>
      <div className="apply-modal-header payment-setup">
        <h2>Link Debit Card</h2>
        <button className="modal-close-btn" onClick={handleClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="apply-modal-body">
        <p className="setup-description">
          Link your debit card to book rides securely.
        </p>
        
        <div className="card-form">
          <div className="card-visual">
            <div className="card-chip"></div>
            <div className="card-number-display">
              {cardForm.cardNumber || '•••• •••• •••• ••••'}
            </div>
            <div className="card-bottom">
              <div className="card-holder-display">
                {cardForm.cardHolderName || 'CARDHOLDER NAME'}
              </div>
              <div className="card-expiry-display">
                {cardForm.cardExpiry || 'MM/YY'}
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardForm.cardNumber}
              onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
              maxLength={19}
              className="card-input"
            />
          </div>
          
          <div className="form-group">
            <label>Cardholder Name</label>
            <input
              type="text"
              placeholder="JOHN DOE"
              value={cardForm.cardHolderName}
              onChange={(e) => handleCardInputChange('cardHolderName', e.target.value.toUpperCase())}
              className="card-input"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Expiry Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={cardForm.cardExpiry}
                onChange={(e) => handleCardInputChange('cardExpiry', e.target.value)}
                maxLength={5}
                className="card-input"
              />
            </div>
            <div className="form-group half">
              <label>CVV</label>
              <input
                type="password"
                placeholder="•••"
                value={cardForm.cvv}
                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                maxLength={3}
                className="card-input"
              />
            </div>
          </div>
        </div>
        
        {message.text && (
          <div className={`apply-message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
      
      <div className="apply-modal-footer">
        <button className="btn-cancel" onClick={() => setCurrentStep('confirm')}>Back</button>
        <button className="btn-proceed" onClick={handlePaymentSetup} disabled={loading}>
          {loading ? 'Linking...' : 'Link Card & Continue'}
        </button>
      </div>
    </>
  );

  const renderMpinSetupStep = () => (
    <>
      <div className="apply-modal-header mpin-setup">
        <h2>Create MPIN</h2>
        <button className="modal-close-btn" onClick={handleClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="apply-modal-body">
        <div className="mpin-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        
        <p className="setup-description">
          Create a 4-digit MPIN to securely authorize your payments.
        </p>
        
        <div className="mpin-input-group">
          <label>Enter MPIN</label>
          <div className="mpin-inputs">
            {[0, 1, 2, 3].map(index => (
              <input
                key={index}
                ref={mpinRefs[index]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={mpin[index]}
                onChange={(e) => handleMpinChange(index, e.target.value)}
                onKeyDown={(e) => handleMpinKeyDown(index, e)}
                className="mpin-input"
              />
            ))}
          </div>
        </div>
        
        <div className="mpin-input-group">
          <label>Confirm MPIN</label>
          <div className="mpin-inputs">
            {[0, 1, 2, 3].map(index => (
              <input
                key={index}
                ref={confirmMpinRefs[index]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={confirmMpin[index]}
                onChange={(e) => handleMpinChange(index, e.target.value, true)}
                onKeyDown={(e) => handleMpinKeyDown(index, e, true)}
                className="mpin-input"
              />
            ))}
          </div>
        </div>
        
        {message.text && (
          <div className={`apply-message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
      
      <div className="apply-modal-footer">
        <button className="btn-cancel" onClick={() => setCurrentStep('confirm')}>Back</button>
        <button className="btn-proceed" onClick={handleMpinSetup} disabled={loading}>
          {loading ? 'Setting up...' : 'Create MPIN & Pay'}
        </button>
      </div>
    </>
  );

  const renderMpinVerifyStep = () => (
    <>
      <div className="apply-modal-header mpin-verify">
        <h2>Enter MPIN</h2>
        <button className="modal-close-btn" onClick={handleClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <div className="apply-modal-body">
        <div className="payment-summary">
          <div className="card-info-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <span>{paymentStatus.cardBrand || 'Card'} •••• {paymentStatus.cardLastFour}</span>
          </div>
          <div className="payment-amount">
            <span className="amount-label">Amount to Pay</span>
            <span className="amount-value">Rs. {totalAmount.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="mpin-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        
        <p className="setup-description">
          Enter your 4-digit MPIN to confirm payment
        </p>
        
        <div className="mpin-input-group centered">
          <div className="mpin-inputs">
            {[0, 1, 2, 3].map(index => (
              <input
                key={index}
                ref={mpinRefs[index]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={mpin[index]}
                onChange={(e) => handleMpinChange(index, e.target.value)}
                onKeyDown={(e) => handleMpinKeyDown(index, e)}
                className="mpin-input"
                autoFocus={index === 0}
              />
            ))}
          </div>
        </div>
        
        {message.text && (
          <div className={`apply-message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>
      
      <div className="apply-modal-footer">
        <button className="btn-cancel" onClick={() => setCurrentStep('confirm')}>Back</button>
        <button className="btn-proceed pay" onClick={handleMpinVerify} disabled={loading}>
          {loading ? 'Processing...' : `Pay Rs. ${totalAmount.toLocaleString()}`}
        </button>
      </div>
    </>
  );

  const renderProcessingStep = () => (
    <>
      <div className="apply-modal-header processing">
        <h2>Processing Payment</h2>
      </div>
      
      <div className="apply-modal-body centered">
        <div className="processing-animation">
          <div className="spinner"></div>
        </div>
        <p className="processing-text">Please wait while we process your payment...</p>
      </div>
    </>
  );

  const renderSuccessStep = () => (
    <>
      <div className="apply-modal-header success">
        <h2>Booking Confirmed!</h2>
      </div>
      
      <div className="apply-modal-body centered">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h3 className="success-title">Ride Booked Successfully!</h3>
        <p className="success-subtitle">Your payment has been processed.</p>
        
        {bookingResult && (
          <div className="booking-confirmation">
            <div className="confirmation-row">
              <span>Transaction ID</span>
              <span className="txn-id">{bookingResult.booking?.transactionId}</span>
            </div>
            <div className="confirmation-row">
              <span>Seats Booked</span>
              <span>{bookingResult.booking?.seatsBooked}</span>
            </div>
            <div className="confirmation-row">
              <span>Amount Paid</span>
              <span>Rs. {parseFloat(bookingResult.booking?.totalAmount || 0).toLocaleString()}</span>
            </div>
            {bookingResult.rider && (
              <div className="driver-contact">
                <p>Contact your driver:</p>
                <a href={`tel:${bookingResult.rider.phone}`} className="phone-link">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  {bookingResult.rider.phone}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="apply-modal-footer">
        <button className="btn-proceed full" onClick={handleClose}>
          Done
        </button>
      </div>
    </>
  );

  return (
    <div className="apply-modal-overlay" onClick={handleClose}>
      <div className={`apply-modal ${currentStep}`} onClick={(e) => e.stopPropagation()}>
        {currentStep === 'confirm' && renderConfirmStep()}
        {currentStep === 'payment-setup' && renderPaymentSetupStep()}
        {currentStep === 'mpin-setup' && renderMpinSetupStep()}
        {currentStep === 'mpin-verify' && renderMpinVerifyStep()}
        {currentStep === 'processing' && renderProcessingStep()}
        {currentStep === 'success' && renderSuccessStep()}
      </div>
    </div>
  );
};

export default ApplyRideModal;
