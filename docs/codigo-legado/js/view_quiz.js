const quizId = window.location.pathname.split("/").pop();

async function loadQuiz() {
    const res = await fetch(`/api/quizzes/view/${quizId}`);
    const quiz = await res.json();
    renderQuiz(quiz);
}

function renderQuiz(quiz) {
    const container = document.querySelector(".view-quiz");

    container.innerHTML = `
    <h1>${quiz.titulo}</h1>
    <p>${quiz.questoes.length} questões</p>
  `;

    quiz.questoes.forEach((q, i) => {
        const div = document.createElement("div");
        div.innerHTML = `
      <hr>
      <h3>${i + 1}. ${q.texto}</h3>
      <p>${q.descricao ? `Descrição: ${q.descricao}` : '' }</p>
      <h5>Pontos: ${q.ponto} <br> Tempo: ${q.tempo}</h5>
      <ul>
        ${q.alternativas.map(a => `<li>${a.texto} ${a.is_correct ? ' - Alternativa Correta' : ''}</li>`).join("")}
      </ul>
      <hr>
    `;
        container.appendChild(div);
    });
}

document.addEventListener("DOMContentLoaded", loadQuiz);
