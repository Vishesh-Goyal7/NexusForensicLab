# 🔍 Reconstructing Partial Fingerprints (U-Net + PatchGAN)

This project implements a **conditional Generative Adversarial Network (cGAN)** for fingerprint image denoising using a **U-Net generator** and a **PatchGAN discriminator**, inspired by the Pix2Pix architecture. The model learns to restore clean fingerprint images from their noisy versions using adversarial training.

---

## 🧠 Model Architecture

### 🎨 Generator – U-Net
The generator is a **U-Net**, an encoder-decoder network with skip connections. It preserves low-level spatial information via direct connections from encoder to decoder layers.

- **Encoder:** Sequential Conv2D → BatchNorm → LeakyReLU → Downsampling
- **Decoder:** Conv2DTranspose → BatchNorm → ReLU → Upsampling
- **Skip Connections:** Preserve fine details across layers

### 🛡️ Discriminator – PatchGAN
The discriminator is a **PatchGAN** classifier. Instead of classifying the whole image, it classifies **each N×N patch** as real or fake (usually 70×70), encouraging sharper and more localized realism.

- Stack of Conv2D → LeakyReLU layers
- Outputs a feature map of "real/fake" decisions for image patches

---

## 🎯 Objective

To train a GAN that learns:
- From: `(noisy fingerprint image)`
- To:   `(clean fingerprint image)`

The generator tries to denoise; the discriminator judges realism.  
Together, they optimize the balance between **realism and fidelity**.

---

## 🧪 Loss Functions

| Component       | Loss Used                          |
|-----------------|------------------------------------|
| Generator       | L1 loss (MAE) + Adversarial Loss   |
| Discriminator   | Binary crossentropy (real/fake)    |
| Total Generator Loss | `λ * L1 + GAN loss` (e.g., λ = 100) |

---

## 📦 Training Setup

| Setting             | Value                      |
|---------------------|----------------------------|
| Epochs              | 100 (configurable)         |
| Image Size          | 256×256 (grayscale)        |
| Noise Type          | Gaussian (added to input)  |
| Optimizer           | Adam (lr=2e-4, β1=0.5)      |
| Batch Size          | Typically 1 or 4           |
| Generator           | U-Net with 8 down/up blocks |
| Discriminator       | PatchGAN (70×70 receptive field) |

---

---

## 🖼️ Sample Results


![alt text](image.png)
![alt text](image-1.png)

---

## 🧠 Evaluation Metrics
- L1 Loss (MAE): Measures pixel-level reconstruction accuracy
- RMSE: (optional) For numeric comparison with original
- Qualitative inspection of denoising artifacts and sharpness

---

---
## MIT License

Feel free to use this model as per your convenience and requirements. 
