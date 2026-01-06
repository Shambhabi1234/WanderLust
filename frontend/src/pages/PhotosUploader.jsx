import React, { useState } from "react";
import api from "../api/api";

export default function PhotosUploader({ photos = [], onChange }) {
  const [photoLink, setPhotoLink] = useState("");

  // ✅ Fix 1: Path corrected to avoid /api/api/upload-by-link
  async function addPhotoByLink(ev) {
    ev.preventDefault();
    if (!photoLink) return;
    
    try {
      const { data: filename } = await api.post("/upload-by-link", {
        link: photoLink,
      });
      onChange((prev) => [...prev, filename]);
      setPhotoLink("");
    } catch (e) {
      console.error("Link upload failed", e.response?.data || e.message);
    }
  }

  // ✅ Fix 2: Path corrected to avoid /api/api/upload
  function uploadPhoto(ev) {
    const files = ev.target.files;
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    api
      .post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        const { data: filenames } = response;
        onChange((prev) => [...prev, ...filenames]);
      })
      .catch((e) => {
        console.error("Local upload failed", e.response?.data || e.message);
      });
  }

  function removePhoto(ev, filename) {
    ev.preventDefault();
    onChange(photos.filter((photo) => photo !== filename));
  }

  function selectAsMainPhoto(ev, filename) {
    ev.preventDefault();
    onChange([filename, ...photos.filter((photo) => photo !== filename)]);
  }

  return (
    <>
      {/* URL INPUT SECTION */}
      <div className="flex gap-2">
        <input
          value={photoLink}
          onChange={(ev) => setPhotoLink(ev.target.value)}
          type="text"
          placeholder="Add image using link (.jpg, .png)"
          className="border p-2 rounded-2xl flex-grow"
        />
        <button
          onClick={addPhotoByLink}
          className="bg-gray-200 px-4 rounded-2xl hover:bg-gray-300 transition"
        >
          Add photo
        </button>
      </div>

      {/* PHOTO PREVIEW GRID */}
      <div className="mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {photos.length > 0 &&
          photos.map((link) => (
            <div className="relative h-32 group" key={link}>
              <img
                className="rounded-2xl w-full h-full object-cover"
                src={`http://localhost:5000/uploads/${link}`}
                alt="uploaded"
              />

              {/* DELETE BUTTON */}
              <button
                type="button"
                onClick={(ev) => removePhoto(ev, link)}
                className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white rounded-xl p-1 hover:bg-red-500"
              >
                🗑
              </button>

              {/* COVER PHOTO BUTTON */}
              <button
                type="button"
                onClick={(ev) => selectAsMainPhoto(ev, link)}
                className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white rounded-xl p-1"
              >
                {link === photos[0] ? "⭐" : "☆"}
              </button>
            </div>
          ))}

        {/* UPLOAD FROM DEVICE BUTTON */}
        <label className="h-32 cursor-pointer flex flex-col items-center justify-center border rounded-2xl text-gray-600 hover:bg-gray-50 bg-transparent">
          <input type="file" multiple className="hidden" onChange={uploadPhoto} />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
}