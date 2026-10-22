document.addEventListener('DOMContentLoaded', () => {

    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
        document.body.appendChild(modalElement);
    }

    async function loadQuestionsLibrary() {
        try{
            const relativePath = "/api/quizzes/question/library";
            const absoluteUrl = window.location.origin + relativePath;
            const res = await fetch(absoluteUrl);

            if (!res.ok) {
                throw new Error("Erro ao carregar banco de questões");
            }

            const questions = await res.json();
            renderQuestionsLibrary(questions);

        } catch (err) {
            console.error(err);
            document.querySelector('.modal-body').innerHTML = "<p>Erro ao carregar banco.</p>";
        }
    }

    function renderQuestionsLibrary(questions){
        const container = document.querySelector('.questions-library');
        container.innerHTML = '';

        if (questions.length === 0){
            container.innerHTML = "<p>Nenhuma questão encontrada.</p>";
            return;
        }

        questions.forEach( (value) => {
            const card = document.createElement('div');
            card.className = 'card-question mb-2 border rounded';
            card.style.cursor = 'pointer';
            
            card.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${value.texto}</h6>
                        <small class="text-muted">Tipo: ${value.tipo_pergunta} | Pontos: ${value.ponto}</small>
                    </div>
                    <i class="fas fa-plus-circle text-primary"></i>
                </div>
            `;

            card.addEventListener('click', () => {
                importQuestionFromLibrary(value);
            })
            container.appendChild(card);
        });
    }

    function importQuestionFromLibrary(question){

        const currentContainer = document.querySelector('#current-question-container');

        if (!currentContainer) {
            console.error("Container da questão atual não encontrado!");
            return;
        }

        currentContainer.querySelector('.question-text-input').value = question.texto;
        currentContainer.querySelector('.question-description-input').value = question.descricao || '';
        currentContainer.querySelector('.question-points-input').value = question.ponto;
        currentContainer.querySelector('.question-time-input').value = question.tempo;
        currentContainer.querySelector('.question-type-input').value = question.tipo_pergunta;

        const typeInput = currentContainer.querySelector('.question-type-input');
        typeInput.value = question.tipo_pergunta;

        const event = new Event('change');
        typeInput.dispatchEvent(event);

        const alternativesContainer = currentContainer.querySelector('.alternatives-container');
        alternativesContainer.innerHTML = '';

        question.alternativas.forEach( (alt) => {

            if (window.createAlternativeElement) {
                const altElement = window.createAlternativeElement(alt.texto, alt.is_correct);
                alternativesContainer.appendChild(altElement);
            }
        })

        const modalInstance = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
        if (modalInstance) modalInstance.hide();
    }
    loadQuestionsLibrary();
})