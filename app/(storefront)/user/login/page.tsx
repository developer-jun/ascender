import LoginForm from './ui/login-form';

export const metadata = {
  title: 'User Login',
  description: '',
}

export default function Login() {
  return (
    <main className="flex flex-col justify-center items-center h-screen">
      <div className="w-1/4">
        <LoginForm />
      </div>
    </main>
  ); 
}