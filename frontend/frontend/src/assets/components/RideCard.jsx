import '../css/RideCard.css';

const RideCard = ({ ride }) => {
  const {
    driverName = 'Driver Name',
    driverRating = 4.5,
    from = 'Kathmandu',
    to = 'Pokhara',
    date = '2026-01-20',
    time = '10:00 AM',
    price = 1500,
    availableSeats = 3,
    vehicleType = 'Sedan',
    isVerified = true
  } = ride || {};

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="ride-card">
      <div className="ride-card-header">
        <div className="driver-info">
          <div className="driver-avatar">
            {driverName.charAt(0).toUpperCase()}
          </div>
          <div className="driver-details">
            <div className="driver-name-row">
              <h3>{driverName}</h3>
              {isVerified && (
                <span className="verified-icon" title="Verified Driver">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              )}
            </div>
            <div className="driver-rating">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{driverRating.toFixed(1)}</span>
            </div>
          </div>
        </div>
        <div className="ride-price">
          <span className="currency">NPR</span>
          <span className="amount">{price}</span>
        </div>
      </div>

      <div className="ride-route">
        <div className="route-point">
          <div className="route-icon from">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="8" />
            </svg>
          </div>
          <div className="route-location">
            <span className="location-label">From</span>
            <span className="location-name">{from}</span>
          </div>
        </div>

        <div className="route-line"></div>

        <div className="route-point">
          <div className="route-icon to">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>
          <div className="route-location">
            <span className="location-label">To</span>
            <span className="location-name">{to}</span>
          </div>
        </div>
      </div>

      <div className="ride-details">
        <div className="detail-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(date)}</span>
        </div>
        <div className="detail-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{time}</span>
        </div>
        <div className="detail-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>{availableSeats} seats</span>
        </div>
        <div className="detail-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>{vehicleType}</span>
        </div>
      </div>

      <div className="ride-actions">
        <button className="btn-secondary">View Details</button>
        <button className="btn-primary">Book Ride</button>
      </div>
    </div>
  );
};

export default RideCard;