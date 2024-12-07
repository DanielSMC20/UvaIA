import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model("../modelo/4.keras")
CLASS_NAMES = ["Grape Black Measles", "Grape Black rot", "Grape Healthy", "Grape Isariopsis Leaf Spot", "No Son Hojas"]

SUGGESTIONS = {
    "Grape Black Measles": ["Para tratar el Black Measles en uvas, elimina el material infectado, aplica fungicidas adecuados, y mejora el drenaje y la circulación de aire con una poda adecuada. Monitorea las plantas regularmente y considera el uso de variedades resistentes. Un enfoque integrado ayudará a mantener la salud del viñedo."],
    "Grape Black rot": ["Para controlar la podredumbre negra en las uvas, retira y destruye los racimos infectados, aplica fungicidas apropiados, y asegúrate de que haya buena circulación de aire y drenaje en el viñedo. Monitorea las plantas con regularidad y elige variedades resistentes. Un enfoque integrado combinará estas estrategias para proteger la salud del viñedo."],
    "Grape Healthy": ["¡Felicidades! Tu esfuerzo y dedicación han dado sus frutos: ¡la planta está sana y fuerte! Este es el resultado de un cuidado constante y un manejo atento. Sigue así y disfrutarás de una cosecha abundante y saludable. ¡Sigue cultivando con amor y pasión!"],
    "Grape Isariopsis Leaf Spot": ["Para controlar la mancha foliar de Isariopsis en uvas, retira las hojas infectadas, aplica fungicidas específicos y mejora la circulación de aire con poda adecuada. Monitorea regularmente y elige variedades resistentes para mantener las plantas saludables."],
    "No Son Hojas": ["La imagen proporcionada no es una hoja. Por favor, proporciona una imagen de una hoja para obtener una predicción precisa. ¡Recuerda, una buena imagen es clave para un diagnóstico correcto!"]
}

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    predictions = MODEL.predict(img_batch)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    suggestions = SUGGESTIONS.get(predicted_class, [])
    return {
        'class': predicted_class,
        'confidence': float(confidence),
        'suggestions': suggestions
    }


if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=8001)
