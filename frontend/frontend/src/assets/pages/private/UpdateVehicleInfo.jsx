import { useState, useEffect } from 'react';
import { vehicleAPI } from '../../../services/api';
import '../../css/UpdateVehicleInfo.css';

const UpdateVehicleInfo = () => {
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'car',
    vehicleBrand: '',
    vehicleModel: ''
  });
  const [vehiclePhoto, setVehiclePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchVehicleProfile();
  }, []);

  const fetchVehicleProfile = async () => {
    try {
      const response = await vehicleAPI.getVehicleProfile();
      
      if (response.hasVehicle) {
        setVehicleData(response.vehicle);
        setFormData({
          vehicleNumber: response.vehicle.vehicleNumber || '',
          vehicleType: response.vehicle.vehicleType || 'car',
          vehicleBrand: response.vehicle.vehicleBrand || '',
          vehicleModel: response.vehicle.vehicleModel || ''
        });
        
        if (response.vehicle.vehiclePhoto) {
          setPhotoPreview(`http://localhost:5000${response.vehicle.vehiclePhoto}`);
        }
      }
    } catch (error) {
      console.error('Error fetching vehicle profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

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

    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    } else if (formData.vehicleNumber.length > 30) {
      newErrors.vehicleNumber = 'Vehicle number must be 30 characters or less';
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

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('vehicleNumber', formData.vehicleNumber.trim());
      formDataToSend.append('vehicleType', formData.vehicleType);
      if (formData.vehicleBrand) formDataToSend.append('vehicleBrand', formData.vehicleBrand.trim());
      if (formData.vehicleModel) formDataToSend.append('vehicleModel', formData.vehicleModel.trim());
      if (vehiclePhoto) formDataToSend.append('vehiclePhoto', vehiclePhoto);

      let response;
      if (vehicleData) {
        // Update existing vehicle
        response = await vehicleAPI.updateVehicleProfile(formDataToSend);
        setMessage({ type: 'success', text: 'Vehicle information updated successfully! ✅' });
      } else {
        // Create new vehicle
        response = await vehicleAPI.createVehicleProfile(formDataToSend);
        setMessage({ type: 'success', text: 'Vehicle information created successfully! ✅' });
      }

      console.log('✅ Vehicle profile saved:', response);

      // Refresh vehicle data
      await fetchVehicleProfile();

      // Clear photo input
      setVehiclePhoto(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('❌ Vehicle profile error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save vehicle information. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your vehicle profile? This cannot be undone.')) {
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await vehicleAPI.deleteVehicleProfile();
      setMessage({ type: 'success', text: 'Vehicle profile deleted successfully!' });
      
      // Reset form
      setVehicleData(null);
      setFormData({
        vehicleNumber: '',
        vehicleType: 'car',
        vehicleBrand: '',
        vehicleModel: ''
      });
      setPhotoPreview(null);
      
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Delete error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete vehicle profile'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="update-vehicle-page">
        <div className="loading-state">Loading vehicle information...</div>
      </div>
    );
  }

  return (
    <div className="update-vehicle-page">
      <div className="page-header">
        <h1>{vehicleData ? 'Update Vehicle Information' : 'Add Vehicle Information'}</h1>
        <p>Manage your vehicle details for ride offerings</p>
      </div>

      {message.text && (
        <div className={`update-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <form className="form-container" onSubmit={handleSubmit}>
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
              disabled={submitting}
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
              disabled={submitting}
            >
              <option value="car">Car</option>
              <option value="bike">Bike</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Vehicle Brand (Optional)</label>
            <input 
              type="text" 
              name="vehicleBrand"
              className="form-input"
              placeholder="e.g., Toyota, Honda"
              value={formData.vehicleBrand}
              onChange={handleChange}
              disabled={submitting}
              maxLength={50}
            />
          </div>
          
          <div className="form-group">
            <label>Vehicle Model (Optional)</label>
            <input 
              type="text" 
              name="vehicleModel"
              className="form-input"
              placeholder="e.g., Corolla, Civic"
              value={formData.vehicleModel}
              onChange={handleChange}
              disabled={submitting}
              maxLength={50}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Vehicle Photo {vehicleData && '(Upload new to replace)'}</label>
          <input 
            type="file" 
            className="form-input"
            accept="image/*"
            onChange={handlePhotoChange}
            disabled={submitting}
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

        <div className="button-group">
          <button 
            type="submit"
            className="btn-submit" 
            disabled={submitting}
          >
            {submitting ? 'Saving...' : vehicleData ? 'Update Vehicle Info' : 'Save Vehicle Info'}
          </button>

          {vehicleData && (
            <button 
              type="button"
              className="btn-delete" 
              onClick={handleDelete}
              disabled={submitting}
            >
              Delete Vehicle Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UpdateVehicleInfo;