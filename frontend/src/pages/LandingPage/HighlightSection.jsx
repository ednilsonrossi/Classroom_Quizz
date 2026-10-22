import { Brain, Gamepad2, BarChart3, Zap} from "lucide-react";

export default function Highlights() {

    const destaques = [
        {
            titulo: 'Estudo Divertido',
            descricao: 'Aprenda de forma mais interativa e motivadora através de quizzes gamificados.',
            icon: Gamepad2
        },
        {
            titulo: 'Feedback Imediato',
            descricao: 'Saiba na hora o que acertou e receba explicações para melhorar seu aprendizado.',
            icon: Zap

        },
        {
            titulo: 'Relatórios Completos',
            descricao: 'Professores acompanham o desempenho da turma com dados detalhados e gráficos.',
            icon: BarChart3

        },
        {
            titulo: 'Quizzes Personalizados',
            descricao: 'Crie quizzes com diferentes níveis, tempo e pontuação para cada pergunta.',
            icon: Brain
        },
    ]

  return (
    <section id="destaques" className="bg-white py-18 sm:py-18">
      <div className="mx-auto max-w-7xl px-10 lg:px-24">
        
        <div className="text-center mb-20">
          <h2 className="text-3xl font-bold tracking-tight text-emerald-700 sm:text-4xl">
            Por que escolher o Classroom Quiz?
          </h2>
          <div className="mt-4 h-1 w-20 bg-emerald-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {destaques.map((item, index) => (
            <div 
              key={index}
              className="group relative text-center bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="mb-6 inline-flex size-24 items-center justify-center rounded-2xl bg-emerald-50 transition-colors duration-300 group-hover:bg-emerald-100">
                 <item.icon className="w-16 h-16 text-emerald-700" />
              </div>

              <h3 className="text-xl font-bold text-emerald-700 mb-3">
                {item.titulo}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {item.descricao}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}