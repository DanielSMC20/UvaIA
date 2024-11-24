;
import PropTypes from "prop-types";

const ScanResult = ({ imageUrl, data }) => {
  let confidence = (parseFloat(data.confidence) * 100).toFixed(2);

  return (
    <div className="flex items-center mt-4 space-x-4 w-full font-sans">
      {/* Contenedor de la Imagen */}
      <div className="w-1/2 h-80 bg-white rounded-2xl flex justify-center items-center shadow-lg">
        <img
          src={imageUrl}
          alt="Uploaded"
          className="w-auto max-h-full object-contain"
        />
      </div>

      {/* Contenedor de los Resultados */}
      <div className="w-1/2 p-4 bg-white rounded-2xl shadow-lg font-sans">
        <h2 className="text-xl font-bold">Resultado del Escaneo</h2>
        <p className="text-lg">Etiqueta: {data.class}</p>
        <p className="text-lg">Confianza: {confidence}%</p>
        <p className="text-base font-bold">Tratamiento: </p> <p className="">{data.suggestions}</p>
      </div>
    </div>
  );
};

ScanResult.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  data: PropTypes.shape({
    class: PropTypes.string.isRequired,
    confidence: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
      suggestions: PropTypes.string.isRequired,
  }).isRequired,
};

export default ScanResult;
