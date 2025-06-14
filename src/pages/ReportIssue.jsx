import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import L from "leaflet";
import debounce from "../utils/debounce";
import ReportForm from "../components/Report/ReportForm";
import "../styles/ReportIssue.css";
import MapClickHandler from "../components/Map/MapClickHandler";
import MapCenter from "../components/Map/MapCenter";
import { supabase } from "../supabase/supabaseClient";
import Modal from "../components/Report/AddReportModal";

// Fix за Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function ReportIssue() {
  const [marker, setMarker] = useState(null);
  const [reports, setReports] = useState(
    JSON.parse(localStorage.getItem("reports")) || []
  );
  const [locationName, setLocationName] = useState("Loading location...");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    images: [],
    user: "",
  });
  const markerRef = useRef(null);
  const mapRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (user) setCurrentUser(user);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (mapRef.current) mapRef.current.invalidateSize();
  }, []);

  useEffect(() => {
    if (marker) {
      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${marker.lat}&lon=${marker.lng}&zoom=18&addressdetails=1`
        )
        .then((r) =>
          setLocationName(r.data.display_name || "Location not found")
        )
        .catch(() => setLocationName("Failed to fetch location"));
    }
  }, [marker]);

  useEffect(() => {
    if (searchResult) {
      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${searchResult.lat}&lon=${searchResult.lng}&zoom=18&addressdetails=1`
        )
        .then((r) =>
          setLocationName(r.data.display_name || "Location not found")
        )
        .catch(() => setLocationName("Failed to fetch location"));
    }
  }, [searchResult]);

  useEffect(() => {
    if (markerRef.current && marker) markerRef.current.openPopup();
  }, [showForm, marker]);

  const searchCity = useCallback(
    debounce((query) => {
      if (query.length < 3) return setSearchResult(null);
      axios
        .get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}`
        )
        .then((r) => {
          if (r.data.length) {
            const { lat, lon } = r.data[0];
            const pos = { lat: +lat, lng: +lon };
            setSearchResult(pos);
            setMarker(pos);
          }
        })
        .catch(() => setSearchResult(null));
    }, 500),
    []
  );

  useEffect(() => {
    searchCity(searchQuery);
  }, [searchQuery, searchCity]);

  const handleMapClick = (latlng) => {
    setMarker(latlng);
    setSearchQuery("");
    setSearchResult(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files && files.length > 0) {
      const fileArray = Array.from(files).slice(0, 3); 
      const imagePromises = fileArray.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(imagePromises).then((imageResults) => {
        setFormData((fd) => ({
          ...fd,
          images: imageResults,
          user: currentUser?.email || "Anonymous",
        }));
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCenterHandled = () => {
    setSearchResult(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({ title: "", description: "", image: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !marker) {
      alert("Моля, попълни всички полета и избери място на картата.");
      return;
    }
    const newReport = {
      id: Date.now(),
      lat: marker.lat,
      lng: marker.lng,
      address: locationName,
      title: formData.title,
      description: formData.description,
      images: formData.images, // Променено от image на images
      user: formData.user,
      timestamp: new Date().toISOString(),
    };
    const up = [...reports, newReport];
    setReports(up);
    localStorage.setItem("reports", JSON.stringify(up));
    setShowForm(false);
    setFormData({ title: "", description: "", images: [], user: "" }); // Нулиране на images
    setMarker(null);
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  return (
    <div className="page">
      <input
        type="text"
        placeholder="Search for a city..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Бутон Add Report ако има избрано място и формата не е показана */}
      {marker && !showForm && (
        <div className="add-report-button-container">
          <button
            onClick={() => setShowForm(true)}
            className="add-report-button"
          >
            Add Report
          </button>
        </div>
      )}

      {/* Модалната форма */}
      {marker && showForm && (
        <Modal onClose={handleCancel}>
          <ReportForm
            formData={formData}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            locationName={locationName}
          />
        </Modal>
      )}

      {locationName &&
        locationName !== "Loading location..." &&
        locationName !== "Failed to fetch location" && (
          <div className="selected-location">
            <p>
              <strong>Location:</strong> {locationName}
            </p>
          </div>
        )}

      <div className="map-container">
        <MapContainer
          center={[42.7339, 25.4858]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <MapCenter
            center={searchResult}
            onCenterHandled={handleCenterHandled}
          />

          {reports.map((r) => (
  <Marker key={r.id} position={[r.lat, r.lng]} icon={redIcon}>
    <Popup autoClose={false} closeOnClick={false}>
      <div>
        <h3>{r.title}</h3>
        <p>{r.description}</p>
        <p>
          <strong>Адрес:</strong> {r.address}
        </p>
        <p>
          <strong>Подадено от:</strong> {r.user}
        </p>
        <p>
          <strong>Дата:</strong> {new Date(r.timestamp).toLocaleString()}
        </p>
        {r.images && r.images.length > 0 && (
          <div className="report-images">
            {r.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Report ${index + 1}`}
                style={{
                  width: "100%",
                  maxHeight: "150px",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
            ))}
          </div>
        )}
      </div>
    </Popup>
  </Marker>
))}

          {marker && <Marker position={marker} ref={markerRef} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default ReportIssue;
