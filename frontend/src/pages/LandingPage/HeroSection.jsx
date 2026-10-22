import AppButton from "../../components/Buttons/AppButton"
import exemplo from '../../assets/exemplo.png'

export default function HeroSection() {
    return (
        <section id="início" className="relative isolate overflow-hidden bg-emerald-800 px-8 pt-8 lg:px-24">
  
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#bef264] to-[#86efac] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
                />
            </div>

            <div className="mx-auto max-w-6xl pt-20 pb-10 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-8"> 

                <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16">

                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-sm">
                            Olá, seja bem-vindo ao Classroom Quizz!
                        </h1>

                        <p className="mt-6 text-lg leading-8 text-green-50">
                            Aventure-se neste mundo de diversões jogando agora mesmo.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                            <p>Inserir código</p>
                            <AppButton variant="primary" size="lg" className='rounded-md font-mono'>Press Start</AppButton>
                            
                            
                        </div>
                    </div>

                    <div className="flex justify-center lg:justify-end relative">
                        <div className="absolute -inset-4 bg-green-500/20 rounded-full blur-xl -z-10"></div>
                        
                        <img
                            src={exemplo}
                            alt="Imagem ilustrativa"
                            className="w-32 sm:w-40 lg:w-48 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                </div>
            </div>

            <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            >
                <div
                    style={{
                        clipPath:
                            'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                    }}
                    className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 bg-gradient-to-tr from-[#bef264] to-[#86efac] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72rem]"
                />
            </div>
        </section>
    )
}