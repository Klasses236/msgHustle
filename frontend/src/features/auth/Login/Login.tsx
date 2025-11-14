import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useLoginMutation } from '@/app/api/authSlice';
import { getApiErrorMessage } from '@/shared/utils/apiErrorUtils';
import { toast } from 'react-toastify';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import styles from './styles.module.scss';

interface LoginProps {
  onLogin: () => void;
  onSwitchToRegister: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<LoginFormData>();
  const [login, { isLoading }] = useLoginMutation();

  const onSubmit = handleSubmit(async (data: LoginFormData) => {
    try {
      const result = await login({
        email: data.email.trim(),
        password: data.password,
      }).unwrap();
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('refreshToken', result.refreshToken);
      localStorage.setItem('user', JSON.stringify(result.user));
      toast.success('Успешный вход!');
      onLogin();
    } catch (error: unknown) {
      console.error('Error logging in:', error);
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <div className={styles.login}>
      <h1 className={styles.title}>Вход</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">
            Email:
          </label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email обязателен',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Неверный формат email',
              },
            }}
            render={({ field }) => (
              <Input
                type="text"
                id="email"
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={() => trigger('email')}
                placeholder="Введите email"
                required
                error={errors.email?.message}
              />
            )}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            Пароль:
          </label>
          <Controller
            name="password"
            control={control}
            rules={{ required: 'Пароль обязателен' }}
            render={({ field }) => (
              <Input
                type="password"
                id="password"
                value={field.value || ''}
                onChange={field.onChange}
                placeholder="Введите пароль"
                required
                error={errors.password?.message}
              />
            )}
          />
        </div>
        <Button
          text={isLoading ? 'Вход...' : 'Войти'}
          color="green"
          size="medium"
          type="submit"
          disabled={isLoading}
        />
        <Button
          text="Регистрация"
          color="blue"
          size="medium"
          type="button"
          onClick={onSwitchToRegister}
        />
      </form>
    </div>
  );
};

export default Login;
