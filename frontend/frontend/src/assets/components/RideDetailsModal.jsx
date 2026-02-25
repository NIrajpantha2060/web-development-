import { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import '../css/RideDetailsModal.css';

const RideDetailsModal = ({ isOpen, onClose, ride, currentUserId, onCancelRide, onCancelBooking }) => {
  const [passengers, setPassengers] = useState([]);
  const [loadingPassengers, setLoadingPassengers] = useState(false);

  // Check ownership using userId or fallback to rider.id
  const rideOwnerId = ride?.userId || ride?.rider?.id;
  const isOwner = currentUserId && rideOwnerId && currentUserId === rideOwnerId;
  const hasBooking = ride?.userBooking && ride?.userBooking.bookingStatus === 'confirmed';

  // Fetch passengers when modal opens and user is owner
  useEffect(() => {
    if (isOpen && isOwner && ride?.id) {
      fetchPassengers();
    } else {
      setPassengers([]);
    }
  }, [isOpen, isOwner, ride?.id]);

  const fetchPassengers = async () => {
    setLoadingPassengers(true);
    try {
      const response = await bookingAPI.getRidePassengers(ride.id);
      setPassengers(response.bookings || []);
    } catch (error) {
      console.error('Error fetching passengers:', error);
      setPassengers([]);
    } finally {
      setLoadingPassengers(false);
    }
  };

  if (!isOpen || !ride) return null;

  const {
    driverName = 'Anonymous',
    driverRating = null,
    driverTotalRatings = 0,
    driverPhone = '',
    driverPhoto = null,
    driverTotalRides = 0,
    isVerified = false,
    from = '',
    to = '',
    date = '',
    time = '',
    price = 0,
    availableSeats = 0,
    vehicleType = 'Car',
    vehicleNumber = '',
    vehiclePhoto = null,
    pickupLocation = '',
    description = ''
  } = ride;

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const getProfilePictureUrl = (profilePicture) => {
    if (profilePicture) {
      return `http://localhost:5000${profilePicture}?t=${Date.now()}`;
    }
    return null;
  };

  const getVehiclePhotoUrl = (vehiclePhoto) => {
    if (vehiclePhoto) {
      return `http://localhost:5000${vehiclePhoto}?t=${Date.now()}`;
    }
    return null;
  };

  return (
    <div className="ride-details-modal-overlay" onClick={onClose}>
      <div className="ride-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ride-details-modal-header">
          <h2>Ride Details</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="ride-details-modal-body">
          {/* Rider Info Section */}
          <div className="rider-info-section">
            <h3 className="section-title">Rider Information</h3>
            <div className="rider-profile-card">
              <div className="rider-avatar-large">
                {getProfilePictureUrl(driverPhoto) ? (
                  <img 
                    src={getProfilePictureUrl(driverPhoto)} 
                    alt={driverName} 
                    className="rider-avatar-img"
                  />
                ) : (
                  <div className="rider-avatar-placeholder">
                    {getInitials(driverName)}
                  </div>
                )}
                {isVerified && (
                  <span className="verified-badge" title="Verified Rider">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                    </svg>
                  </span>
                )}
              </div>
              
              <div className="rider-details-info">
                <h4 className="rider-name">{driverName}</h4>
                
                <div className="rider-stats">
                  <div className="stat-item">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="stat-icon star">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="stat-value">
                      {driverRating ? parseFloat(driverRating).toFixed(1) : 'New'}
                    </span>
                    <span className="stat-label">
                      {driverTotalRatings > 0 ? `${driverTotalRatings} Rating${driverTotalRatings > 1 ? 's' : ''}` : 'Rating'}
                    </span>
                  </div>
                  
                  <div className="stat-divider"></div>
                  
                  <div className="stat-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="stat-icon">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    <span className="stat-value">{driverTotalRides}</span>
                    <span className="stat-label">Total Rides</span>
                  </div>
                </div>
                
                {driverPhone && (
                  <div className="rider-phone">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${driverPhone}`} className="phone-link">{driverPhone}</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Route Section */}
          <div className="route-section">
            <h3 className="section-title">Route</h3>
            <div className="route-details">
              <div className="route-point">
                <div className="route-marker from"></div>
                <div className="route-info">
                  <span className="route-label">From</span>
                  <span className="route-value">{from}</span>
                </div>
              </div>
              <div className="route-line-vertical"></div>
              <div className="route-point">
                <div className="route-marker to"></div>
                <div className="route-info">
                  <span className="route-label">To</span>
                  <span className="route-value">{to}</span>
                </div>
              </div>
            </div>
            {pickupLocation && (
              <div className="pickup-location">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Pickup: {pickupLocation}</span>
              </div>
            )}
          </div>

          {/* Trip Details Section */}
          <div className="trip-details-section">
            <h3 className="section-title">Trip Details</h3>
            <div className="trip-details-grid">
              <div className="trip-detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <div>
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{formatDate(date)}</span>
                </div>
              </div>
              
              <div className="trip-detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div>
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{time}</span>
                </div>
              </div>
              
              <div className="trip-detail-item">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <span className="detail-label">Available Seats</span>
                  <span className="detail-value">{availableSeats}</span>
                </div>
              </div>
              
              <div className="trip-detail-item price">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12M6 8h12M6 8l6 13M6 8c3 0 6 0 8 3"></path>
                </svg>
                <div>
                  <span className="detail-label">Price per Seat</span>
                  <span className="detail-value price-value">Rs. {price}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Section */}
          <div className="vehicle-section">
            <h3 className="section-title">Vehicle Information</h3>
            <div className="vehicle-details">
              <div className="vehicle-info">
                <div className="vehicle-type-badge">
                  <img 
                    src={vehicleType === 'Bike' ? '/icons/bike logo.jpg' : '/icons/car logo.jpg'} 
                    alt={vehicleType}
                    className="vehicle-type-icon"
                  />
                  <span>{vehicleType}</span>
                </div>
                <div className="vehicle-number">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="6" width="18" height="12" rx="2"></rect>
                    <path d="M7 10h10"></path>
                  </svg>
                  <span>{vehicleNumber}</span>
                </div>
              </div>
              
              {getVehiclePhotoUrl(vehiclePhoto) && (
                <div className="vehicle-photo-container">
                  <img 
                    src={getVehiclePhotoUrl(vehiclePhoto)} 
                    alt="Vehicle" 
                    className="vehicle-photo"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          {description && (
            <div className="description-section">
              <h3 className="section-title">Additional Notes</h3>
              <p className="description-text">{description}</p>
            </div>
          )}

          {/* Your Booking Section - Show when user has booked */}
          {hasBooking && (
            <div className="your-booking-section">
              <h3 className="section-title">Your Booking</h3>
              <div className="booking-info-card">
                <div className="booking-status confirmed">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                  </svg>
                  <span>Booking Confirmed</span>
                </div>
                <div className="booking-details">
                  <div className="booking-detail-item">
                    <span className="label">Seats Booked:</span>
                    <span className="value">{ride.userBooking.seatsBooked}</span>
                  </div>
                  <div className="booking-detail-item">
                    <span className="label">Total Paid:</span>
                    <span className="value">Rs. {ride.userBooking.totalAmount}</span>
                  </div>
                  <div className="booking-detail-item">
                    <span className="label">Transaction ID:</span>
                    <span className="value transaction-id">{ride.userBooking.transactionId}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Passengers Section - Show when user is the owner */}
          {isOwner && (
            <div className="passengers-section">
              <h3 className="section-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Passengers ({passengers.length})
              </h3>
              
              {loadingPassengers ? (
                <div className="loading-passengers">Loading passengers...</div>
              ) : passengers.length === 0 ? (
                <div className="no-passengers">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <p>No passengers have booked this ride yet</p>
                </div>
              ) : (
                <div className="passengers-list">
                  {passengers.map((booking) => (
                    <div key={booking.id} className="passenger-card">
                      <div className="passenger-avatar">
                        {booking.passenger?.profilePicture ? (
                          <img 
                            src={getProfilePictureUrl(booking.passenger.profilePicture)} 
                            alt={booking.passenger.username} 
                            className="passenger-avatar-img"
                          />
                        ) : (
                          <div className="passenger-avatar-placeholder">
                            {getInitials(booking.passenger?.username)}
                          </div>
                        )}
                        {booking.passenger?.isVerifiedUser && (
                          <span className="verified-badge-small" title="Verified User">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                            </svg>
                          </span>
                        )}
                      </div>
                      <div className="passenger-info">
                        <h4 className="passenger-name">{booking.passenger?.username || 'Unknown'}</h4>
                        <div className="passenger-details">
                          <div className="passenger-detail">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a href={`tel:${booking.passenger?.phone}`} className="phone-link">
                              {booking.passenger?.phone || 'No phone'}
                            </a>
                          </div>
                          <div className="passenger-detail">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{booking.seatsBooked} seat{booking.seatsBooked > 1 ? 's' : ''} booked</span>
                          </div>
                          <div className="passenger-detail amount">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12M6 8h12M6 8l6 13M6 8c3 0 6 0 8 3"></path>
                            </svg>
                            <span>Rs. {booking.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="ride-details-modal-footer">
          <button className="btn-close" onClick={onClose}>Close</button>
          {isOwner ? (
            <button 
              className="btn-cancel-ride" 
              onClick={() => onCancelRide && onCancelRide(ride)}
            >
              Cancel Ride
            </button>
          ) : hasBooking ? (
            <button 
              className="btn-cancel-ride" 
              onClick={() => onCancelBooking && onCancelBooking(ride.userBooking)}
            >
              Cancel Booking
            </button>
          ) : (
            <button className="btn-book">Book Ride</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RideDetailsModal;
