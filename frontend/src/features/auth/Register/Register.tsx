import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRegisterMutation } from '@/app/api/authSlice';
import { getApiErrorMessage } from '@/shared/utils/apiErrorUtils';
import { toast } from 'react-toastify';
import Button from '@/shared/ui/Button';
import Input from '@/shared/ui/Input';
import CustomLink from '@/shared/ui/CustomLink';
import styles from './styles.module.scss';

interface RegisterProps {
  onRegister: () => void;
  onSwitchToLogin: () => void;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const { control, handleSubmit, watch, formState: { errors }, trigger } = useForm<RegisterFormData>();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const password = watch('password');

  const onSubmit = handleSubmit(async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }
    try {
      await registerUser({
        username: data.username.trim(),
        email: data.email.trim(),
        password: data.password,
      }).unwrap();
      toast.success('Регистрация успешна! Теперь войдите в систему.');
      onRegister();
    } catch (error: unknown) {
      console.error('Error registering:', error);
      toast.error(getApiErrorMessage(error));
    }
  });

  return (
    <div className={styles.register}>
      <h1 className={styles.title}>Регистрация</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="username">Имя пользователя:</label>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Имя пользователя обязательно" }}
            render={({ field }) => (
              <Input
                type="text"
                id="username"
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={() => trigger('username')}
                placeholder="Введите имя пользователя"
                required
                error={errors.username?.message}
              />
            )}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email:</label>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email обязателен",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Неверный формат email"
              }
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
          <label className={styles.label} htmlFor="password">Пароль:</label>
          <Controller
            name="password"
            control={control}
            rules={{ required: "Пароль обязателен", minLength: { value: 8, message: "Пароль должен быть не менее 8 символов" } }}
            render={({ field }) => (
              <Input
                type="password"
                id="password"
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={() => trigger('password')}
                placeholder="Введите пароль"
                required
                error={errors.password?.message}
              />
            )}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="confirmPassword">Подтвердите пароль:</label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: "Подтверждение пароля обязательно",
              validate: value => value === password || "Пароли не совпадают"
            }}
            render={({ field }) => (
              <Input
                type="password"
                id="confirmPassword"
                value={field.value || ''}
                onChange={field.onChange}
                onBlur={() => trigger('confirmPassword')}
                placeholder="Подтвердите пароль"
                required
                error={errors.confirmPassword?.message}
              />
            )}
          />
        </div>
        <Button
          text={isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          color="green"
          size="medium"
          type="submit"
          disabled={isLoading}
        />
        <div className={styles.linkContainer}>
          <CustomLink onClick={onSwitchToLogin}>Уже есть аккаунт? Войти</CustomLink>
        </div>
      </form>
    </div>
  );
};

export default Register;