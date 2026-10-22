import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import AppButton from '../Buttons/AppButton';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import cogumelo from '../../assets/icons/cogumelo.png';

const navigation = [
  { name: 'Início', href: '#início' },
  { name: 'Destaques', href: '#destaques' },
  { name: 'Sobre', href: '#sobre' },
  { name: 'Contato', href: '#contato' },
]

export default function Navbar({className}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation();
  const isHome = location.pathname === "/";
  
  return (
    <header className={className}>
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
            
            <div className="flex lg:flex-1">
                <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Classroom Quizz</span>
                        <img src={cogumelo} alt="Logo" className="h-10 w-auto" />
                </a>
            </div>

            <div className="flex lg:hidden">
                <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white" 
                >
                    <span className="sr-only">Abrir menu principal</span>
                    <Bars3Icon aria-hidden="true" className="size-7" />
                </button>
            </div>

            <div className="hidden lg:flex lg:gap-x-12">
                {navigation.map((item) => (
                <a 
                    key={item.name} 
                    href={isHome ? item.href : `/${item.href}`} 
                    className="text-base font-bold text-white transition-colors hover:text-green-300"
                >
                    {item.name}
                </a>
                ))}
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                <AppButton variant='secondary' className='rounded-full' href={'/auth'}>Entrar</AppButton>
            </div>
        </nav>

        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
            <div className="fixed inset-0 z-50" />
            <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-between">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="sr-only">Classroom Quizz</span>
                        <img src={cogumelo} alt="Logo" className="h-10 w-auto" />
                    </a>
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:text-green-700"
                    >
                        <span className="sr-only">Fechar menu</span>
                        <XMarkIcon aria-hidden="true" className="size-7" />
                    </button>
                </div>
                <div className="mt-6 flow-root text-center">
                    <div className="-my-6 divide-y divide-gray-500/10">
                        <div className="space-y-2 py-6">
                            {navigation.map((item) => (
                                <a
                                key={item.name}
                                href={isHome ? item.href : `/${item.href}`}
                                onClick={() => setMobileMenuOpen(false)}
                                className="-mx-3 block rounded-lg px-3 py-2 text-lg font-bold text-green-900 hover:bg-green-50"
                                >
                                {item.name}
                                </a>
                            ))}
                        </div>
                        <div className="py-6">
                            <a
                                href={'/auth'}
                                className="-mx-3 block rounded-lg px-3 py-2.5 text-lg font-bold bg-green-800 text-white hover:bg-green-900"
                            >
                                Entrar
                            </a>
                        </div>
                    </div>
                </div>
            </DialogPanel>
        </Dialog>
    </header>
  )
}