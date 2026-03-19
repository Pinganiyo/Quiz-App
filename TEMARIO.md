MP2: Sistemas de Aprendizaje Automático – Tema 3
1. Introducción al Tema 3

Tema 3: Selección de algoritmos para el aprendizaje automático y proceso completo de entrenamiento, optimización y despliegue del modelo.

Índice:

Determinación del tipo de problema y del modelo

Preprocesamiento de datos

Fases del aprendizaje automático

Plataformas de aprendizaje automático

2. Determinación del tipo de problema y del modelo
2.1 Planteamiento del problema

¿Se puede resolver sin IA? (automatización, heurísticas…)

Aprendizaje supervisado: ¿existe relación entre datos y etiquetas?

Aprendizaje no supervisado: ¿se pueden observar patrones?

Definición de métricas de evaluación

Selección de posibles modelos

2.2 Disponibilidad de datos

Volumen de datos

Formatos y fuentes

Coste de obtener nuevos datos (y etiquetas)

Capacidad de procesamiento disponible

2.3 Análisis exploratorio de datos (EDA)

Tipos de datos: texto, imagen, categóricos, numéricos

Dimensionalidad (necesidad de reducción o falta de variables)

Distribución de etiquetas (datos balanceados o no)

Relaciones lineales o no lineales

Outliers e interpretabilidad

3. Preprocesamiento de datos

El 80% del éxito de un modelo depende de los datos.

3.1 Proceso general

Conexión y extracción de datos (ETL)

Revisión de calidad

Limpieza de datos

Transformación

División en training, validation y test

3.2 Fuentes de datos

Definición del modelo de datos

Datos estructurados y no estructurados

Arquitectura “medallón”: Bronze, Silver, Gold

Modelos semánticos

Data Ready for AI: los datos son el combustible de la IA

3.3 Calidad de los datos

Cantidad: volumen suficiente

Diversidad: representación del problema

Relevancia: variables útiles

Precisión: datos correctos, pocos outliers

Completitud: pocos valores faltantes

Consistencia: coherencia global

3.4 Limpieza de datos
Valores faltantes o duplicados

Eliminar datos

Imputar valores (media, KNN, etc.)

Outliers

Estadística descriptiva (IQR, percentiles)

Visualización (boxplot, scatter)

Transformaciones (log, raíz)

3.5 Selección de gráficos

Pie: proporciones

Histogram: distribución

Bar: comparación de categorías

Line: evolución temporal

Scatter: relación entre variables

Boxplot: dispersión y outliers

4. Transformación de datos
4.1 Escalado y normalización

Objetivo: llevar los datos al mismo rango

Min-Max Scaling: rango [0,1], sensible a outliers

Robust Scaling: menos sensible a outliers

Z-score: media 0, desviación estándar 1

Log normalization: reduce asimetría (no válida con valores negativos)

4.2 Codificación de variables categóricas

One-hot encoding

Label encoding

Target encoding

4.3 Feature Engineering

Transformaciones matemáticas (log, raíz, cuadrado)

Combinación de variables

Extracción de características (fecha → día de la semana)

Cálculo de estadísticos

Ejemplos:

Ritmo de navegación

Tiempo por página

Usuario recurrente

Hora y día de visita

Indicadores de comportamiento

Estadísticos agregados:

Por usuario

Por país

Por dispositivo

4.4 Reducción de dimensionalidad

Eliminación de variables irrelevantes

Correlación (Pearson)

Información mutua

Modelos: PCA, LDA, t-SNE

4.5 División del dataset

Training: 70–90%

Validation: 5–10%

Test: 5–10%

5. Fases del aprendizaje automático

Configuración del modelo

Entrenamiento y validación

Ajuste de hiperparámetros

Optimización

Despliegue y monitorización

6. Entrenamiento y validación
6.1 Clasificación binaria
Matriz de confusión:

TP, TN, FP, FN

Métricas:

Accuracy

Precision

Recall

F1-score

Curva ROC:

Eje X: FP

Eje Y: TP

AUC: calidad del modelo (más cercano a 1 es mejor)

6.2 Clasificación multiclase

Extensión de la binaria

TP, FP, FN por clase

6.3 Regresión

MSE

MAE

R² (coeficiente de determinación)

6.4 Modelos no supervisados
Reducción de dimensionalidad:

Varianza explicada

Clustering:

Índice de silueta

Índice de Dunn

Davies-Bouldin

Calinski-Harabasz

Rand ajustado

7. Regularización y mejora del modelo

Regularización:

L1 (Lasso)

L2 (Ridge)

Elastic Net

Dropout (redes neuronales)

Early stopping

Cross-validation (K-fold, Stratified)

Problemas:

Overfitting: modelo demasiado complejo

Underfitting: modelo demasiado simple

8. Ajuste de hiperparámetros

Grid Search

Random Search

Bayesian Optimization

9. Optimización del modelo

Cuantización

Pruning

Compresión:

Huffman

Pickle / Joblib

HDF5

ONNX

Optimización para hardware (GPU, TPU)

10. Despliegue y MLOps
Despliegue

Servidores en la nube

APIs

Seguridad

MLOps

Control de versiones: Git, DVC, MLflow

CI/CD: Docker, Kubernetes, Jenkins

Monitorización: Grafana, Kibana, Prometheus

11. Plataformas de Machine Learning

Scikit-learn

TensorFlow

Keras

PyTorch