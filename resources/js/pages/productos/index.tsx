import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';

interface Producto {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    costo: number;
    categoria: string | null;
    stock: {
        id: number;
        cantidad_disponible: number;
        cantidad_min: number;
    } | null;
}

interface Props {
    productos: Producto[];
}

interface StockEdit {
    stockId: number;
    productoId: number;
    cantidad_disponible: number;
    cantidad_min: number;
}

export default function ProductosIndex({ productos }: Props) {
    const [editandoId, setEditandoId] = useState<number | null>(null);
    const [stockEditando, setStockEditando] = useState<StockEdit | null>(null);
    const [stockProcessing, setStockProcessing] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: '',
        descripcion: '',
        precio: '',
        costo: '',
        categoria: '',
        cantidad_disponible: '',
        cantidad_min: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (editandoId) {
            put(`/productos/${editandoId}`, {
                onSuccess: () => {
                    reset();
                    setEditandoId(null);
                },
            });
        } else {
            post('/productos', {
                onSuccess: () => reset(),
            });
        }
    }

    function handleDelete(id: number) {
        if (confirm('¿Seguro que desea eliminar?')) {
            router.delete(`/productos/${id}`);
        }
    }

    function handleEdit(producto: Producto) {
        setEditandoId(producto.id);
        setData({
            nombre: producto.nombre,
            descripcion: producto.descripcion ?? '',
            precio: String(producto.precio),
            costo: String(producto.costo),
            categoria: producto.categoria ?? '',
            cantidad_disponible: '',
            cantidad_min: '',
        });
    }

    function handleCancelar() {
        setEditandoId(null);
        reset();
    }

    function handleAjustarStock(stock: { id: number; cantidad_disponible: number; cantidad_min: number }, productoId: number) {
        setStockEditando({
            stockId: stock.id,
            productoId,
            cantidad_disponible: stock.cantidad_disponible,
            cantidad_min: stock.cantidad_min,
        });
    }

    function handleStockChange(field: 'cantidad_disponible' | 'cantidad_min', value: number) {
        if (!stockEditando) return;
        setStockEditando({ ...stockEditando, [field]: value });
    }

    function handleGuardarStock() {
        if (!stockEditando) return;
        setStockProcessing(true);
        router.put(`/stock/${stockEditando.stockId}`, {
            cantidad_disponible: stockEditando.cantidad_disponible,
            cantidad_min: stockEditando.cantidad_min,
        }, {
            onSuccess: () => {
                setStockEditando(null);
                setStockProcessing(false);
            },
            onError: () => setStockProcessing(false),
        });
    }

    function handleCancelarStock() {
        setStockEditando(null);
    }

    return (
        <div className="p-6 md:p-8 animate-fadeIn">
            <h1 className="text-2xl font-bold text-dark mb-6">Productos del Restaurante</h1>

            <div className="bg-light/30 rounded-xl p-6 mb-8 shadow-sm border border-accent-light/30">
                <h3 className="text-lg font-semibold text-dark mb-4">
                    {editandoId ? 'Editar Producto' : 'Nuevo Producto'}
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-dark mb-1">Nombre</label>
                        <input
                            type="text"
                            placeholder="Nombre del producto"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark mb-1">Descripción</label>
                        <input
                            type="text"
                            placeholder="Descripción del producto"
                            value={data.descripcion}
                            onChange={(e) => setData('descripcion', e.target.value)}
                            className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark mb-1">Precio (Bs.)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={data.precio}
                            onChange={(e) => setData('precio', e.target.value)}
                            className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark mb-1">Costo (Bs.)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={data.costo}
                            onChange={(e) => setData('costo', e.target.value)}
                            className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        {errors.costo && <p className="text-red-500 text-xs mt-1">{errors.costo}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dark mb-1">Categoría</label>
                        <input
                            type="text"
                            placeholder="Ej: Bebidas, Platos fuertes"
                            value={data.categoria}
                            onChange={(e) => setData('categoria', e.target.value)}
                            className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                    </div>

                    {!editandoId && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-dark mb-1">Cantidad disponible</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={data.cantidad_disponible}
                                    onChange={(e) => setData('cantidad_disponible', e.target.value)}
                                    className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                />
                                {errors.cantidad_disponible && <p className="text-red-500 text-xs mt-1">{errors.cantidad_disponible}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-dark mb-1">Cantidad mínima</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={data.cantidad_min}
                                    onChange={(e) => setData('cantidad_min', e.target.value)}
                                    className="w-full rounded-lg border border-accent-light/50 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                />
                                {errors.cantidad_min && <p className="text-red-500 text-xs mt-1">{errors.cantidad_min}</p>}
                            </div>
                        </>
                    )}

                    <div className="flex items-end gap-3 md:col-span-full pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-sm hover:shadow-md active:scale-95"
                        >
                            {processing ? 'Guardando...' : editandoId ? 'Actualizar Producto' : 'Guardar Producto'}
                        </button>

                        {editandoId && (
                            <button
                                type="button"
                                onClick={handleCancelar}
                                className="bg-muted-light hover:bg-accent text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="overflow-x-auto rounded-xl shadow-sm border border-accent-light/30">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-primary text-white">
                            <th className="text-left px-4 py-3 font-semibold">Nombre</th>
                            <th className="text-left px-4 py-3 font-semibold">Categoría</th>
                            <th className="text-left px-4 py-3 font-semibold">Precio</th>
                            <th className="text-left px-4 py-3 font-semibold">Costo</th>
                            <th className="text-left px-4 py-3 font-semibold">Stock Disponible</th>
                            <th className="text-left px-4 py-3 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                                    No hay productos registrados
                                </td>
                            </tr>
                        ) : (
                            productos.map((producto, index) => {
                                const stock = producto.stock?.cantidad_disponible ?? 0;
                                const min = producto.stock?.cantidad_min ?? 0;
                                const bajoStock = stock <= min && stock > 0;
                                return (
                                    <tr
                                        key={producto.id}
                                        className={`border-t border-accent-light/20 transition-colors hover:bg-light/40 ${index % 2 === 0 ? 'bg-white' : 'bg-light/20'}`}
                                    >
                                        <td className="px-4 py-3 font-medium text-dark">{producto.nombre}</td>
                                        <td className="px-4 py-3 text-muted">
                                            {producto.categoria ? (
                                                <span className="bg-accent-light/30 text-secondary px-2 py-0.5 rounded-full text-xs font-medium">
                                                    {producto.categoria}
                                                </span>
                                            ) : (
                                                <span className="text-muted-light">Sin categoría</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-dark">Bs. {Number(producto.precio).toFixed(2)}</td>
                                        <td className="px-4 py-3 text-muted">Bs. {Number(producto.costo).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            {stockEditando && stockEditando.productoId === producto.id ? (
                                                <div className="flex flex-col gap-2 min-w-[180px]">
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs text-muted w-20">Disponible:</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stockEditando.cantidad_disponible}
                                                            onChange={(e) => handleStockChange('cantidad_disponible', Number(e.target.value))}
                                                            className="w-20 rounded border border-accent-light/50 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                        />
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-xs text-muted w-20">Mínimo:</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={stockEditando.cantidad_min}
                                                            onChange={(e) => handleStockChange('cantidad_min', Number(e.target.value))}
                                                            className="w-20 rounded border border-accent-light/50 bg-white px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                                                        />
                                                    </div>
                                                    <div className="flex gap-1 mt-1">
                                                        <button
                                                            onClick={handleGuardarStock}
                                                            disabled={stockProcessing}
                                                            className="bg-primary hover:bg-primary-hover text-white px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50"
                                                        >
                                                            {stockProcessing ? '...' : 'Guardar'}
                                                        </button>
                                                        <button
                                                            onClick={handleCancelarStock}
                                                            className="bg-muted-light hover:bg-accent text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                                                        >
                                                            Cancelar
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 rounded-full text-xs font-bold ${
                                                            stock === 0
                                                                ? 'bg-red-100 text-red-600'
                                                                : bajoStock
                                                                    ? 'bg-amber-100 text-amber-700'
                                                                    : 'bg-green-100 text-green-700'
                                                        }`}
                                                    >
                                                        {stock}
                                                    </span>
                                                    {producto.stock && (
                                                        <button
                                                            onClick={() =>
                                                                handleAjustarStock(
                                                                    producto.stock!,
                                                                    producto.id
                                                                )
                                                            }
                                                            className="text-xs bg-accent-light/40 hover:bg-accent/40 text-secondary px-2 py-1 rounded transition-colors"
                                                        >
                                                            Ajustar
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(producto)}
                                                    className="bg-accent hover:bg-accent-light text-white px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(producto.id)}
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
