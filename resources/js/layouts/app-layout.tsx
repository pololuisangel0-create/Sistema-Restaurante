import { Link, usePage } from '@inertiajs/react';
import { logout, dashboard } from '@/routes';
import { index as productos } from '@/actions/App/Http/Controllers/ProductoController';
import { index as gastos } from '@/actions/App/Http/Controllers/GastoController';
import { index as reportes } from '@/actions/App/Http/Controllers/ReporteController';
import { pedidos } from '@/actions/App/Http/Controllers/CajeroController';
import { cajeros } from '@/actions/App/Http/Controllers/AdminController';
import { restaurantes } from '@/actions/App/Http/Controllers/SoporteController';
import { LogOut, Home, Package, DollarSign, Users, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface MenuItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: any[];
    children: React.ReactNode;
}) {
    const { auth } = usePage<any>().props;
    const url = usePage().url;
    const user = auth?.user;
    const [colapsado, setColapsado] = useState(false);

    const menuItems: Record<string, MenuItem[]> = {
        soporte: [
            { label: 'Restaurantes', href: restaurantes().url, icon: <Home className="w-5 h-5" /> },
        ],
        administrador: [
            { label: 'Dashboard', href: dashboard().url, icon: <Home className="w-5 h-5" /> },
            { label: 'Productos', href: productos().url, icon: <Package className="w-5 h-5" /> },
            { label: 'Gastos', href: gastos().url, icon: <DollarSign className="w-5 h-5" /> },
            { label: 'Cajeros', href: cajeros().url, icon: <Users className="w-5 h-5" /> },
            { label: 'Reportes', href: reportes().url, icon: <BarChart3 className="w-5 h-5" /> },
        ],
        cajero: [
            { label: 'Dashboard', href: dashboard().url, icon: <Home className="w-5 h-5" /> },
            { label: 'Pedidos', href: pedidos().url, icon: <Package className="w-5 h-5" /> },
        ],
    };

    const items = user ? menuItems[user.rol as keyof typeof menuItems] || [] : [];

    function esActivo(href: string): boolean {
        return url === href || url.startsWith(href + '/');
    }

    return (
        <div className="flex h-screen bg-[#f5efef]">
            {/* Sidebar */}
            <aside
                className={`bg-white border-r border-[#d6cdcd]/50 shadow-sm flex flex-col transition-all duration-300 ${
                    colapsado ? 'w-16' : 'w-64'
                }`}
            >
                {/* Header del Sidebar */}
                <div className="p-4 border-b border-[#d6cdcd]/50 relative" style={{ background: 'linear-gradient(135deg, #57394c, #330404)' }}>
                    <div className={`flex items-center gap-2 ${colapsado ? 'justify-center' : ''}`}>
                        <span className="text-2xl">🍽️</span>
                        {!colapsado && (
                            <div>
                                <h1 className="text-lg font-bold text-white">SistemaRest</h1>
                                <p className="text-[10px] text-[#c6acab]">Sistema de Gestión</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setColapsado(!colapsado)}
                        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border border-[#d6cdcd] rounded-full flex items-center justify-center shadow-sm hover:bg-[#f5efef] transition-colors"
                    >
                        {colapsado ? <ChevronRight className="w-3.5 h-3.5 text-[#57394c]" /> : <ChevronLeft className="w-3.5 h-3.5 text-[#57394c]" />}
                    </button>
                </div>

                {/* Info del Usuario */}
                {user && !colapsado && (
                    <div className="p-3 bg-[#f5efef] border-b border-[#d6cdcd]/50">
                        <p className="text-[10px] text-[#856868]">Usuario:</p>
                        <p className="font-semibold text-[#330404] text-sm truncate">{user.name}</p>
                        <p className="text-[10px] text-[#57394c] mt-0.5 capitalize font-medium">
                            {user.rol === 'administrador' ? 'Administrador' : user.rol}
                        </p>
                    </div>
                )}

                {/* Menú de Navegación */}
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                    {items.map((item, idx) => {
                        const activo = esActivo(item.href);
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                                    activo
                                        ? 'bg-[#57394c] text-white shadow-sm'
                                        : 'text-[#5c3636] hover:bg-[#f5efef] hover:text-[#57394c]'
                                } ${colapsado ? 'justify-center' : ''}`}
                                title={colapsado ? item.label : undefined}
                            >
                                <span className={`shrink-0 transition-colors ${
                                    activo ? 'text-white' : 'text-[#ad9b9b] group-hover:text-[#57394c]'
                                }`}>
                                    {item.icon}
                                </span>
                                {!colapsado && (
                                    <span className={`font-medium text-sm truncate ${activo ? 'text-white' : ''}`}>
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Botón de Cerrar Sesión */}
                <div className="p-2 border-t border-[#d6cdcd]/50">
                    <Link
                        href={logout().url}
                        method="post"
                        as="button"
                        onClick={(e) => {
                            if (!confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                                e.preventDefault();
                            }
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2.5 bg-[#5c3636] hover:bg-[#330404] rounded-lg text-white transition-colors duration-200 font-medium text-sm ${
                            colapsado ? 'justify-center' : 'justify-center'
                        }`}
                        title={colapsado ? 'Cerrar sesión' : undefined}
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        {!colapsado && <span>Cerrar sesión</span>}
                    </Link>
                </div>
            </aside>

            {/* Contenido Principal */}
            <main className="flex-1 overflow-auto bg-[#f5efef]">
                <div className="p-6">
                    {/* Breadcrumbs si existen */}
                    {breadcrumbs.length > 0 && (
                        <nav className="mb-4 text-sm text-[#856868]">
                            {breadcrumbs.map((crumb, idx) => (
                                <span key={idx}>
                                    {idx > 0 && ' / '}
                                    {crumb.href ? (
                                        <Link href={crumb.href} className="hover:text-[#57394c]">
                                            {crumb.title}
                                        </Link>
                                    ) : (
                                        <span className="text-[#330404] font-medium">{crumb.title}</span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    )}

                    {/* Contenido de la página */}
                    <div className="bg-white rounded-xl shadow-sm border border-[#d6cdcd]/30 p-6">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
