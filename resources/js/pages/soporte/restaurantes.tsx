import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Admin {
    id: number;
    name: string;
    email: string;
}

interface Restaurante {
    id: number;
    nombre: string;
    direccion: string;
    telefono: string;
    estado: string;
    usuarios: Admin[];
}

interface Props {
    restaurantes: Restaurante[];
}

export default function RestaurantesSoporte({ restaurantes }: Props) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [restauranteSeleccionado, setRestauranteSeleccionado] = useState<number | null>(null);

    const { data: dataRestaurante, setData: setDataRestaurante, post: postRestaurante, processing: processingRestaurante, errors: errorsRestaurante, reset: resetRestaurante } = useForm({
        nombre: '',
        direccion: '',
        telefono: '',
    });

    const { data: dataAdmin, setData: setDataAdmin, post: postAdmin, processing: processingAdmin, errors: errorsAdmin, reset: resetAdmin } = useForm({
        nombre: '',
        email: '',
        password: '',
    });

    function handleCrearRestaurante(e: React.FormEvent) {
        e.preventDefault();
        postRestaurante('/soporte/restaurantes', {
            onSuccess: () => {
                resetRestaurante();
                setMostrarFormulario(false);
            },
        });
    }

    function handleCrearAdmin(e: React.FormEvent, restauranteId: number) {
        e.preventDefault();
        postAdmin(`/soporte/restaurantes/${restauranteId}/admin`, {
            onSuccess: () => {
                resetAdmin();
                setRestauranteSeleccionado(null);
            },
        });
    }

    return (
        <div className="p-6 md:p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-dark">Gestionar Restaurantes</h1>
                <button
                    onClick={() => setMostrarFormulario(!mostrarFormulario)}
                    className={`px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm ${
                        mostrarFormulario
                            ? 'bg-muted-light hover:bg-accent text-white'
                            : 'bg-primary hover:bg-primary-hover text-white'
                    }`}
                >
                    {mostrarFormulario ? 'Cancelar' : '+ Nuevo Restaurante'}
                </button>
            </div>

            {mostrarFormulario && (
                <div className="bg-light/30 rounded-xl p-6 mb-8 shadow-sm border border-accent-light/30">
                    <h3 className="text-lg font-semibold text-dark mb-4">Nuevo Restaurante</h3>
                    <form onSubmit={handleCrearRestaurante} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
                            <input
                                type="text"
                                placeholder="Nombre del restaurante"
                                value={dataRestaurante.nombre}
                                onChange={(e) => setDataRestaurante('nombre', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                            {errorsRestaurante.nombre && <p className="text-red-500 text-xs mt-1">{errorsRestaurante.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Dirección</label>
                            <input
                                type="text"
                                placeholder="Dirección del restaurante"
                                value={dataRestaurante.direccion}
                                onChange={(e) => setDataRestaurante('direccion', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                            {errorsRestaurante.direccion && <p className="text-red-500 text-xs mt-1">{errorsRestaurante.direccion}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Teléfono</label>
                            <input
                                type="text"
                                placeholder="Número de teléfono"
                                value={dataRestaurante.telefono}
                                onChange={(e) => setDataRestaurante('telefono', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                            {errorsRestaurante.telefono && <p className="text-red-500 text-xs mt-1">{errorsRestaurante.telefono}</p>}
                        </div>

                        <div className="md:col-span-full">
                            <button
                                type="submit"
                                disabled={processingRestaurante}
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95"
                            >
                                {processingRestaurante ? 'Creando...' : 'Crear Restaurante'}
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
                            <th className="text-left px-4 py-3 font-semibold">Dirección</th>
                            <th className="text-left px-4 py-3 font-semibold">Teléfono</th>
                            <th className="text-left px-4 py-3 font-semibold">Estado</th>
                            <th className="text-left px-4 py-3 font-semibold">Administradores</th>
                            <th className="text-left px-4 py-3 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurantes.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                                    No hay restaurantes registrados
                                </td>
                            </tr>
                        ) : (
                            restaurantes.map((restaurante, index) => (
                                <tr
                                    key={restaurante.id}
                                    className={`border-t border-accent-light/20 transition-colors hover:bg-light/40 ${index % 2 === 0 ? 'bg-white' : 'bg-light/20'}`}
                                >
                                    <td className="px-4 py-3 font-medium text-dark">{restaurante.nombre}</td>
                                    <td className="px-4 py-3 text-muted">{restaurante.direccion}</td>
                                    <td className="px-4 py-3 text-muted">{restaurante.telefono}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                restaurante.estado === 'activo'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                        >
                                            {restaurante.estado}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {restaurante.usuarios.length === 0 ? (
                                            <span className="text-muted text-xs italic">Sin admin</span>
                                        ) : (
                                            <div className="flex flex-col gap-1">
                                                {restaurante.usuarios.map((admin) => (
                                                    <div key={admin.id} className="flex flex-col">
                                                        <span className="text-dark text-sm font-medium">{admin.name}</span>
                                                        <span className="text-muted text-xs">{admin.email}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={`/soporte/restaurantes/${restaurante.id}/gestionar`}
                                                className="bg-primary hover:bg-primary-hover text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                                            >
                                                Gestionar
                                            </a>
                                            <button
                                                onClick={() => setRestauranteSeleccionado(restaurante.id)}
                                                className="bg-accent hover:bg-accent-light text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                                            >
                                                + Admin
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {restauranteSeleccionado && (
                <div className="mt-8 bg-light/30 rounded-xl p-6 shadow-sm border border-accent-light/30">
                    <h3 className="text-lg font-semibold text-dark mb-4">Crear Administrador</h3>
                    <form onSubmit={(e) => handleCrearAdmin(e, restauranteSeleccionado)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
                            <input
                                type="text"
                                placeholder="Nombre del administrador"
                                value={dataAdmin.nombre}
                                onChange={(e) => setDataAdmin('nombre', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                            {errorsAdmin.nombre && <p className="text-red-500 text-xs mt-1">{errorsAdmin.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Email</label>
                            <input
                                type="email"
                                placeholder="correo@ejemplo.com"
                                value={dataAdmin.email}
                                onChange={(e) => setDataAdmin('email', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                            {errorsAdmin.email && <p className="text-red-500 text-xs mt-1">{errorsAdmin.email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Contraseña</label>
                            <input
                                type="password"
                                placeholder="Mínimo 8 caracteres"
                                value={dataAdmin.password}
                                onChange={(e) => setDataAdmin('password', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                            {errorsAdmin.password && <p className="text-red-500 text-xs mt-1">{errorsAdmin.password}</p>}
                        </div>

                        <div className="md:col-span-full flex gap-3">
                            <button
                                type="submit"
                                disabled={processingAdmin}
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95"
                            >
                                {processingAdmin ? 'Creando...' : 'Crear Admin'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setRestauranteSeleccionado(null)}
                                className="bg-muted-light hover:bg-accent text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
