# MP2: Sistemas de aprendizaje automático

---

## 1. Definición de redes neuronales

Una red neuronal es un modelo de aprendizaje automático que imita el funcionamiento del cerebro humano.
Está compuesta por nodos (neuronas) organizados en capas que procesan y transmiten información hasta obtener una salida final.

### Componentes principales

* **Capa de entrada**

  * Recibe los datos.
  * No realiza cálculos, solo distribuye la información.
  * Cada neurona representa una característica.

* **Capas ocultas**

  * Procesan la información.
  * No hay un número fijo de capas ni neuronas.
  * Definen el tipo de red (FNN, CNN, RNN...).

* **Capa de salida**

  * Proporciona el resultado final.
  * Depende del problema:

    * Clasificación binaria: 1 neurona
    * Clasificación multiclase: 1 neurona por clase
    * Regresión: 1 neurona

---

### Funcionamiento de una neurona

1. **Recepción de inputs**
   Valores provenientes de la capa anterior.

2. **Suma ponderada + sesgo (bias)**

   * Cada input tiene un peso.
   * Se calcula:

     * suma(input × peso) + bias
   * Los pesos y el bias se ajustan durante el entrenamiento.

3. **Función de activación**

   * Aplica una transformación no lineal.
   * Permite captar relaciones complejas.

---

### Funciones de activación

* **Sigmoide**

  * Output entre 0 y 1
  * Usada en clasificación binaria

* **Softmax**

  * Generalización de la sigmoide
  * Output: probabilidades que suman 1

* **tanh**

  * Output entre -1 y 1

* **ReLU**

  * 0 si x < 0, x si x ≥ 0
  * Muy utilizada

---

## 2. Proceso de entrenamiento

### Pasos principales

1. Inicialización de pesos y bias
2. **Forward propagation**
3. Cálculo del error
4. **Backpropagation**

---

### Inicialización

* Aleatoria con valores pequeños
* A partir de un modelo preentrenado
* Técnicas:

  * Xavier
  * He
  * LeCun

---

### Forward propagation

Los datos atraviesan la red hasta obtener una predicción.

---

### Cálculo del error

Se utilizan funciones de pérdida:

* MAE
* MSE
* Cross-entropy
* Log-loss

Objetivo: minimizar el error.

---

### Backpropagation

* Ajusta pesos y bias en función del error.
* Utiliza el gradiente de la función de pérdida.

---

### Gradient Descent

* Calcula derivadas parciales de los parámetros.
* Indica cómo modificarlos para reducir el error.

**Variantes:**

* SGD
* Mini-batch
* Momentum
* RMSprop
* Adam
* Adagrad

---

## 3. Problemas en el entrenamiento

* **Vanishing gradient**

  * Gradientes muy pequeños → aprendizaje lento

* **Exploding gradient**

  * Gradientes muy grandes → inestabilidad

* **Neuronas muertas**

  * Neuronas que no se activan

* **Overfitting**

  * El modelo memoriza los datos
  * Soluciones: dropout, reducir complejidad

* **Underfitting**

  * Modelo demasiado simple
  * Soluciones: más capas o mejores datos

---

## 4. Tipos de redes neuronales

### 4.1 Feedforward Neural Network (FNN)

* La información fluye en una sola dirección
* Útil para:

  * regresión
  * clasificación

---

### 4.2 Convolutional Neural Network (CNN)

#### Convolución

* Aplicación de filtros (kernels) sobre la imagen
* Detecta patrones locales

**Proceso:**

1. Multiplicación elemento a elemento
2. Suma de resultados
3. Desplazamiento del filtro

Resultado: mapa de características

---

#### Pooling

* Reduce la dimensión
* Mantiene la información importante

Tipos:

* Max pooling
* Average pooling

---

#### Características

* Usadas en:

  * imágenes
  * vídeo
* Alto coste computacional
* Frecuente uso de transfer learning

---

### 4.3 Recurrent Neural Network (RNN)

* Diseñadas para datos secuenciales:

  * texto
  * series temporales

#### Características

* Tienen memoria (estado oculto)
* Cada paso depende del anterior

#### Tipos

* LSTM
* GRU
* Bidirectional RNN

---

### 4.4 Autoencoders

#### Funcionamiento

* Encoder: reduce la dimensión
* Decoder: reconstruye los datos

#### Aplicaciones

* Reducción de dimensionalidad
* Detección de anomalías

#### Idea clave

* Error de reconstrucción alto = anomalía

---

## 5. IA Generativa

### Definición

Tipo de IA capaz de generar:

* texto
* imágenes
* vídeo
* código
* música

---

### Diferencias con IA tradicional

| IA tradicional                      | IA generativa                 |
| ----------------------------------- | ----------------------------- |
| Entrenada para una tarea específica | Entrenada con datos generales |
| Interacción limitada                | Lenguaje natural              |
| Modelo por aplicación               | Modelos preentrenados         |
| No generaliza                       | Zero-shot learning            |

---

## 6. LLM (Large Language Models)

* Modelos que procesan texto y generan respuestas
* Permiten:

  * conversación
  * resumen
  * clasificación
* Mantienen contexto
* Adaptan tono y estilo

---

## 7. Prompt Engineering

### Definición

Diseño de prompts para obtener mejores resultados de un LLM.

---

### Elementos de un prompt

* Instrucciones
* Preguntas
* Contexto / ejemplos

---

### Buenas prácticas

* Escribir de forma clara
* Definir objetivo
* Incluir ejemplos
* Especificar formato de salida

---

### Técnicas avanzadas

* Asignar un rol al modelo
* Chain of Thought (pasos de razonamiento)
* Controlar parámetros (creatividad)
* Pedir fuentes
* Usar lenguaje imperativo

---

## 8. Ideas clave

* Las redes neuronales aprenden ajustando pesos
* El backpropagation es fundamental
* Existen diferentes arquitecturas según el problema
* La IA generativa permite interacción en lenguaje natural
* El prompt engineering es clave para obtener buenos resultados

---