import ButtonWithInitialize from "./components/ui/ButtonWithInitialize";
import RollbackButtonWithHandler from "./components/ui/RollbackButtonWithHandler";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold">
            Inicialización de la Aplicación
          </h1>
          <p className="text-lg">
            Utiliza estos botones para inicializar o revertir la configuración
            de la aplicación.
          </p>
          <div className="flex space-x-4">
            <ButtonWithInitialize />
            <RollbackButtonWithHandler />
          </div>
        </div>
      </main>
    </div>
  );
}
