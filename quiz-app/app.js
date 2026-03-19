let examData = null;
let timerInterval = null;
let timeRemaining = 0;
let isPaginationView = false;
let currentQuestionIndex = 0;

const screens = {
    loading: document.getElementById('loading'),
    selection: document.getElementById('selection-screen'),
    start: document.getElementById('start-screen'),
    study: document.getElementById('study-screen'),
    exam: document.getElementById('exam-screen'),
    result: document.getElementById('result-screen')
};

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    if (screens[screenName]) {
        screens[screenName].classList.add('active');
    }
}

// Algoritmo Fisher-Yates para barajar (random order)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    let newArray = [...array];
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
}

async function loadExamList() {
    try {
        const response = await fetch('./json/exams.json');
        if (!response.ok) {
            return loadSpecificExam('examen.json');
        }
        const exams = await response.json();
        
        const listContainer = document.getElementById('exams-list');
        listContainer.innerHTML = '';
        
        exams.forEach(exam => {
            const btn = document.createElement('button');
            btn.className = 'btn secondary-btn';
            btn.style.textAlign = 'left';
            btn.style.padding = '1.25rem';
            btn.innerHTML = `<strong>${exam.titulo}</strong><br><span style="opacity:0.7; font-size: 0.85em;">Archivo: ${exam.archivo}</span>`;
            btn.addEventListener('click', () => loadSpecificExam(exam.archivo));
            listContainer.appendChild(btn);
        });
        
        showScreen('selection');
    } catch (error) {
        console.error("No se encontró exams.json. Cargando examen por defecto.", error);
        loadSpecificExam('examen.json');
    }
}

async function loadSpecificExam(filename) {
    showScreen('loading');
    document.getElementById('loading-text').textContent = `Cargando ${filename}...`;
    try {
        const response = await fetch(`./json/${filename}`);
        if (!response.ok) {
            throw new Error(`No se pudo cargar el archivo ${filename}.`);
        }
        const data = await response.json();
        examData = data.examen;
        initStartScreen();
    } catch (error) {
        console.error("Error loading JSON:", error);
        document.querySelector('.loader').style.display = 'none';
        document.getElementById('loading-text').innerHTML = `
            <span style="color: var(--error-color);">Error cargando ${filename}.</span><br>
            Asegúrate de ejecutar esta página a través de un servidor web (ej. Live Server).
        `;
    }
}

function initStartScreen() {
    document.getElementById('quiz-title').textContent = examData.titulo || 'Examen';
    document.getElementById('quiz-desc').textContent = examData.descripcion || 'Por favor, completa el cuestionario.';
    
    document.getElementById('time-limit').innerHTML = `🕒 ${examData.configuracion.tiempo_limite_minutos} min.`;
    document.getElementById('pass-score').innerHTML = `🎯 Aprobar con ${examData.configuracion.puntuacion_minima_aprobado}%`;
    
    document.getElementById('start-btn').addEventListener('click', startExam);
    document.getElementById('study-btn').addEventListener('click', showStudyScreen);
    document.getElementById('back-to-start-btn').addEventListener('click', () => showScreen('start'));
    showScreen('start');
}

function showStudyScreen() {
    const container = document.getElementById('study-container');
    container.innerHTML = '';
    
    examData.preguntas.forEach((q, index) => {
        let correctText = '';
        if (q.tipo === 'seleccion_multiple') {
            const correctOpts = q.opciones.filter(opt => q.respuesta_correcta.includes(opt.id)).map(opt => opt.texto);
            correctText = correctOpts.join(', ');
        } else {
            const correctOpt = q.opciones.find(opt => opt.id === q.respuesta_correcta);
            correctText = correctOpt ? correctOpt.texto : '';
        }
        
        container.innerHTML += `
            <div class="feedback-item correct">
                <p class="feedback-question">${index + 1}. ${q.enunciado}</p>
                <p class="feedback-explanation">
                    <strong style="color: var(--success-color);">Respuesta Correcta:</strong> ${correctText}
                    <br><br>
                    <em style="opacity: 0.8;">${q.explicacion}</em>
                </p>
            </div>
        `;
    });
    
    showScreen('study');
}

function startExam() {
    document.getElementById('exam-title-header').textContent = examData.titulo || 'Examen';
    renderQuestions();
    showScreen('exam');
    
    timeRemaining = examData.configuracion.tiempo_limite_minutos * 60;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const timerElement = document.getElementById('timer');
    timerElement.textContent = display;
    
    // Cambiar color cuando queda menos de 1 minuto
    if (timeRemaining < 60) {
        timerElement.style.color = 'var(--error-color)';
        timerElement.style.background = 'rgba(239, 68, 68, 0.1)';
        timerElement.style.borderColor = 'rgba(239, 68, 68, 0.3)';
    } else {
        timerElement.style.color = 'var(--accent-color)';
        timerElement.style.background = 'rgba(99, 102, 241, 0.1)';
        timerElement.style.borderColor = 'rgba(99, 102, 241, 0.2)';
    }
}

function renderQuestions() {
    const container = document.getElementById('questions-container');
    container.innerHTML = '';
    
    let questions = examData.preguntas;
    if (examData.configuracion.orden_aleatorio) {
        questions = shuffle(questions);
    }
    
    questions.forEach((q, index) => {
        const qCard = document.createElement('div');
        qCard.className = 'question-card';
        
        const qText = document.createElement('h3');
        qText.className = 'question-text';
        qText.textContent = `${index + 1}. ${q.enunciado}`;
        qCard.appendChild(qText);
        
        const optionsGrid = document.createElement('div');
        optionsGrid.className = 'options-grid';
        
        // Barajar opciones si es necesario
        let opciones = q.opciones;
        if (examData.configuracion.orden_aleatorio) {
            opciones = shuffle(opciones);
        }
        
        const inputType = q.tipo === 'seleccion_multiple' ? 'checkbox' : 'radio';
        
        opciones.forEach(opt => {
            const label = document.createElement('label');
            label.className = 'option-label';
            
            const input = document.createElement('input');
            input.type = inputType;
            input.name = `question-${q.id}`;
            input.value = opt.id;
            input.className = 'option-input';
            
            label.appendChild(input);
            label.appendChild(document.createTextNode(opt.texto));
            
            optionsGrid.appendChild(label);
        });
        
        qCard.appendChild(optionsGrid);
        
        // Botón de validación individual
        const validateBtn = document.createElement('button');
        validateBtn.type = 'button';
        validateBtn.className = 'btn secondary-btn validate-btn';
        validateBtn.textContent = 'Validar';
        validateBtn.style.marginTop = '1rem';
        validateBtn.style.padding = '0.5rem 1rem';
        validateBtn.style.fontSize = '0.9rem';
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'inline-feedback';
        feedbackDiv.style.marginTop = '1rem';
        feedbackDiv.style.display = 'none';

        validateBtn.addEventListener('click', () => {
            const userAnswers = Array.from(qCard.querySelectorAll('input:checked')).map(input => input.value);
            if (userAnswers.length === 0) return;
            
            let isCorrect = false;
            let partialScore = 0;
            let statusText = '';
            
            if (q.tipo === 'seleccion_multiple') {
                const correctAnswers = q.respuesta_correcta;
                let hits = 0;
                let mistakes = 0;
                userAnswers.forEach(ans => {
                    if (correctAnswers.includes(ans)) hits++;
                    else mistakes++;
                });
                
                partialScore = (hits - mistakes) / correctAnswers.length;
                if (partialScore < 0) partialScore = 0;
                
                if (partialScore === 1) {
                    isCorrect = true;
                    statusText = '✅ Correcto';
                } else if (partialScore > 0) {
                    statusText = `⚠️ Parcialmente Correcto (${Math.round(partialScore * 100)}%)`;
                } else {
                    statusText = '❌ Incorrecto';
                }
            } else {
                if (userAnswers.length > 0 && userAnswers[0] === q.respuesta_correcta) {
                    isCorrect = true;
                    partialScore = 1;
                    statusText = '✅ Correcto';
                } else {
                    statusText = '❌ Incorrecto';
                }
            }

            const allInputs = qCard.querySelectorAll('input');
            allInputs.forEach(input => input.disabled = true);
            validateBtn.disabled = true;
            validateBtn.style.opacity = '0.5';

            let correctText = '';
            if (q.tipo === 'seleccion_multiple') {
                const correctOpts = q.opciones.filter(opt => q.respuesta_correcta.includes(opt.id)).map(opt => opt.texto);
                correctText = correctOpts.join(', ');
            } else {
                const correctOpt = q.opciones.find(opt => opt.id === q.respuesta_correcta);
                correctText = correctOpt ? correctOpt.texto : '';
            }

            const showCorrect = !isCorrect;

            feedbackDiv.style.display = 'block';
            feedbackDiv.innerHTML = `
                <div class="feedback-item ${isCorrect ? 'correct' : ''}" style="margin-bottom: 0; padding: 1rem; ${partialScore > 0 && !isCorrect ? 'border-left: 5px solid #f59e0b;' : ''}">
                    <p class="feedback-explanation">
                        <strong>${statusText}</strong>
                        ${showCorrect ? `<br><strong style="color: var(--success-color);">Respuesta esperada:</strong> ${correctText}` : ''}
                        <br><br>
                        <em>${q.explicacion || ''}</em>
                    </p>
                </div>
            `;
        });

        qCard.appendChild(validateBtn);
        qCard.appendChild(feedbackDiv);
        
        container.appendChild(qCard);
    });
    
    currentQuestionIndex = 0;
    renderTracker();
    setupAnswerListeners();
    updateViewMode();
}

document.getElementById('exam-form').addEventListener('submit', (e) => {
    e.preventDefault();
    submitExam();
});

function submitExam() {
    clearInterval(timerInterval);
    
    let score = 0;
    let maxScore = examData.preguntas.length;
    let feedbackHTML = '';
    
    const formData = new FormData(document.getElementById('exam-form'));
    
    examData.preguntas.forEach(q => {
        // Leer directamente del DOM para capturar también los inputs deshabilitados (validados)
        const checkedInputs = document.querySelectorAll(`input[name="question-${q.id}"]:checked`);
        const userAnswers = Array.from(checkedInputs).map(input => input.value);
        
        let isCorrect = false;
        let partialScore = 0;
        let statusText = '';
        
        if (q.tipo === 'seleccion_multiple') {
            const correctAnswers = q.respuesta_correcta;
            let hits = 0;
            let mistakes = 0;
            userAnswers.forEach(ans => {
                if (correctAnswers.includes(ans)) hits++;
                else mistakes++;
            });
            
            partialScore = (hits - mistakes) / correctAnswers.length;
            if (partialScore < 0) partialScore = 0;
            
            if (partialScore === 1) {
                isCorrect = true;
                statusText = '✅ Correcto';
            } else if (partialScore > 0) {
                statusText = `⚠️ Parcialmente Correcto (${Math.round(partialScore * 100)}%)`;
            } else {
                statusText = '❌ Incorrecto';
            }
        } else {
            if (userAnswers.length > 0 && userAnswers[0] === q.respuesta_correcta) {
                isCorrect = true;
                partialScore = 1;
                statusText = '✅ Correcto';
            } else {
                statusText = '❌ Incorrecto';
            }
        }
        
        score += partialScore;
        
        if (examData.configuracion.mostrar_retroalimentacion) {
            let userText = 'Ninguna';
            if (userAnswers.length > 0) {
                const userOpts = q.opciones.filter(opt => userAnswers.includes(opt.id)).map(opt => opt.texto);
                userText = userOpts.join(', ');
            }

            let correctText = '';
            if (q.tipo === 'seleccion_multiple') {
                const correctOpts = q.opciones.filter(opt => q.respuesta_correcta.includes(opt.id)).map(opt => opt.texto);
                correctText = correctOpts.join(', ');
            } else {
                const correctOpt = q.opciones.find(opt => opt.id === q.respuesta_correcta);
                correctText = correctOpt ? correctOpt.texto : '';
            }

            const showCorrect = !isCorrect;

            let extraInfo = `
                <br><br>
                <strong style="color: rgba(255, 255, 255, 0.7);">Tu respuesta:</strong> ${userText}
                ${showCorrect ? `<br><strong style="color: var(--success-color);">Respuesta esperada:</strong> ${correctText}` : ''}
            `;

            feedbackHTML += `
                <div class="feedback-item ${isCorrect ? 'correct' : ''}" style="${partialScore > 0 && !isCorrect ? 'border-left: 5px solid #f59e0b;' : ''}">
                    <p class="feedback-question">${q.enunciado}</p>
                    <p class="feedback-explanation">
                        <strong>${statusText}</strong>${extraInfo}
                        <br><br>
                        <em>${q.explicacion}</em>
                    </p>
                </div>
            `;
        }
    });
    
    const percentage = Math.round((score / maxScore) * 100);
    const passed = percentage >= examData.configuracion.puntuacion_minima_aprobado;
    
    // Animar la puntuación
    const scoreTextElement = document.getElementById('score-text');
    let currentPercentage = 0;
    const animationInterval = setInterval(() => {
        if (currentPercentage >= percentage) {
            clearInterval(animationInterval);
            scoreTextElement.textContent = `${percentage}%`;
        } else {
            currentPercentage++;
            scoreTextElement.textContent = `${currentPercentage}%`;
        }
    }, 20);

    const scoreCircle = document.querySelector('.score-circle');
    const color = passed ? 'var(--success-color)' : 'var(--error-color)';
    scoreCircle.style.background = `conic-gradient(${color} ${percentage}%, transparent 0%)`;
    
    const msgElement = document.getElementById('result-msg');
    if (passed) {
        msgElement.textContent = '¡Aprobado!';
        msgElement.className = 'result-msg';
    } else {
        msgElement.textContent = 'No Aprobado';
        msgElement.className = 'result-msg failed';
    }
    
    document.getElementById('feedback-container').innerHTML = feedbackHTML;
    showScreen('result');
}

document.getElementById('retry-btn').addEventListener('click', () => {
    document.getElementById('exam-form').reset();
    showScreen('start');
});

const backToSelectionBtn = document.getElementById('back-to-selection-btn');
if (backToSelectionBtn) {
    backToSelectionBtn.addEventListener('click', () => {
        showScreen('selection');
    });
}

const resultToSelectionBtn = document.getElementById('result-to-selection-btn');
if (resultToSelectionBtn) {
    resultToSelectionBtn.addEventListener('click', () => {
        showScreen('selection');
    });
}

// Pagination Logic
document.getElementById('toggle-view-btn').addEventListener('click', () => {
    isPaginationView = !isPaginationView;
    document.getElementById('toggle-view-btn').textContent = isPaginationView ? 'Vista: Paginación' : 'Vista: Lista';
    updateViewMode();
});

function updateViewMode() {
    const container = document.getElementById('questions-container');
    const tracker = document.getElementById('question-tracker');
    const paginationControls = document.getElementById('pagination-controls');
    
    if (isPaginationView) {
        container.classList.add('pagination-view');
        tracker.style.display = 'flex';
        paginationControls.style.display = 'flex';
        showPaginatedQuestion(currentQuestionIndex);
    } else {
        container.classList.remove('pagination-view');
        tracker.style.display = 'none';
        paginationControls.style.display = 'none';
        
        const cards = document.querySelectorAll('.question-card');
        cards.forEach(card => card.classList.remove('active-question'));
    }
}

function showPaginatedQuestion(index) {
    const cards = document.querySelectorAll('.question-card');
    cards.forEach((card, i) => {
        if (i === index) {
            card.classList.add('active-question');
        } else {
            card.classList.remove('active-question');
        }
    });
    
    updateTrackerActiveState();
    
    document.getElementById('prev-btn').disabled = (index === 0);
    document.getElementById('next-btn').disabled = (index === cards.length - 1);
}

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showPaginatedQuestion(currentQuestionIndex);
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    const total = document.querySelectorAll('.question-card').length;
    if (currentQuestionIndex < total - 1) {
        currentQuestionIndex++;
        showPaginatedQuestion(currentQuestionIndex);
    }
});

function renderTracker() {
    const tracker = document.getElementById('question-tracker');
    tracker.innerHTML = '';
    
    const total = examData.preguntas.length;
    for(let i=0; i<total; i++) {
        const dot = document.createElement('div');
        dot.className = 'tracker-dot';
        dot.textContent = i + 1;
        dot.addEventListener('click', () => {
            currentQuestionIndex = i;
            if (isPaginationView) showPaginatedQuestion(i);
        });
        tracker.appendChild(dot);
    }
}

function updateTrackerActiveState() {
    const dots = document.querySelectorAll('.tracker-dot');
    dots.forEach((dot, i) => {
        if (i === currentQuestionIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function setupAnswerListeners() {
    const inputs = document.querySelectorAll('.option-input');
    inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const card = e.target.closest('.question-card');
            const cards = Array.from(document.querySelectorAll('.question-card'));
            const idx = cards.indexOf(card);
            
            const hasAnswer = card.querySelectorAll('input:checked').length > 0;
            const dot = document.querySelectorAll('.tracker-dot')[idx];
            if (dot) {
                if (hasAnswer) {
                    dot.classList.add('answered');
                } else {
                    dot.classList.remove('answered');
                }
            }
        });
    });
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', loadExamList);
