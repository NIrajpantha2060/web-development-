import { useState } from 'react';
import { rideAPI } from '../../../services/api';

// ✅ COMPLETE Add Ride Page Component
const AddRidePage = ({ onRideAdded }) => {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    pickupLocation: '',
    vehicleNumber: '',
    vehicleType: 'car',
    description: '',
    price: '',
    availableSeats: '1'
  });
  const [vehiclePhoto, setVehiclePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    setVehiclePhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.from.trim()) newErrors.from = 'From location is required';
    else if (formData.from.length > 30) newErrors.from = 'From location must be 30 characters or less';

    if (!formData.to.trim()) newErrors.to = 'To location is required';
    else if (formData.to.length > 30) newErrors.to = 'To location must be 30 characters or less';

    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';

    if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
    else if (formData.pickupLocation.length > 30) newErrors.pickupLocation = 'Pickup location must be 30 characters or less';

    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    else if (formData.vehicleNumber.length > 30) newErrors.vehicleNumber = 'Vehicle number must be 30 characters or less';

    if (formData.description && formData.description.length > 400) {
      newErrors.description = 'Description must be 400 characters or less';
    }

    if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (formData.availableSeats && (isNaN(formData.availableSeats) || parseInt(formData.availableSeats) < 1 || parseInt(formData.availableSeats) > 10)) {
      newErrors.availableSeats = 'Available seats must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fix the errors in the form' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('from', formData.from.trim());
      formDataToSend.append('to', formData.to.trim());
      formDataToSend.append('date', formData.date);
      formDataToSend.append('time', formData.time);
      formDataToSend.append('pickupLocation', formData.pickupLocation.trim());
      formDataToSend.append('vehicleNumber', formData.vehicleNumber.trim());
      formDataToSend.append('vehicleType', formData.vehicleType);
      if (formData.description.trim()) formDataToSend.append('description', formData.description.trim());
      if (formData.price) formDataToSend.append('price', parseFloat(formData.price));
      if (formData.availableSeats) formDataToSend.append('availableSeats', parseInt(formData.availableSeats));
      if (vehiclePhoto) formDataToSend.append('vehiclePhoto', vehiclePhoto);

      console.log('📤 Submitting ride...');
      
      const response = await rideAPI.addRide(formDataToSend);
      
      console.log('✅ Ride posted successfully:', response);
      
      setMessage({ type: 'success', text: 'Ride posted successfully! 🎉' });
      
      // Reset form
      setFormData({
        from: '',
        to: '',
        date: '',
        time: '',
        pickupLocation: '',
        vehicleNumber: '',
        vehicleType: 'car',
        description: '',
        price: '',
        availableSeats: '1'
      });
      setVehiclePhoto(null);
      setPhotoPreview(null);
      
      // Clear file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
      // Notify parent to refresh rides list
      if (onRideAdded) {
        setTimeout(() => onRideAdded(), 1000);
      }
      
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('❌ Add ride error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to post ride. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-ride-page">
      <div className="page-header">
        <h1>Add New Ride</h1>
        <p>Offer a ride to fellow travelers</p>
      </div>

      {message.text && (
        <div className={`update-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>From *</label>
            <input 
              type="text" 
              name="from"
              className={`form-input ${errors.from ? 'input-error' : ''}`}
              placeholder="Starting location (max 30 chars)"
              value={formData.from}
              onChange={handleChange}
              disabled={loading}
              maxLength={30}
            />
            {errors.from && <span className="error-text">{errors.from}</span>}
          </div>
          <div className="form-group">
            <label>To *</label>
            <input 
              type="text" 
              name="to"
              className={`form-input ${errors.to ? 'input-error' : ''}`}
              placeholder="Destination (max 30 chars)"
              value={formData.to}
              onChange={handleChange}
              disabled={loading}
              maxLength={30}
            />
            {errors.to && <span className="error-text">{errors.to}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date *</label>
            <input 
              type="date" 
              name="date"
              className={`form-input ${errors.date ? 'input-error' : ''}`}
              value={formData.date}
              onChange={handleChange}
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>
          <div className="form-group">
            <label>Time *</label>
            <input 
              type="time" 
              name="time"
              className={`form-input ${errors.time ? 'input-error' : ''}`}
              value={formData.time}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.time && <span className="error-text">{errors.time}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Pickup Location *</label>
          <input 
            type="text" 
            name="pickupLocation"
            className={`form-input ${errors.pickupLocation ? 'input-error' : ''}`}
            placeholder="Exact pickup point (max 30 chars)"
            value={formData.pickupLocation}
            onChange={handleChange}
            disabled={loading}
            maxLength={30}
          />
          {errors.pickupLocation && <span className="error-text">{errors.pickupLocation}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Vehicle Number *</label>
            <input 
              type="text" 
              name="vehicleNumber"
              className={`form-input ${errors.vehicleNumber ? 'input-error' : ''}`}
              placeholder="BA 1 KHA 1234 (max 30 chars)"
              value={formData.vehicleNumber}
              onChange={handleChange}
              disabled={loading}
              maxLength={30}
            />
            {errors.vehicleNumber && <span className="error-text">{errors.vehicleNumber}</span>}
          </div>
          <div className="form-group">
            <label>Vehicle Type *</label>
            <select 
              name="vehicleType"
              className="form-input"
              value={formData.vehicleType}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Price per Seat (NPR)</label>
            <input 
              type="number" 
              name="price"
              className={`form-input ${errors.price ? 'input-error' : ''}`}
              placeholder="500"
              value={formData.price}
              onChange={handleChange}
              disabled={loading}
              min="0"
              step="0.01"
            />
            {errors.price && <span className="error-text">{errors.price}</span>}
          </div>
          <div className="form-group">
            <label>Available Seats</label>
            <input 
              type="number" 
              name="availableSeats"
              className={`form-input ${errors.availableSeats ? 'input-error' : ''}`}
              placeholder="1-10"
              value={formData.availableSeats}
              onChange={handleChange}
              disabled={loading}
              min="1"
              max="10"
            />
            {errors.availableSeats && <span className="error-text">{errors.availableSeats}</span>}
          </div>
        </div>

        <div className="form-group">
          <label>Vehicle Photo</label>
          <input 
            type="file" 
            className="form-input"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={loading}
          />
          <small className="form-help">
            Accepted formats: JPEG, PNG, GIF, WEBP (Max size: 5MB)
          </small>
          {photoPreview && (
            <div style={{ marginTop: '10px' }}>
              <img 
                src={photoPreview} 
                alt="Vehicle preview" 
                style={{ 
                  maxWidth: '200px', 
                  maxHeight: '200px', 
                  borderRadius: '8px',
                  objectFit: 'cover'
                }} 
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Description (Optional)</label>
          <textarea 
            name="description"
            className={`form-input ${errors.description ? 'input-error' : ''}`}
            rows="4"
            placeholder="Any additional information about the ride... (max 400 chars)"
            value={formData.description}
            onChange={handleChange}
            disabled={loading}
            maxLength={400}
          ></textarea>
          <small className="form-help">
            {formData.description.length}/400 characters
          </small>
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>

        <button 
          type="submit"
          className="btn-submit" 
          disabled={loading}
        >
          {loading ? 'Publishing Ride...' : 'Publish Ride'}
        </button>
      </form>
    </div>
  );
};

export default AddRidePage;