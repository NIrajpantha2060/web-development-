// import { useState } from 'react';
// import { rideAPI } from '../../../services/api';

// // ✅ COMPLETE Add Ride Page Component
// const AddRidePage = ({ onRideAdded }) => {
//   const [formData, setFormData] = useState({
//     from: '',
//     to: '',
//     date: '',
//     time: '',
//     pickupLocation: '',
//     vehicleNumber: '',
//     vehicleType: 'car',
//     description: '',
//     price: '',
//     availableSeats: '1'
//   });
//   const [vehiclePhoto, setVehiclePhoto] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
//     if (!validTypes.includes(file.type)) {
//       setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setMessage({ type: 'error', text: 'File size must be less than 5MB' });
//       return;
//     }

//     setVehiclePhoto(file);
//     setPhotoPreview(URL.createObjectURL(file));
//     setMessage({ type: '', text: '' });
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.from.trim()) newErrors.from = 'From location is required';
//     else if (formData.from.length > 30) newErrors.from = 'From location must be 30 characters or less';

//     if (!formData.to.trim()) newErrors.to = 'To location is required';
//     else if (formData.to.length > 30) newErrors.to = 'To location must be 30 characters or less';

//     if (!formData.date) newErrors.date = 'Date is required';
//     if (!formData.time) newErrors.time = 'Time is required';

//     if (!formData.pickupLocation.trim()) newErrors.pickupLocation = 'Pickup location is required';
//     else if (formData.pickupLocation.length > 30) newErrors.pickupLocation = 'Pickup location must be 30 characters or less';

//     if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
//     else if (formData.vehicleNumber.length > 30) newErrors.vehicleNumber = 'Vehicle number must be 30 characters or less';

//     if (formData.description && formData.description.length > 400) {
//       newErrors.description = 'Description must be 400 characters or less';
//     }

//     if (formData.price && (isNaN(formData.price) || parseFloat(formData.price) < 0)) {
//       newErrors.price = 'Price must be a valid positive number';
//     }

//     if (formData.availableSeats && (isNaN(formData.availableSeats) || parseInt(formData.availableSeats) < 1 || parseInt(formData.availableSeats) > 10)) {
//       newErrors.availableSeats = 'Available seats must be between 1 and 10';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       setMessage({ type: 'error', text: 'Please fix the errors in the form' });
//       return;
//     }

//     setLoading(true);
//     setMessage({ type: '', text: '' });

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('from', formData.from.trim());
//       formDataToSend.append('to', formData.to.trim());
//       formDataToSend.append('date', formData.date);
//       formDataToSend.append('time', formData.time);
//       formDataToSend.append('pickupLocation', formData.pickupLocation.trim());
//       formDataToSend.append('vehicleNumber', formData.vehicleNumber.trim());
//       formDataToSend.append('vehicleType', formData.vehicleType);
//       if (formData.description.trim()) formDataToSend.append('description', formData.description.trim());
//       if (formData.price) formDataToSend.append('price', parseFloat(formData.price));
//       if (formData.availableSeats) formDataToSend.append('availableSeats', parseInt(formData.availableSeats));
//       if (vehiclePhoto) formDataToSend.append('vehiclePhoto', vehiclePhoto);

//       console.log('📤 Submitting ride...');
      
//       const response = await rideAPI.addRide(formDataToSend);
      
//       console.log('✅ Ride posted successfully:', response);
      
//       setMessage({ type: 'success', text: 'Ride posted successfully! 🎉' });
      
//       // Reset form
//       setFormData({
//         from: '',
//         to: '',
//         date: '',
//         time: '',
//         pickupLocation: '',
//         vehicleNumber: '',
//         vehicleType: 'car',
//         description: '',
//         price: '',
//         availableSeats: '1'
//       });
//       setVehiclePhoto(null);
//       setPhotoPreview(null);
      
//       // Clear file input
//       const fileInput = document.querySelector('input[type="file"]');
//       if (fileInput) fileInput.value = '';
      
//       // Notify parent to refresh rides list
//       if (onRideAdded) {
//         setTimeout(() => onRideAdded(), 1000);
//       }
      
//       setTimeout(() => setMessage({ type: '', text: '' }), 5000);
//     } catch (error) {
//       console.error('❌ Add ride error:', error);
//       setMessage({
//         type: 'error',
//         text: error.response?.data?.message || 'Failed to post ride. Please try again.'
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="add-ride-page">
//       <div className="page-header">
//         <h1>Add New Ride</h1>
//         <p>Offer a ride to fellow travelers</p>
//       </div>

//       {message.text && (
//         <div className={`update-message ${message.type}`}>
//           {message.text}
//         </div>
//       )}

//       <form className="form-container" onSubmit={handleSubmit}>
//         <div className="form-row">
//           <div className="form-group">
//             <label>From *</label>
//             <input 
//               type="text" 
//               name="from"
//               className={`form-input ${errors.from ? 'input-error' : ''}`}
//               placeholder="Starting location (max 30 chars)"
//               value={formData.from}
//               onChange={handleChange}
//               disabled={loading}
//               maxLength={30}
//             />
//             {errors.from && <span className="error-text">{errors.from}</span>}
//           </div>
//           <div className="form-group">
//             <label>To *</label>
//             <input 
//               type="text" 
//               name="to"
//               className={`form-input ${errors.to ? 'input-error' : ''}`}
//               placeholder="Destination (max 30 chars)"
//               value={formData.to}
//               onChange={handleChange}
//               disabled={loading}
//               maxLength={30}
//             />
//             {errors.to && <span className="error-text">{errors.to}</span>}
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Date *</label>
//             <input 
//               type="date" 
//               name="date"
//               className={`form-input ${errors.date ? 'input-error' : ''}`}
//               value={formData.date}
//               onChange={handleChange}
//               disabled={loading}
//               min={new Date().toISOString().split('T')[0]}
//             />
//             {errors.date && <span className="error-text">{errors.date}</span>}
//           </div>
//           <div className="form-group">
//             <label>Time *</label>
//             <input 
//               type="time" 
//               name="time"
//               className={`form-input ${errors.time ? 'input-error' : ''}`}
//               value={formData.time}
//               onChange={handleChange}
//               disabled={loading}
//             />
//             {errors.time && <span className="error-text">{errors.time}</span>}
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Pickup Location *</label>
//           <input 
//             type="text" 
//             name="pickupLocation"
//             className={`form-input ${errors.pickupLocation ? 'input-error' : ''}`}
//             placeholder="Exact pickup point (max 30 chars)"
//             value={formData.pickupLocation}
//             onChange={handleChange}
//             disabled={loading}
//             maxLength={30}
//           />
//           {errors.pickupLocation && <span className="error-text">{errors.pickupLocation}</span>}
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Vehicle Number *</label>
//             <input 
//               type="text" 
//               name="vehicleNumber"
//               className={`form-input ${errors.vehicleNumber ? 'input-error' : ''}`}
//               placeholder="BA 1 KHA 1234 (max 30 chars)"
//               value={formData.vehicleNumber}
//               onChange={handleChange}
//               disabled={loading}
//               maxLength={30}
//             />
//             {errors.vehicleNumber && <span className="error-text">{errors.vehicleNumber}</span>}
//           </div>
//           <div className="form-group">
//             <label>Vehicle Type *</label>
//             <select 
//               name="vehicleType"
//               className="form-input"
//               value={formData.vehicleType}
//               onChange={handleChange}
//               disabled={loading}
//             >
//               <option value="car">Car</option>
//               <option value="bike">Bike</option>
//             </select>
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Price per Seat (NPR)</label>
//             <input 
//               type="number" 
//               name="price"
//               className={`form-input ${errors.price ? 'input-error' : ''}`}
//               placeholder="500"
//               value={formData.price}
//               onChange={handleChange}
//               disabled={loading}
//               min="0"
//               step="0.01"
//             />
//             {errors.price && <span className="error-text">{errors.price}</span>}
//           </div>
//           <div className="form-group">
//             <label>Available Seats</label>
//             <input 
//               type="number" 
//               name="availableSeats"
//               className={`form-input ${errors.availableSeats ? 'input-error' : ''}`}
//               placeholder="1-10"
//               value={formData.availableSeats}
//               onChange={handleChange}
//               disabled={loading}
//               min="1"
//               max="10"
//             />
//             {errors.availableSeats && <span className="error-text">{errors.availableSeats}</span>}
//           </div>
//         </div>

//         <div className="form-group">
//           <label>Vehicle Photo</label>
//           <input 
//             type="file" 
//             className="form-input"
//             accept="image/*"
//             onChange={handlePhotoChange}
//             disabled={loading}
//           />
//           <small className="form-help">
//             Accepted formats: JPEG, PNG, GIF, WEBP (Max size: 5MB)
//           </small>
//           {photoPreview && (
//             <div style={{ marginTop: '10px' }}>
//               <img 
//                 src={photoPreview} 
//                 alt="Vehicle preview" 
//                 style={{ 
//                   maxWidth: '200px', 
//                   maxHeight: '200px', 
//                   borderRadius: '8px',
//                   objectFit: 'cover'
//                 }} 
//               />
//             </div>
//           )}
//         </div>

//         <div className="form-group">
//           <label>Description (Optional)</label>
//           <textarea 
//             name="description"
//             className={`form-input ${errors.description ? 'input-error' : ''}`}
//             rows="4"
//             placeholder="Any additional information about the ride... (max 400 chars)"
//             value={formData.description}
//             onChange={handleChange}
//             disabled={loading}
//             maxLength={400}
//           ></textarea>
//           <small className="form-help">
//             {formData.description.length}/400 characters
//           </small>
//           {errors.description && <span className="error-text">{errors.description}</span>}
//         </div>

//         <button 
//           type="submit"
//           className="btn-submit" 
//           disabled={loading}
//         >
//           {loading ? 'Publishing Ride...' : 'Publish Ride'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddRidePage;



import { useState, useEffect } from 'react';
import { rideAPI, vehicleAPI } from '../../../services/api';
import '../../css/UpdateVehicleInfo.css'; // ✅ Import CSS for vehicle banner styles

const AddRidePage = ({ onRideAdded, onNavigate }) => {
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleProfile, setVehicleProfile] = useState(null);
  const [checkingVehicle, setCheckingVehicle] = useState(true);
  
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    time: '',
    pickupLocation: '',
    vehicleNumber: '',
    vehicleType: 'car',
    vehicleBrand: '',
    vehicleModel: '',
    description: '',
    price: '',
    availableSeats: '1'
  });
  const [vehiclePhoto, setVehiclePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [saveVehicleInfo, setSaveVehicleInfo] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ Check if user has vehicle profile on mount
  useEffect(() => {
    checkVehicleProfile();
  }, []);

  // ✅ Auto-update max seats when vehicle type changes
  useEffect(() => {
    if (formData.vehicleType === 'bike') {
      setFormData(prev => ({ ...prev, availableSeats: '1' }));
    }
  }, [formData.vehicleType]);

  const checkVehicleProfile = async () => {
    try {
      const response = await vehicleAPI.getVehicleProfile();
      
      if (response.hasVehicle) {
        setHasVehicle(true);
        setVehicleProfile(response.vehicle);
        
        // ✅ Auto-fill vehicle details
        setFormData(prev => ({
          ...prev,
          vehicleNumber: response.vehicle.vehicleNumber || '',
          vehicleType: response.vehicle.vehicleType || 'car',
          vehicleBrand: response.vehicle.vehicleBrand || '',
          vehicleModel: response.vehicle.vehicleModel || ''
        }));
        
        if (response.vehicle.vehiclePhoto) {
          setPhotoPreview(`http://localhost:5000${response.vehicle.vehiclePhoto}`);
        }
      }
    } catch (error) {
      console.error('Error checking vehicle profile:', error);
    } finally {
      setCheckingVehicle(false);
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

    // ✅ Seat validation based on vehicle type
    const seats = parseInt(formData.availableSeats);
    if (formData.vehicleType === 'bike') {
      if (seats > 1) {
        newErrors.availableSeats = 'Bikes can have maximum 1 seat only';
      }
    } else if (formData.vehicleType === 'car') {
      if (seats > 5) {
        newErrors.availableSeats = 'Cars can have maximum 5 seats only';
      }
    }

    if (!seats || seats < 1) {
      newErrors.availableSeats = 'At least 1 seat is required';
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
      formDataToSend.append('availableSeats', parseInt(formData.availableSeats));
      
      // ✅ Add vehicle info if saving
      if (!hasVehicle && saveVehicleInfo) {
        formDataToSend.append('saveVehicle', 'true');
        if (formData.vehicleBrand) formDataToSend.append('vehicleBrand', formData.vehicleBrand.trim());
        if (formData.vehicleModel) formDataToSend.append('vehicleModel', formData.vehicleModel.trim());
      }
      
      if (vehiclePhoto) formDataToSend.append('vehiclePhoto', vehiclePhoto);

      console.log('📤 Submitting ride...');
      
      const response = await rideAPI.addRide(formDataToSend);
      
      console.log('✅ Ride posted successfully:', response);
      
      let successMessage = 'Ride posted successfully! 🎉';
      if (response.vehicleSaved) {
        successMessage += ' Your vehicle information has been saved for future rides.';
        // Refresh vehicle profile
        await checkVehicleProfile();
      }
      
      setMessage({ type: 'success', text: successMessage });
      
      // Reset form
      setFormData({
        from: '',
        to: '',
        date: '',
        time: '',
        pickupLocation: '',
        vehicleNumber: hasVehicle ? vehicleProfile.vehicleNumber : '',
        vehicleType: hasVehicle ? vehicleProfile.vehicleType : 'car',
        vehicleBrand: hasVehicle ? vehicleProfile.vehicleBrand : '',
        vehicleModel: hasVehicle ? vehicleProfile.vehicleModel : '',
        description: '',
        price: '',
        availableSeats: '1'
      });
      setVehiclePhoto(null);
      if (!hasVehicle) {
        setPhotoPreview(null);
      }
      setSaveVehicleInfo(false);
      
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
      
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

  if (checkingVehicle) {
    return (
      <div className="add-ride-page">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  return (
    <div className="add-ride-page">
      <div className="page-header">
        <h1>Add New Ride</h1>
        <p>Offer a ride to fellow travelers</p>
      </div>

      {/* ✅ Vehicle Profile Banner */}
      {hasVehicle && vehicleProfile && (
        <div className="vehicle-banner success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: '24px', height: '24px' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="vehicle-banner-content">
            <div>
              <strong>Using saved vehicle:</strong> {vehicleProfile.vehicleNumber} ({vehicleProfile.vehicleType})
              {vehicleProfile.vehicleBrand && ` - ${vehicleProfile.vehicleBrand}`}
              {vehicleProfile.vehicleModel && ` ${vehicleProfile.vehicleModel}`}
            </div>
            {onNavigate && (
              <button 
                type="button" 
                className="edit-vehicle-link"
                onClick={() => onNavigate('update-vehicle-info')}
              >
                Edit Vehicle Info
              </button>
            )}
          </div>
        </div>
      )}

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

        {/* ✅ Vehicle Information Section */}
        <div className="form-section">
          <h3>Vehicle Information</h3>
          
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
                disabled={loading || hasVehicle}
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
                disabled={loading || hasVehicle}
              >
                <option value="car">Car</option>
                <option value="bike">Bike</option>
              </select>
            </div>
          </div>

          {/* ✅ Show brand/model only if no vehicle profile */}
          {!hasVehicle && (
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
                  disabled={loading}
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
                  disabled={loading}
                  maxLength={50}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Vehicle Photo {hasVehicle && '(Optional - leave empty to use saved photo)'}</label>
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

          {/* ✅ Save Vehicle Checkbox - only for first time */}
          {!hasVehicle && (
            <div className="form-group">
              <label className="checkbox-label">
                <input 
                  type="checkbox"
                  checked={saveVehicleInfo}
                  onChange={(e) => setSaveVehicleInfo(e.target.checked)}
                  disabled={loading}
                />
                <span>Save this vehicle information for future rides</span>
              </label>
            </div>
          )}
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
            <label>
              Available Seats * 
              {formData.vehicleType === 'bike' && ' (Max: 1)'}
              {formData.vehicleType === 'car' && ' (Max: 5)'}
            </label>
            <input 
              type="number" 
              name="availableSeats"
              className={`form-input ${errors.availableSeats ? 'input-error' : ''}`}
              placeholder={formData.vehicleType === 'bike' ? '1' : '1-5'}
              value={formData.availableSeats}
              onChange={handleChange}
              disabled={loading || formData.vehicleType === 'bike'}
              min="1"
              max={formData.vehicleType === 'bike' ? 1 : 5}
            />
            {errors.availableSeats && <span className="error-text">{errors.availableSeats}</span>}
          </div>
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