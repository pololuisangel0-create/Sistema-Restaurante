import { Link, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface Jornada {
    id: number;
    inicio: string;
    fin: string | null;
}

interface Cajero {
    id: number;
    name: string;
    email: string;
    jornadas: Jornada[];
}

interface Props {
    cajeros: Cajero[];
}

export default function AdminCajeros({ cajeros }: Props) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        nombre: '',
        email: '',
        password: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/cajeros', {
            onSuccess: () => {
                reset();
                setMostrarFormulario(false);
            },
        });
    }

    function handleDelete(id: number) {
        if (confirm('¿Eliminar este cajero?')) {
            router.delete(`/admin/cajeros/${id}`);
        }
    }

    return (
        <div className="p-6 md:p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark">Gestionar Cajeros</h1>
                <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${
                        mostrarFormulario
                            ? 'bg-muted-light hover:bg-accent text-white'
                            : 'bg-primary hover:bg-primary-hover text-white'
                    }`}
                >
                    {mostrarFormulario ? 'Cancelar' : '+ Nuevo Cajero'}
                </button>
            </div>

            {mostrarFormulario && (
                <div className="bg-light/30 rounded-xl p-6 mb-8 shadow-sm border border-accent-light/30">
                    <h3 className="text-lg font-semibold text-dark mb-4">Nuevo Cajero</h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
                            <input
                                type="text"
                                placeholder="Nombre del cajero"
                                value={data.nombre}
                                onChange={(e) => setData('nombre', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Contraseña</label>
                            <input
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>

                        <div className="md:col-span-full">
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95"
                            >
                                {processing ? 'Creando...' : 'Crear Cajero'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto rounded-xl shadow-sm border border-accent-light/30">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                            <th className="text-left px-4 py-3 font-semibold">Email</th>
                            <th className="text-center px-4 py-3 font-semibold">Jornada Actual</th>
                            <th className="text-left px-4 py-3 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cajeros.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                                    No hay cajeros registrados
                                </td>
                            </tr>
                        ) : (
                            cajeros.map((cajero, index) => {
                                const activa = cajero.jornadas.find(j => !j.fin);
                                return (
                                    <tr
                                        key={cajero.id}
                                        className={`border-t border-accent-light/20 transition-colors hover:bg-light/40 ${index % 2 === 0 ? 'bg-white' : 'bg-light/20'}`}
                                    >
                                        <td className="px-4 py-3 font-medium text-dark">{cajero.name}</td>
                                        <td className="px-4 py-3 text-muted">{cajero.email}</td>
                                        <td className="px-4 py-3 text-center">
                                            {activa ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                    En línea
                                                </span>
                                            ) : (
                                                <span className="text-muted-light text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/admin/cajeros/${cajero.id}/jornadas`}
                                                    className="bg-accent hover:bg-accent-light text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                                                >
                                                    Jornadas
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(cajero.id)}
                                                    className="bg-red-400 hover:bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
