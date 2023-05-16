"use client";

import { Alert, Spinner } from "flowbite-react";
import { HiExclamationCircle } from "react-icons/hi";
import useSWR from "swr";
import fetcher from "../fetcher";
import ServiceRestartModal from "./service-restart-modal";
import ServiceStatusTable from "./service-status-table";

export default function ServerStatusTable(): JSX.Element {
  // Table data
  const { data, error, isLoading } = useSWR("/api/docker", fetcher, {
    refreshInterval: 5000,
  });

  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return <Error message={error.message} />;
  } else {
    return (
      <>
        {data.message && <Error message={data.message} />}

        <div className="mt-4 mb-4">
          <ServiceRestartModal />
        </div>

        {data.services.length > 0 && (
          <ServiceStatusTable services={data.services} />
        )}
      </>
    );
  }
}

function Loading() {
  return <Spinner color="info" />;
}

interface ErrorProps {
  message: string | undefined;
}

function Error({ message }: ErrorProps) {
  return (
    <Alert color="failure" icon={HiExclamationCircle} className="mb-4">
      <p className="font-medium">Error: Could not query server status</p>
      {message && <p className="mt-1">{message}</p>}
    </Alert>
  );
}
