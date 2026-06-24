import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10" style={{ backgroundColor: '#f5efef' }}>
            <div className="w-full max-w-sm">
                <div className="bg-white rounded-2xl shadow-lg border border-[#d6cdcd]/50 px-8 py-10 flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-3">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-xl" style={{ background: 'linear-gradient(135deg, #57394c, #330404)' }}>
                                <span className="text-2xl">🍽️</span>
                            </div>
                            <span className="text-xl font-bold text-[#330404]">SistemaRest</span>
                        </Link>

                        <div className="space-y-1 text-center mt-1">
                            <h1 className="text-lg font-semibold text-[#330404]">{title}</h1>
                            {description && (
                                <p className="text-sm text-[#856868]">{description}</p>
                            )}
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
