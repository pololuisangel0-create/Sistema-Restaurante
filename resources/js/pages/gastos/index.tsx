import { useForm, router } from '@inertiajs/react';

interface Gasto {
    id: number;
    descripcion: string;
    monto: number;
    fecha: string;
}

interface Props {
    gastos: Gasto[];
}

export default function GastosIndex({ gastos }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        descripcion: '',
        monto: '',
        fecha: new Date().toISOString().split('T')[0],
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/gastos', {
            onSuccess: () => reset(),
        });
    }

    function handleDelete(id: number) {
        if (confirm('¿Eliminar este gasto?')) {
            router.delete(`/gastos/${id}`);
        }
    }

    const totalGastos = gastos.reduce((sum, g) => sum + Number(g.monto), 0);

    return (
        <div className="p-6 md:p-8 animate-fadeIn">
            <h1 className="text-2xl font-bold text-dark mb-6">Gastos del Restaurante</h1>

            <div className="bg-light/30 rounded-xl p-6 mb-8 shadow-sm border border-accent-light/30">
                <h3 className="text-lg font-semibold text-dark mb-4">Registrar Gasto</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dark mb-1">Descripción</label>
                        <input
                            type="text"
                            placeholder="Ej: Compra de insumos"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark mb-1">Monto (Bs.)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={data.monto}
                            onChange={(e) => setData('monto', e.target.value)}
                            className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        {errors.monto && <p className="text-red-500 text-xs mt-1">{errors.monto}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark mb-1">Fecha</label>
                        <input
                            type="date"
                            value={data.fecha}
                            onChange={(e) => setData('fecha', e.target.value)}
                            className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        {errors.fecha && <p className="text-red-500 text-xs mt-1">{errors.fecha}</p>}
                    </div>

                    <div className="md:col-span-full">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95"
                        >
                            {processing ? 'Registrando...' : 'Registrar Gasto'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="overflow-x-auto rounded-xl shadow-sm border border-accent-light/30">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="text-left px-4 py-3 font-semibold">Fecha</th>
                            <th className="text-left px-4 py-3 font-semibold">Descripción</th>
                            <th className="text-left px-4 py-3 font-semibold">Monto</th>
                            <th className="text-left px-4 py-3 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gastos.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-muted">
                                    No hay gastos registrados
                                </td>
                            </tr>
                        ) : (
                            gastos.map((gasto, index) => (
                                <tr
                                    key={gasto.id}
                                    className={`border-t border-accent-light/20 transition-colors hover:bg-light/40 ${index % 2 === 0 ? 'bg-white' : 'bg-light/20'}`}
                                >
                                    <td className="px-4 py-3 text-muted">
                                        {new Date(gasto.fecha).toLocaleDateString('es-BO', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-4 py-3 font-medium text-dark">{gasto.descripcion}</td>
                                    <td className="px-4 py-3 font-medium text-dark">Bs. {Number(gasto.monto).toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(gasto.id)}
                                            className="bg-red-400 hover:bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 bg-primary/10 rounded-xl px-6 py-4 border border-primary/20 flex items-center justify-between">
                <span className="text-dark font-semibold">Total Gastos</span>
                <span className="text-xl font-bold text-primary">Bs. {totalGastos.toFixed(2)}</span>
            </div>
        </div>
    );
}
