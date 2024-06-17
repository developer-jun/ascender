import RegistrationForm from "./ui/registration-form"

export default function Register() {

  return (
    <>
      <main className="flex flex-col justify-center items-center h-screen">
        <div className="w-1/3 relative flex flex-col place-items-center custom-form p-10 rounded-md bg-slate-900 shadow-xl shadow-slate-950">
          <RegistrationForm />                   
        </div>
      </main>
    </>
  );
}
