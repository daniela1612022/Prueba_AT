
# 🗽 Análisis de Negocios y Demografía de Nueva York

Este proyecto combina datos abiertos sobre negocios legalmente registrados en NYC y estadísticas demográficas por ZIP Code para generar visualizaciones interactivas que permitan identificar patrones socioeconómicos y territoriales.

## 📂 Estructura del Proyecto

```
.
├── backend/              # Backend en Django (API para análisis de CSVs)
├── frontend/             # Interfaz React (Dashboard con gráficos)
├── datasets/             # Archivos .csv utilizados para análisis (opcional)
├── notebooks/            # Exploración adicional y análisis en Jupyter Notebook
└── README.md             # Este archivo
```

## 🚀 Tecnologías Utilizadas

- **Frontend:** React + Chart.js + D3.js
- **Backend:** Django + Pandas
- **Visualizaciones:** Gráficos de barras, pastel, dispersión, radar, y mapa de calor
- **Notebook:** Exploración con Jupyter + Pandas + Matplotlib + Seaborn

---

## ⚙️ Instrucciones de instalación

### 1. Backend (Django)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

El backend quedará corriendo en: `http://localhost:8000/api/analyze/`

### 2. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

La app React se ejecuta en: `http://localhost:5173/`

---

## 🧪 ¿Cómo funciona?

1. Desde el frontend puedes cargar dos archivos `.csv`:  
   - **Demographic_Statistics_By_Zip_Code.csv**  
   - **Legally_Operating_Businesses.csv**

2. El backend en Django analiza los archivos y retorna un resumen con:
   - Número de negocios por ZIP
   - Correlaciones demográficas
   - Porcentaje de negocios operados por individuos
   - Industrias más comunes
   - Visualizaciones interactivas

3. El dashboard muestra:
   - Indicadores clave
   - Gráficos de dispersión por factores demográficos
   - Mapa de calor de correlaciones con D3.js
   - Radar chart para análisis global

---

## 📊 Ejemplo de visualización

El dashboard genera visualizaciones como estas:

- 📈 Ratio de individuos por ZIP
- 🏭 Industrias más comunes por código postal
- 📉 Relación entre negocios y asistencia pública
- 🔥 Mapa de calor de correlaciones (con D3.js)

---

## 📓 Exploración adicional

Incluye un archivo `.ipynb` con una exploración estadística más detallada que responde preguntas clave del dataset, como:
- ¿Cuál es la relación entre etnicidad y concentración de negocios?
- ¿Qué ZIPs tienen más negocios per cápita?
- ¿Qué factores tienen mayor correlación negativa?

---

## 🤝 Créditos

Desarrollado por Daniel Pinzón, como parte de una prueba técnica para el equipo **Team Talent**.  
Contacto: danispc389@gmail.com

---

## 📝 Licencia

Este proyecto se encuentra bajo la licencia MIT.
