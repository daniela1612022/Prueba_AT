import React, { useState } from 'react';
import { FaFileUpload } from 'react-icons/fa';

function FileUploader({ onFilesUploaded }) {
  const [businessFile, setBusinessFile] = useState(null);
  const [demographicFile, setDemographicFile] = useState(null);

  const handleUpload = () => {
    if (!businessFile || !demographicFile) {
      alert("Por favor selecciona ambos archivos CSV.");
      return;
    }

    const formData = new FormData();
    formData.append("business", businessFile);
    formData.append("demographics", demographicFile);

    console.log("✔ Archivos seleccionados y enviados a App.jsx");
    onFilesUploaded(formData); // llamada al padre
  };

  return (
    <div className="notification">
      <div className="notiglow"></div>
      <div className="notiborderglow"></div>
      <div className="notititle">📂 Subir Archivos CSV</div>
      
      <div className="notibody">
        <div className="file-input">
          <label>Negocios con Licencia</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files[0];
              setBusinessFile(file);
              console.log("📁 Archivo de negocios cargado:", file?.name);
            }}
          />
        </div>

        <div className="file-input">
          <label>Datos Demográficos</label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files[0];
              setDemographicFile(file);
              console.log("📁 Archivo demográfico cargado:", file?.name);
            }}
          />
        </div>
      </div>

      <button className="upload-button" onClick={handleUpload}>
        <FaFileUpload style={{ marginRight: '0.5rem' }} />
        Enviar al análisis
      </button>
    </div>
  );
}

export default FileUploader;
