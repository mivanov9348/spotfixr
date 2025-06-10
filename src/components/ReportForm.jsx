function ReportForm({ formData, onInputChange, onImageChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <h3>Add New Report</h3>
      <div>
        <label>
          Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onInputChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Image:
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={onInputChange}
            required
          />
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

export default ReportForm;