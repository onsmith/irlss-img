import SecurityForm from "./security-form";
import TwitchAuthForm from "./twitch-auth-form";

export default function SecurityPage(): JSX.Element {
  return (
    <>
      <section>
        <header>
          <h1 className="mb-6 text-4xl font-bold dark:text-white">Security</h1>
        </header>

        <SecurityForm />
      </section>

      <section className="mt-10">
        <header>
          <h2 className="mb-3 text-2xl font-bold dark:text-white">
            Twitch Chat Authentication
          </h2>
        </header>

        <TwitchAuthForm />
      </section>
    </>
  );
}
