document.addEventListener('DOMContentLoaded', () => {
    //Array que armazena as questões do quiz, enquanto o usuario edita.
    let quizQuestions = []; 
    
    // Índice da questão que está sendo exibida
    let currentQuestionIndex = 0; 
    
    const questionContainer = document.getElementById('current-question-container');
    const prevBtn = document.getElementById('prev-question-btn');
    const nextBtn = document.getElementById('next-question-btn');
    const addQuestionBtn = document.getElementById('new-question-btn');
    const saveBtn = document.getElementById('save-quiz-btn');
    
    // Referência aos templates HTML (os modelos invisíveis)
    const questionTemplate = document.getElementById('question-slide-template');
    const alternativeTemplate = document.getElementById('alternative-template');

    // Renderiza o template da questão sem valores ou com valores default
    addQuestion();

    // Função de Anterior e Próximo aos botões
    prevBtn.addEventListener('click', () => navigateQuestions(-1));
    nextBtn.addEventListener('click', () => navigateQuestions(1));

    // Salva o slide atual no array e cria uma nova questão em branco
    addQuestionBtn.addEventListener('click', addQuestion);
    
    // Salva o último slide e adiciona no array, depois envia como JSON para a API.
    saveBtn.addEventListener('click', finalizeAndSave); 
    
    //Salva os dados do slide atual no array sempre antes de mudar de slide
    function saveSlideAndValidate() {
        if (quizQuestions.length === 0){
            return true;
        } 
        
        const currentItem = quizQuestions[currentQuestionIndex];
        const slide = questionContainer.querySelector('.question-slide');

        // Se o slide não existir na tela, não há nada para salvar
        if (!slide){ 
            return true;
        };

        currentItem.texto = slide.querySelector('.question-text-input').value.trim();
        currentItem.descricao = slide.querySelector('.question-description-input').value.trim() || '';
        currentItem.ponto = parseInt(slide.querySelector('.question-points-input').value) || 10;
        currentItem.tempo = parseInt(slide.querySelector('.question-time-input').value) || 30;
        currentItem.tipo_pergunta = slide.querySelector('.question-type-input').value;
        
        if (currentItem.texto === '') {
            alert("O campo 'Texto da Pergunta' é obrigatório. Por favor, preencha.");
            slide.querySelector('.question-text-input').focus();
            return false;
        }

        //Pega todas as alternativas e salva em uma lista
        const alternativeItems = slide.querySelectorAll('.alternative-item');

        // Atualiza o estado das alternativas caso o usuario tenha adicionado ou removido alternativas
        currentItem.alternativas = [];

        //Rastreia se ficou alguma alternativa vazia, nula.
        let requiredFieldsMissing = false

        alternativeItems.forEach(item => {
            const textInput = item.querySelector('.alternative-text-input');
            const correctCheck = item.querySelector('.alternative-is-correct');
            const textValue = textInput.value.trim();

            //Se a alternativa está na tela, deve ser preenchida obrigatoriamente.
            if (textValue === ''){
                requiredFieldsMissing = true;
                textInput.focus();
            }

            //Salva sempre a alternativa estando vazia ou não, garante que o array reflita 100% o que está na tela (Preservação de Dados).
            currentItem.alternativas.push({
                texto: textValue,
                is_correct: correctCheck.checked
            })
        });

        if (requiredFieldsMissing) {
            alert("Todas as alternativas devem ser preenchidas. Por favor, preencha o campo em foco ou remova a alternativa vazia.");
            //Impede a navegação ou o salvamento.
            return false; 
        }
    
        // Deve haver pelo menos uma alternativa marcada como correta
        if (currentItem.alternativas.length > 0 && currentItem.alternativas.every(alt => !alt.is_correct)) {
            alert("Atenção: Você precisa marcar pelo menos uma alternativa como correta.");
            return false;
        }

        //Permitir salvar apenas se tiver 2 ou mais alternativas (Multipla Escolha)
        if (currentItem.tipo_pergunta === 'multipla_escolha') {
            const alternativasPreenchidas = currentItem.alternativas.filter(alt => alt.texto !== '');

            if (alternativasPreenchidas.length < 2) {
                alert("Questões de Múltipla Escolha devem ter pelo menos duas alternativas preenchidas.");
                return false;
            }
        }
        // Permite apenas 2 alternativas (V ou F)
        else if (currentItem.tipo_pergunta === 'verdadeiro_falso') {
            const totalAlternativas = currentItem.alternativas.length;

            if (totalAlternativas !== 2) {
                alert("Questões de Verdadeiro/Falso devem ter exatamente duas alternativas.");
                return false;
            }
        }
        return true;
    }

    //Renderiza um slide já criado
    function renderQuestion(index) {
        //Limpa o contêiner, remove o slide anterior
        questionContainer.innerHTML = ''; 
        if (index < 0 || index >= quizQuestions.length){
            return;
        }

        const questionData = quizQuestions[index];

        //Clona o template
        const newSlide = questionTemplate.content.cloneNode(true);
        const slideElement = newSlide.querySelector('.question-slide');
        
        slideElement.querySelector('.question-text-input').value = questionData.texto;
        slideElement.querySelector('.question-description-input').value = questionData.descricao || '';
        slideElement.querySelector('.question-points-input').value = questionData.ponto;
        slideElement.querySelector('.question-time-input').value = questionData.tempo;
        slideElement.querySelector('.question-type-input').value = questionData.tipo_pergunta;

        //Renderiza as Alternativas existentes
        const alternativesContainer = slideElement.querySelector('.alternatives-container');
        questionData.alternativas.forEach(alt => {
            alternativesContainer.appendChild(
                createAlternativeElement(alt.texto, alt.is_correct) 
            );
        });

        //Evento para o botão adicionar alternativa
        slideElement.querySelector('.add-alternative-btn').addEventListener('click', () => {
            addAlternativeToDOM(alternativesContainer); 
        });
        
        //Evento para o botão remover questao
        slideElement.querySelector('.remove-question-btn').addEventListener('click', removeQuestion);

        //Manipulador da mudança do tipo de pergunta
        handleQuestionTypeChange(slideElement);

        //Insere o slide na tela e atualiza a interface
        questionContainer.appendChild(slideElement);
        updateNavigationControls(index); 
    }
  
    function addQuestion() {
        //Salva o slide antes de criar um novo
        if (quizQuestions.length > 0) {
            if(!saveSlideAndValidate()){
                return;
            }
        }

        const newQuestion = {
            texto: '',
            ponto: 10,
            tempo: 60,
            tipo_pergunta: 'multipla_escolha',
            alternativas: [
                {texto: '', is_correct: false},
                {texto: '', is_correct: false},
            ]
        };
        quizQuestions.push(newQuestion);
        
        //Define o indice do array subtraindo o tamanho -1
        currentQuestionIndex = quizQuestions.length - 1; 

        //Renderiza a nova questão na tela com o indice
        renderQuestion(currentQuestionIndex);
    }
    
    //Botões (Anterior/Próximo)
    function navigateQuestions(direction) {
        if(!saveSlideAndValidate()){
            return;
        }; 

        const newIndex = currentQuestionIndex + direction;

        //Indice precisa estar entre o array
        if (newIndex >= 0 && newIndex < quizQuestions.length) {
            currentQuestionIndex = newIndex;
            renderQuestion(currentQuestionIndex);
        }
    }
    
    //Contadores de qual questão o usuário está
    function updateNavigationControls(index) {
        document.getElementById('indice_questao').textContent = index + 1;
        document.getElementById('total_indice_questoes').textContent = quizQuestions.length;

        //Desabilita Anterior se estiver na primeira questão (índice 0)
        prevBtn.disabled = index === 0;
        // Desabilita Próximo se estiver na última questão
        nextBtn.disabled = index === quizQuestions.length - 1;
    }

    function handleQuestionTypeChange(slideElement) {
        const typeSelect = slideElement.querySelector('.question-type-input');
        const alternativesContainer = slideElement.querySelector('.alternatives-container');
        const addBtn = slideElement.querySelector('.add-alternative-btn');
        
        // Esta função será disparada sempre que o tipo for alterado.
        typeSelect.addEventListener('change', () => {
            const isTrueFalse = typeSelect.value === 'verdadeiro_falso';
            
            // 1. Controle do Botão Adicionar Alternativa
            addBtn.style.display = isTrueFalse ? 'none' : ''; // Esconde se for V/F

            if (isTrueFalse) {
                const alternativeItems = alternativesContainer.querySelectorAll('.alternative-item');
                
                // 2. Garante no máximo 2 alternativas no DOM para V/F
                if (alternativeItems.length > 2) {
                    // Remove as alternativas excedentes (da 3ª em diante)
                    for (let i = 2; i < alternativeItems.length; i++) {
                        alternativeItems[i].remove();
                    }
                    // Dispara o salvamento para atualizar o array (remove o dado da memória)
                    saveSlideAndValidate(); 
                }
            }
        });
    }

    //Template de Alternativa preenchido
    function createAlternativeElement(texto = '', is_correct = false) {

        const altClone = alternativeTemplate.content.cloneNode(true);
        const altElement = altClone.querySelector('.alternative-item');
        
        altElement.querySelector('.alternative-text-input').value = texto;
        altElement.querySelector('.alternative-is-correct').checked = is_correct;
        
        //Botão remover alternativa
        altElement.querySelector('.remove-alternative-btn').addEventListener('click', (e) => {
            e.preventDefault()
            removeAlternativeFromDOM(altElement); 
        });
        return altElement;
    }

    //Nova alternativa
    function addAlternativeToDOM(alternativesContainer) {
        alternativesContainer.appendChild(createAlternativeElement());
    }
    
    //Remove a alternativa e salva o estado
    function removeAlternativeFromDOM(alternativeElement) {
         const alternativesContainer = alternativeElement.parentElement;
        
        if (alternativesContainer.querySelectorAll('.alternative-item').length <= 2) {
            alert("Cada questão deve ter pelo menos duas alternativas.");
            return;
        }
    
        alternativeElement.remove();
        saveSlideAndValidate(); 
    }
    
    //Remove a questão atual e renderiza a proxima questao
    function removeQuestion() {
        if (quizQuestions.length <= 1) {
             alert("O quiz deve ter pelo menos uma questão.");
             return;
        }
        
        quizQuestions.splice(currentQuestionIndex, 1); 
        
        if (currentQuestionIndex >= quizQuestions.length) {
            currentQuestionIndex = quizQuestions.length - 1;
        }
        renderQuestion(currentQuestionIndex);
    }
  
    //Coleta todos os dados e envia o JSON para a API.
    async function finalizeAndSave() {
        if(!saveSlideAndValidate()) {
            return; 
        }
        
        const titulo = document.getElementById('titulo').value.trim();
        const pastaId = document.getElementById('pasta-id-input').value || null;

        if(!titulo) {
            alert("O Quiz precisa de um Título.");
            return;
        }

        if(quizQuestions.length === 0) {
            alert("Adicione pelo menos uma questão ao quiz.");
            return;
        }
        
        //Pega a Questoes que não foram preenchidas
        const indexDoErro = quizQuestions.findIndex(q => q.texto.trim() === '');

        if (indexDoErro !== -1) {
            alert(`Não é possível salvar: A Questão ${indexDoErro + 1} está vazia. Por favor, preencha ou remova a questão.`);

            //força o usuario a ir na questão com erro
            currentQuestionIndex = indexDoErro;
            renderQuestion(currentQuestionIndex);

            return;
        }
       
        const questoesValidas = quizQuestions;

        //JSON
        const dados = {
            titulo: titulo,
            pasta_id: pastaId, 
            questoes: questoesValidas 
        };
        
        const relativePath = "/api/quizzes/create";
        const absoluteUrl = window.location.origin + relativePath;

        try {
            const response = await fetch(absoluteUrl, {
            method: 'POST',
            body: JSON.stringify(dados), 
            headers: { 'Content-Type': 'application/json' } 
        });

            if (response.ok) {
                const result = await response.json();
                alert('Quiz salvo e finalizado com sucesso! ID: ' + (result.quiz.id || 'N/A'));
            } else {
                const error = await response.json();
                alert('Erro ao salvar o Quiz: ' + (error.erro || response.statusText));
            }
        } catch (error) {
            console.error('Erro de rede:', error);
            alert('Falha na conexão com o servidor. Tente novamente.');
        }
    }
});