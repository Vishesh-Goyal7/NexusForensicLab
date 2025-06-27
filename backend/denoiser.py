import sys
import cv2
import numpy as np
import base64
import tensorflow as tf
from tensorflow.keras.models import load_model

# Load model once
model = load_model('generator__model.h5')

def preprocess_image(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (128, 128))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=(0, -1))
    return img

def postprocess_image(output_array):
    image = (output_array.squeeze() * 255).astype('uint8')
    _, buffer = cv2.imencode('.png', image)
    return base64.b64encode(buffer).decode('utf-8')

def main(image_path):
    clean = preprocess_image(image_path)
    denoised = model.predict(clean)
    output_b64 = postprocess_image(denoised)
    print(output_b64, end="")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python denoise_fingerprint.py <image_path>")
        sys.exit(1)
    main(sys.argv[1])