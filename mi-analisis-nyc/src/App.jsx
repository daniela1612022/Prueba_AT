import React, { useState } from 'react';
import FileUploader from './components/FileUploader';
import SuccessToast from './components/SuccessToast';
import Dashboard from './components/Dashboard';

function App() {
  const [toastVisible, setToastVisible] = useState(false);
  const [result, setResult] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleFiles = async (formData) => {
    try {
      const response = await fetch("http://localhost:8000/api/analyze/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
      setShowDashboard(true);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      alert("Error al procesar archivos");
    }
  };

  const handleBack = () => {
    setShowDashboard(false);
    setResult(null);
  };

  return (
    <>
      {!showDashboard ? (
        <>
          <FileUploader onFilesUploaded={handleFiles} />
          <SuccessToast visible={toastVisible} message="¡Análisis enviado correctamente!" />
        </>
      ) : (
        <Dashboard result={result} onBack={handleBack} />
      )}
    </>
  );
}

export default App;
