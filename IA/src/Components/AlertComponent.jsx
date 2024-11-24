
import PropTypes from 'prop-types';

const AlertPopup = ({ message, onClose }) => {
  return (
    <div className="alert-popup">
      <div className="alert-popup-content">
        <p>{message}</p>
        <button
          className="alert-popup-close-button"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

AlertPopup.propTypes = {
  message: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AlertPopup;
