import "../../styles/ReportForm.css";

export default function ReportForm({
  formData,
  onInputChange,
  onSubmit,
  onCancel,
  locationName,
}) {
  return (
    <form onSubmit={onSubmit} className="report-form">
      <h3>Add New Report</h3>
      <p>
        <strong>Location:</strong> {locationName}
      </p>
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
      <div className="form-group">
        <label>
          Images (up to 3):
          <input
            type="file"
            name="image"
            accept="image/*"
            multiple // Добавено за качване на множество файлове
            onChange={onInputChange}
            className="form-input"
          />
        </label>
        {/* По желание: Предварителен преглед на избраните снимки */}
        {formData.images && formData.images.length > 0 && (
          <div className="image-preview">
            {formData.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Preview ${index + 1}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  margin: "5px",
                }}
              />
            ))}
          </div>
        )}
      </div>
      <div className="form-buttons">
        <button type="submit" className="form-button">
          Save
        </button>
        <button type="button" className="form-cancel-button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}