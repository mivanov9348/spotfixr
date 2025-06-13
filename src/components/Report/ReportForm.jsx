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
          Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={onInputChange}
            className="form-input"
          />
        </label>
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
