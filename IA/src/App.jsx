import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "primereact/button";
import Modal from "react-modal";
import ScanResult from "../src/Components/Result";
import AlertPopup from "../src/Components/AlertComponent";
import "./App.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

Modal.setAppElement("#root");

function App() {
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [shake, setShake] = useState(false);

  const handleButtonClick = () => {
    setShake(true);
    setTimeout(() => {
      setShake(false);
    }, 500);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setSelectedFile(file);
        setImageUrl(reader.result);
        setErrorMessage("");
      };
    } else {
      setShowAlert(true);
      console.error("Por favor, seleccione un archivo de imagen JPG o PNG.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/jpeg, image/png",
  });

  const handleScanClick = async () => {
    if (!selectedFile) {
      setErrorMessage("Por favor, suba una imagen para escanear.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("http://localhost:8001/predict", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Resultado del escaneo:", result);
        setScanResult(result);
        setModalIsOpen(true);
      } else {
        console.error("Error en el escaneo");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
    window.location.reload();
  };

  return (
    <div
      id="Pagina"
      className="bg-cover bg-fondo1 h-screen w-screen flex flex-col items-center font-sans"
    >
      <h1 className="text-3xl font-sans underline w-full h-20 bg-white flex items-center justify-start border border-cyan-600">
        <img
          className="h-28"
          src="/grape_logo_transparent.png"
          alt="GrapeSense Logo"
        />
        GrapeSense
      </h1>
      <div className="flex-grow flex flex-col justify-center items-center w-full relative">
        <div className="bg-origin-padding flex flex-col justify-center items-center w-[600px] h-96 bg-green-50 rounded-2xl relative opacity-50">
          <div
            {...getRootProps({ className: "dropzone" })}
            className="absolute inset-0 flex flex-col justify-center items-center cursor-pointer"
          >
            <p className="pi pi-plus-circle text-3xl"></p>
            <br />
            <input {...getInputProps()} />
            {!imageUrl && (
              <p className="font-bold text-black text-w">
                Arrastra y suelta una imagen aquí,
                <br />o haz clic para seleccionar una imagen
              </p>
            )}
          </div>
        </div>
        {imageUrl && (
          <div className="absolute w-[600px] h-[420px] flex justify-center items-center mb-14">
            <img
              src={imageUrl}
              alt="Uploaded"
              className="max-w-full h-[300px] object-contain"
            />
          </div>
        )}
        <Button
          label="Iniciar Escaneo"
          icon="pi pi-search"
          className="mt-4 p-4 bg-gray-500 text-white opacity-70 rounded-xl drop-shadow-lg"
          onClick={handleScanClick}
        />
        {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Resultado del Escaneo"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="flex flex-col items-center">
          {scanResult && (
            <>
              <div className="w-full p-4">
                <ScanResult imageUrl={imageUrl} data={scanResult} />
              </div>
            </>
          )}
          <Button
            label="Nuevo Escaneo"
            className={`font-bold p-4 mt-4 bg-green-600 text-white rounded-xl drop-shadow-lg ${
              shake ? "shake" : ""
            }`}
            onClick={() => {
              handleButtonClick();
              handleCloseModal();
            }}
          />
        </div>
      </Modal>
      {showAlert && (
        <AlertPopup
          message="Por favor, seleccione un archivo de imagen JPG o PNG."
          onClose={() => setShowAlert(false)}
        />
      )}
    </div>
  );
}

export default App;
