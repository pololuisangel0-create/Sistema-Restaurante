import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    return (
        <>
            <Head title="Iniciar sesión" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-5"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-4">
                            <div className="grid gap-1.5">
                                <Label htmlFor="email" className="text-sm font-medium text-[#330404]">
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="tu@email.com"
                                    className="border-[#d6cdcd] focus-visible:border-[#57394c] focus-visible:ring-[#57394c]/30 bg-white placeholder:text-[#7e5f65]"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="password" className="text-sm font-medium text-[#330404]">
                                    Contraseña
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="contraseña"
                                    className="border-[#d6cdcd] focus-visible:border-[#57394c] focus-visible:ring-[#57394c]/30 bg-white placeholder:text-[#7e5f65]"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-[#ad9b9b] data-[state=checked]:bg-[#57394c] data-[state=checked]:border-[#57394c]"
                                />
                                <Label htmlFor="remember" className="text-sm text-[#5c3636] cursor-pointer">
                                    Recuérdame
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                                className="mt-2 w-full bg-[#57394c] hover:bg-[#63444a] text-white shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer"
                            >
                                {processing && <Spinner />}
                                Iniciar sesión
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Iniciar sesión',
    description: 'Ingresa tus credenciales para acceder al sistema',
};
