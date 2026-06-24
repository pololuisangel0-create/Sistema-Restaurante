import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Jornada {
    id: number;
    user_id: number;
    inicio: string;
    fin: string | null;
}

interface Props {
    cajero: { id: number; name: string; email: string };
    jornadas: {
        data: Jornada[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
}

export default function AdminJornadas({ cajero, jornadas }: Props) {
    function duracion(inicio: string, fin: string | null): string {
        const start = new Date(inicio);
        const end = fin ? new Date(fin) : new Date();
        const diffMs = end.getTime() - start.getTime();
        const horas = Math.floor(diffMs / (1000 * 60 * 60));
        const minutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        if (horas > 0) return `${horas}h ${minutos}m`;
        return `${minutos} min`;
    }

    return (
        <div className="p-6 md:p-8 animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
                <Link
                    href="/admin/cajeros"
                    className="text-muted hover:text-primary transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-dark">Jornadas de {cajero.name}</h1>
                    <p className="text-sm text-muted">{cajero.email}</p>
                </div>
            </div>

            <div className="overflow-x-auto rounded-xl shadow-sm border border-accent-light/30">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="text-left px-4 py-3 font-semibold">#</th>
                            <th className="text-left px-4 py-3 font-semibold">Inicio</th>
                            <th className="text-left px-4 py-3 font-semibold">Fin</th>
                            <th className="text-left px-4 py-3 font-semibold">Duración</th>
                            <th className="text-center px-4 py-3 font-semibold">Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jornadas.data.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                                    No hay jornadas registradas
                                </td>
                            </tr>
                        ) : (
                            jornadas.data.map((j, index) => (
                                <tr
                                    key={j.id}
                                    className={`border-t border-accent-light/20 transition-colors hover:bg-light/40 ${index % 2 === 0 ? 'bg-white' : 'bg-light/20'}`}
                                >
                                    <td className="px-4 py-3 text-muted text-xs">{jornadas.from + index}</td>
                                    <td className="px-4 py-3 text-dark">
                                        {new Date(j.inicio).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3 text-muted">
                                        {j.fin ? new Date(j.fin).toLocaleString() : '—'}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-dark">
                                        {duracion(j.inicio, j.fin)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {!j.fin ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                Activa
                                            </span>
                                        ) : (
                                            <span className="text-muted-light text-xs">Cerrada</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {jornadas.last_page > 1 && (
                <div className="flex justify-center items-center gap-4 mt-6">
                    <button
                        onClick={() => router.get(`/admin/cajeros/${cajero.id}/jornadas`, { page: jornadas.current_page - 1 })}
                        disabled={jornadas.current_page <= 1}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-40 transition-all"
                    >
                        Anterior
                    </button>
                    <span className="text-sm text-muted">
                        Página {jornadas.current_page} de {jornadas.last_page}
                    </span>
                    <button
                        onClick={() => router.get(`/admin/cajeros/${cajero.id}/jornadas`, { page: jornadas.current_page + 1 })}
                        disabled={jornadas.current_page >= jornadas.last_page}
                        className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-hover disabled:opacity-40 transition-all"
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
}
