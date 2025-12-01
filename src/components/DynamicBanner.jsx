import { useState } from "react";

export default function DynamicBanner() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    bgColor: "bg-blue-500", // Default background color
    image: null, // Image file
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* Form Section */}
      <form className="w-full max-w-md p-4 bg-white shadow-md rounded-md">
        <label className="block mb-2">Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Subtitle:</label>
        <input
          type="text"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2">Background Color:</label>
        <select
          name="bgColor"
          value={formData.bgColor}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="bg-blue-500">Blue</option>
          <option value="bg-green-500">Green</option>
          <option value="bg-red-500">Red</option>
          <option value="bg-yellow-500">Yellow</option>
        </select>

        <label className="block mb-2">Upload Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full p-2 border rounded mb-4"
        />
      </form>

      {/* Dynamic Banner */}
      <div
        className={`mt-6 p-6 text-white rounded-md ${formData.bgColor} w-full max-w-md text-center relative`}
        style={{ minHeight: "200px" }}
      >
        {formData.image && (
          <img
            src={formData.image}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-40 rounded-md"
          />
        )}
        <div className="relative z-10">
          <h1 className="text-2xl font-bold">{formData.title || "Your Banner Title"}</h1>
          <p className="text-lg">{formData.subtitle || "Your Banner Subtitle"}</p>
        </div>
      </div>
    </div>
  );
}