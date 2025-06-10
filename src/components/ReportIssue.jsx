import { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import './ReportIssue.css';

// Fix for Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to center map on search result
function MapCenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 10);
    }
  }, [center, zoom, map]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

// Report Form component
function ReportForm({ formData, onInputChange, onSubmit, onCancel, locationName }) {
  return (
    <form onSubmit={onSubmit} className="report-form">
      <h3>Add New Report</h3>
      <p><strong>Location:</strong> {locationName}</p>
      <div className="form-group">
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            required
            className="form-input"
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            required
            className="form-textarea"
          />
        </label>
      </div>
      <div className="form-buttons">
        <button type="submit" className="form-button">Submit</button>
        <button type="button" className="form-cancel-button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

function ReportIssue() {
  const [marker, setMarker] = useState(null);
  const [reports, setReports] = useState(
    JSON.parse(localStorage.getItem('reports')) || []
  );
  const [locationName, setLocationName] = useState('Loading location...');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  // Invalidate map size to ensure proper rendering
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  // Fetch location name when marker changes
  useEffect(() => {
    if (marker) {
      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${marker.lat}&lon=${marker.lng}&zoom=18&addressdetails=1&accept-language=en`
        )
        .then((response) => {
          setLocationName(response.data.display_name || 'Location not found');
        })
        .catch(() => {
          setLocationName('Failed to fetch location');
        });
    } else {
      setLocationName('Loading location...');
    }
  }, [marker]);

  // Update popup content when showForm changes
  useEffect(() => {
    if (markerRef.current && marker) {
      markerRef.current.openPopup();
    }
  }, [showForm, marker]);

  // Debounced search for city
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const searchCity = useCallback(
    debounce((query) => {
      if (query.length < 3) {
        setSearchResult(null);
        return;
      }
      axios
        .get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&accept-language=en`
        )
        .then((response) => {
          if (response.data && response.data.length > 0) {
            const { lat, lon } = response.data[0];
            setSearchResult({ lat: parseFloat(lat), lng: parseFloat(lon) });
            setMarker({ lat: parseFloat(lat), lng: parseFloat(lon) });
          } else {
            setSearchResult(null);
          }
        })
        .catch(() => {
          setSearchResult(null);
        });
    }, 500),
    []
  );

  useEffect(() => {
    searchCity(searchQuery);
  }, [searchQuery, searchCity]);

  const handleMapClick = (latlng) => {
    setMarker(latlng);
    setSearchQuery(''); // Clear search query on map click
    setSearchResult(null); // Clear search result
    setShowForm(false); // Reset form visibility
  };

  const handleAddReportClick = () => {
    console.log('Add Report clicked, showing form, showForm:', true);
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    console.log('Cancel clicked, hiding form');
    setShowForm(false);
    setFormData({ title: '', description: '' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    if (formData.title && formData.description && marker && locationName !== 'Loading location...') {
      const newReport = {
        id: Date.now(),
        lat: marker.lat,
        lng: marker.lng,
        address: locationName,
        title: formData.title,
        description: formData.description,
      };
      console.log('New report created:', newReport);
      const updatedReports = [...reports, newReport];
      setReports(updatedReports);
      localStorage.setItem('reports', JSON.stringify(updatedReports));
      setShowForm(false);
      setFormData({ title: '', description: '' });
      setMarker(null);
      console.log('Reports updated:', updatedReports);
    } else {
      console.log('Form submission blocked: missing title, description, marker, or locationName');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="page">
      <h2>Report an Issue</h2>
      <p>Enter a city name or click on the map to mark the location of the issue.</p>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search for a city..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <div className="map-container">
        <MapContainer
          center={[42.7339, 25.4858]}
          zoom={7}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <MapCenter center={searchResult} />
          {reports.map((report) => (
            <Marker key={report.id} position={[report.lat, report.lng]}>
              <Popup autoClose={false} closeOnClick={false}>
                <div>
                  <h3>{report.title}</h3>
                  <p><strong>Address:</strong> {report.address}</p>
                  <p><strong>Description:</strong> {report.description}</p>
                  {report.image && (
                    <img
                      src={report.image}
                      alt="Issue"
                      style={{ maxWidth: '100px', maxHeight: '100px' }}
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          {marker && (
            <Marker
              key={`marker-${marker.lat}-${marker.lng}`}
              position={marker}
              ref={markerRef}
            >
              <Popup key={`popup-${showForm}`} autoClose={false} closeOnClick={false}>
                {showForm ? (
                  <ReportForm
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    locationName={locationName}
                  />
                ) : (
                  <div>
                    <p><strong>Location:</strong> {locationName}</p>
                    <p>
                      <strong>Coordinates:</strong> Lat: {marker.lat.toFixed(2)}, Lng: {marker.lng.toFixed(2)}
                    </p>
                    <button className="add-report-button" onClick={handleAddReportClick}>
                      Add Report
                    </button>
                  </div>
                )}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default ReportIssue;