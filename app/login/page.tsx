import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Log In</h1>
        <LoginForm />
      </div>
    </main>
  );
}