// src/Components/NoLeafComponent.jsx
import PropTypes from "prop-types";

const NoLeafComponent = ({ data, onClose }) => {
  return (
    <div className="no-leaf-popup">
      <div className="no-leaf-popup-content">
        <h2 className="text-xl font-bold">La Imagen no representa una Hoja</h2>
        <div className="flex items-center mt-4 space-x-4 w-full font-sans">
          {/* Contenedor de la Imagen de Ejemplo */}
          <div className="w-1/2 h-80 bg-white rounded-2xl flex flex-col justify-center items-center shadow-lg">
            <h2 className="text-lg font-bold mb-2">Ejemplo de Hoja de Uva</h2>
            <img
              src="/GrapeHealthy(2).JPG" // Reemplaza con la ruta de tu imagen de ejemplo
              alt="Ejemplo de Hoja de Uva"
              className="w-auto max-h-full object-contain"
            />
          </div>
          {/* Contenedor de los Resultados */}
          <div className="w-1/2 p-4 bg-white rounded-2xl shadow-lg font-sans">

            <p className="text-base font-bold">Sugerencia: </p>
            <p className="">{data.suggestions}</p>
          </div>
        </div>
        <button
          className="no-leaf-close-button mt-4"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

NoLeafComponent.propTypes = {
  data: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default NoLeafComponent;
