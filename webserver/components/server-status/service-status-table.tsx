import { Badge, Table } from "flowbite-react";

const statusColorMap: Record<string, string> = {
  paused: "warning",
  restarting: "warning",
  removing: "failure",
  running: "success",
  dead: "failure",
  created: "default",
  exited: "failure",
  unknown: "gray",
  offline: "failure",
};

interface ServiceProps {
  id: string;
  name: string;
  state: string;
  status: string;
}

interface ContainerStatusTableProps {
  services: ServiceProps[];
}

export default function ServiceStatusTable({
  services,
}: ContainerStatusTableProps) {
  return (
    <Table>
      <Table.Head>
        <Table.HeadCell>Service</Table.HeadCell>
        <Table.HeadCell>State</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
      </Table.Head>

      <Table.Body className="divide-y">
        {services.map((service: ServiceProps) => (
          <Table.Row key={service.id}>
            <Table.Cell>
              <code>{service.name}</code>
            </Table.Cell>
            <Table.Cell>
              <div>
                <Badge
                  size="sm"
                  style={{ display: "inline" }}
                  color={statusColorMap[service.state] || "default"}
                >
                  {service.state}
                </Badge>
              </div>
            </Table.Cell>
            <Table.Cell>{service.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}
