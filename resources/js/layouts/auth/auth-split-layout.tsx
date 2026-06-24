import type { AuthLayoutProps } from '@/types';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh">
            {/* Left panel - decorative */}
            <div className="hidden lg:flex w-1/2 items-center justify-center relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #57394c, #330404)' }}
            >
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <div className="w-72 h-72 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                        <img
                            src="/images/logo.png"
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="text-center px-10">
                        <h2 className="text-2xl font-bold text-white mb-2">SISTEMA_REST</h2>
                        <p className="text-[#c6acab] text-sm">GESTION INTELIGENTE RESTAURANTE</p>
                    </div>
                </div>
            </div>

            {/* Right panel - form */}
            <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-10"
                style={{ backgroundColor: '#f5efef' }}
            >
                <div className="w-full max-w-sm">
                    <div className="bg-white rounded-2xl shadow-lg border border-[#d6cdcd]/50 px-8 py-10">
                        <div className="flex flex-col items-center gap-2 mb-6">
                            <div className="lg:hidden mb-2 flex h-16 w-16 items-center justify-center rounded-xl overflow-hidden shadow-md"
                                style={{ background: 'linear-gradient(135deg, #57394c, #330404)' }}
                            >
                                <img
                                    src="/images/logo.png"
                                    alt="Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h1 className="text-xl font-bold text-[#330404] text-center">{title}</h1>
                            {description && (
                                <p className="text-sm text-[#856868] text-center">{description}</p>
                            )}
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
