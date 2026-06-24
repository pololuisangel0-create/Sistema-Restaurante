import { useForm, usePage, router } from '@inertiajs/react';
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
    restaurante: Restaurante;
}

export default function GestionarRestaurante({ restaurante }: Props) {
    const { flash } = usePage<{ flash?: { success?: string } }>().props;
    const [mostrarFormAdmin, setMostrarFormAdmin] = useState(false);
    const [confirmarEliminar, setConfirmarEliminar] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        estado: restaurante.estado,
    });

    const { data: dataAdmin, setData: setDataAdmin, post: postAdmin, processing: processingAdmin, errors: errorsAdmin, reset: resetAdmin } = useForm({
        nombre: '',
        email: '',
        password: '',
    });

    function handleCambiarEstado(e: React.FormEvent) {
        e.preventDefault();
        put(`/soporte/restaurantes/${restaurante.id}/estado`);
    }

    function handleCrearAdmin(e: React.FormEvent) {
        e.preventDefault();
        postAdmin(`/soporte/restaurantes/${restaurante.id}/admin`, {
            onSuccess: () => {
                resetAdmin();
                setMostrarFormAdmin(false);
            },
        });
    }

    function handleEliminarAdmin(adminId: number) {
        if (confirm('¿Eliminar este administrador?')) {
            router.delete(`/soporte/restaurantes/${restaurante.id}/admin/${adminId}`);
        }
    }

    function handleEliminarRestaurante() {
        router.delete(`/soporte/restaurantes/${restaurante.id}`);
    }

    return (
        <div className="p-6 md:p-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
                <a
                    href="/soporte/restaurantes"
                    className="text-muted hover:text-dark transition-colors"
                >
                    &larr; Volver
                </a>
                <h1 className="text-2xl font-bold text-dark">Gestionar {restaurante.nombre}</h1>
            </div>

            {flash?.success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                    {flash.success}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-accent-light/30 p-6">
                    <h2 className="text-lg font-semibold text-dark mb-4">Información del Restaurante</h2>
                    <div className="space-y-3 text-sm">
                        <div>
                            <span className="text-muted">Nombre:</span>
                            <p className="text-dark font-medium">{restaurante.nombre}</p>
                        </div>
                        <div>
                            <span className="text-muted">Dirección:</span>
                            <p className="text-dark font-medium">{restaurante.direccion}</p>
                        </div>
                        <div>
                            <span className="text-muted">Teléfono:</span>
                            <p className="text-dark font-medium">{restaurante.telefono}</p>
                        </div>
                        <div>
                            <span className="text-muted">Estado actual:</span>
                            <span
                                className={`ml-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    restaurante.estado === 'activo'
                                        ? 'bg-green-100 text-green-700'
                                        : restaurante.estado === 'suspendido'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {restaurante.estado}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-accent-light/30 p-6">
                    <h2 className="text-lg font-semibold text-dark mb-4">Cambiar Estado</h2>
                    <form onSubmit={handleCambiarEstado} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Nuevo estado</label>
                            <select
                                value={data.estado}
                                onChange={(e) => setData('estado', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                                <option value="suspendido">Suspendido</option>
                            </select>
                            {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={processing || data.estado === restaurante.estado}
                            className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95 self-start"
                        >
                            {processing ? 'Guardando...' : 'Guardar Estado'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-accent-light/30 p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-dark">Administradores</h2>
                    <button
                        onClick={() => setMostrarFormAdmin(!mostrarFormAdmin)}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                            mostrarFormAdmin
                                ? 'bg-muted-light hover:bg-accent text-white'
                                : 'bg-primary hover:bg-primary-hover text-white'
                        }`}
                    >
                        {mostrarFormAdmin ? 'Cancelar' : '+ Nuevo Admin'}
                    </button>
                </div>

                {mostrarFormAdmin && (
                    <form onSubmit={handleCrearAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-light/30 rounded-lg border border-accent-light/30">
                        <div>
                            <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
                            <input
                                type="text"
                                placeholder="Nombre del admin"
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
                                placeholder="Mínimo 6 caracteres"
                                value={dataAdmin.password}
                                onChange={(e) => setDataAdmin('password', e.target.value)}
                                className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                            />
                            {errorsAdmin.password && <p className="text-red-500 text-xs mt-1">{errorsAdmin.password}</p>}
                        </div>
                        <div className="md:col-span-full">
                            <button
                                type="submit"
                                disabled={processingAdmin}
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95"
                            >
                                {processingAdmin ? 'Creando...' : 'Crear Admin'}
                            </button>
                        </div>
                    </form>
                )}

                {restaurante.usuarios.length === 0 ? (
                    <p className="text-muted text-sm italic">No hay administradores para este restaurante</p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-accent-light/20">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-primary text-white">
                                    <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                                    <th className="text-left px-4 py-3 font-semibold">Email</th>
                                    <th className="text-left px-4 py-3 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restaurante.usuarios.map((admin, index) => (
                                    <tr
                                        key={admin.id}
                                        className={`border-t border-accent-light/20 transition-colors hover:bg-light/40 ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-light/20'
                                        }`}
                                    >
                                        <td className="px-4 py-3 font-medium text-dark">{admin.name}</td>
                                        <td className="px-4 py-3 text-muted">{admin.email}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() => handleEliminarAdmin(admin.id)}
                                                className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
                <h2 className="text-lg font-semibold text-red-700 mb-2">Zona de Peligro</h2>
                <p className="text-sm text-muted mb-4">
                    Eliminar este restaurante borrará todos sus datos (productos, pedidos, gastos, usuarios). Esta acción no se puede deshacer.
                </p>
                {confirmarEliminar ? (
                    <div className="flex items-center gap-3">
                        <p className="text-sm text-red-700 font-medium">¿Estás seguro?</p>
                        <button
                            onClick={handleEliminarRestaurante}
                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm"
                        >
                            Sí, eliminar
                        </button>
                        <button
                            onClick={() => setConfirmarEliminar(false)}
                            className="bg-muted-light hover:bg-accent text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
                        >
                            Cancelar
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => setConfirmarEliminar(true)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
                    >
                        Eliminar Restaurante
                    </button>
                )}
            </div>
        </div>
    );
}
