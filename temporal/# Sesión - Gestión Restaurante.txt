# Sesión - Gestión Restaurante

## Cambios realizados

### Login & UI
- Rediseñado login con layout split (panel izquierdo oscuro + formulario derecho crema)
- Logo desde `/images/logo.png`
- Inputs con `bg-white text-[#330404]` fijo (texto visible siempre)
- Placeholders color `#ad9b9b`
- Traducido a español

### APP_URL y rutas Wayfinder
- `.env`: `APP_URL=http://localhost:8000` (para Artisan serve)
- Wayfinder regenerado sin prefijo `/restaurante/public/`

### Soporte - Gestión de Restaurantes
- **Archivos modificados:**
  - `app/Http/Controllers/SoporteController.php` — nuevos métodos: `gestionar()`, `actualizarEstado()`, `eliminarRestaurante()`, `eliminarAdmin()`
  - `routes/web.php` — nuevas rutas: GET `/soporte/restaurantes/{r}/gestionar`, PUT `.../estado`, DELETE `...`, DELETE `.../admin/{user}`
  - `resources/js/pages/soporte/restaurantes.tsx` — columna "Administradores" + botón "Gestionar"
- **Archivos nuevos:**
  - `resources/js/pages/soporte/gestionar-restaurante.tsx` — página de gestión individual

### Qué hace la página de gestión
- Ver info del restaurante
- Cambiar estado (activo/inactivo/suspendido)
- Listar admins con botón eliminar
- Crear admin directo
- Eliminar restaurante (zona de peligro con confirmación)

### Correcciones globales
- `resources/css/app.css`: regla global `input, textarea, select { color: #330404 }`
- `resources/js/components/ui/input.tsx`: `bg-white text-[#330404]`

## Para retomar después
1. Ejecutar: `php artisan serve` (puerto 8000)
2. Ejecutar: `npm run dev` (si se está desarrollando)
3. Usuario soporte para probar: soporte@correo.com
4. Login en: http://localhost:8000/login
