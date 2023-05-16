import ServerStatusTable from "../components/server-status/server-status";

export default function ServerStatusPage(): JSX.Element {
  return (
    <section>
      <header>
        <h1 className="mb-6 text-4xl font-bold dark:text-white">
          Server Status
        </h1>
      </header>

      <ServerStatusTable />
    </section>
  );
}
