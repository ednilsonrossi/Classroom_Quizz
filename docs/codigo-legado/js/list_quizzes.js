document.addEventListener('DOMContentLoaded', () => {

    async function loadQuizzes() {
        try {
            const relativePath = "/api/quizzes/list";
            const absoluteUrl = window.location.origin + relativePath;
            const res = await fetch(absoluteUrl);

            if (!res.ok) {
                throw new Error("Erro ao carregar quizzes");
            }

            const quizzes = await res.json();
            renderQuizzes(quizzes);
        } catch (err) {
            console.error(err);
            showError();
        }
    }

    function renderQuizzes(quizzes) {
        const container = document.querySelector(".quizzes-container");
        container.innerHTML = "";
        container.innerHTML = '<h1>Meus Quizzes</h1>';

        if (quizzes.length === 0) {
            container.innerHTML = "<p>Nenhum quiz encontrado.</p>";
            return;
        }

        quizzes.forEach((value, index) => {
            const div = document.createElement("div");
            div.classList.add("quiz-card");
            console.log(value, index)
            div.innerHTML += `
                <hr>
                <h3>${value.titulo}</h3>
                <p>${value.questoes.length} questões</p>
                <button data-id="${value.id}" class="btn-ver btn btn-success">Visualizar</button>
                <button data-id="${value.id}" class="btn-excluir btn btn-danger">Excluir</button>
                <hr>
            `;

            const btnDelete = div.querySelector('.btn-excluir')
            btnDelete.addEventListener('click', () => {
                deleteQuiz(value.id);
            });
            const btnView = div.querySelector('.btn-ver')
            btnView.addEventListener('click', () => {
                window.location.href = `/home/view/${value.id}`;
            })

            container.appendChild(div);
        });
    }

    async function deleteQuiz(id) {
        if (!confirm("Tem certeza que deseja excluir este quiz?")) return;

        const relativePath = `/api/quizzes/delete/${id}`;
        const absoluteUrl = window.location.origin + relativePath;
        const res = await fetch(absoluteUrl, {
            method: 'DELETE'
        });

        if (res.ok) {
            loadQuizzes();
        } else {
            alert('Erro ao excluir quiz');
        }
    }

    function showError() {
        const container = document.getElementById("quizzes-container");
        container.innerHTML = "<p>Erro ao carregar quizzes.</p>";
    }

    loadQuizzes();
})
