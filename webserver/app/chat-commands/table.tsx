import { Table } from "flowbite-react";

export default function ChatCommandTable() {
  return (
    <Table striped={true}>
      <Table.Head>
        <Table.HeadCell>Command</Table.HeadCell>
        <Table.HeadCell>Description</Table.HeadCell>
        <Table.HeadCell>Example</Table.HeadCell>
        <Table.HeadCell>Chatter Role</Table.HeadCell>
      </Table.Head>

      <Table.Body className="divide-y">
        <Row
          command="start"
          description="Start streaming in OBS"
          example="start"
          role="Admin"
        />
        <Row
          command="stop"
          description="Stop streaming in OBS"
          example="stop"
          role="Admin"
        />
        <Row
          command="record"
          description="Toggle recording in OBS"
          example="record"
          role="Admin"
        />
        <Row
          command="alias [alias] [command]"
          description="Add an alias for a command"
          example="alias ss switch"
          role="Admin"
        />
        <Row
          command="alias rem [alias]"
          description="Remove an alias for a command"
          example="alias rem ss"
          role="Admin"
        />
        <Row
          command="switch [scene]"
          description="Switch to the provided SCENE (fuzzy match)"
          example="switch intro"
          role="Admin"
        />
        <Row
          command="source [value]"
          description="Toggle an OBS source item visibility on the current scene"
          example="source media"
          role="Admin"
        />
        <Row
          command="live"
          description="Switch to the live scene"
          example="live"
          role="Admin"
        />
        <Row
          command="privacy"
          description="Switch to the privacy scene"
          example="privacy"
          role="Admin"
        />
        <Row
          command="starting"
          description="Switch to the starting scene"
          example="starting"
          role="Admin"
        />
        <Row
          command="ending"
          description="Switch to the ending scene"
          example="ending"
          role="Admin"
        />
        <Row
          command="noalbs prefix [prefix]"
          description="Set the prefix character for the server chat commands"
          example="noalbs prefix #"
          role="Admin"
        />
        <Row
          command="noalbs retry [attempts]"
          description="Set the number of times to check the bandwidth before changing scenes"
          example="noalbs retry 3"
          role="Admin"
        />
        <Row
          command="noalbs lang [language]"
          description="Set the language for the chat commands"
          example="noalbs lang zh_tw"
          role="Admin"
        />
        <Row
          command="trigger [value]"
          description="Set the bitrate threshold for switching to the low bitrate scene in kbps"
          example="trigger 800"
          role="Moderator"
        />
        <Row
          command="otrigger [value]"
          description="Set the bitrate threshold for switching to the disconnected scene in kbps"
          example="otrigger 200"
          role="Moderator"
        />
        <Row
          command="rtrigger [value]"
          description="Set the roundtrip time threshold for switching to the disconnected scene in ms"
          example="rtrigger 2000"
          role="Moderator"
        />
        <Row
          command="ortrigger [value]"
          description="Set the roundtrip based bitrate threshold in kbps"
          example="ortrigger 3000"
          role="Moderator"
        />
        <Row
          command="sourceinfo"
          description="Get information about the current source"
          example="sourceinfo"
          role="Moderator"
        />
        <Row
          command="serverinfo"
          description="Get information about the current server"
          example="serverinfo"
          role="Moderator"
        />
        <Row
          command="fix"
          description="Try to fix the stream"
          example="fix"
          role="Moderator"
        />
        <Row
          command="refresh"
          description="Try to fix the stream"
          example="refresh"
          role="Moderator"
        />
        <Row
          command="bitrate"
          description="Get the current bitrate"
          example="bitrate"
          role="Public"
        />
        <Row
          command="public [on/off]"
          description="Enable/disable the use of Public commands"
          example="public off"
          role="Admin"
        />
        <Row
          command="mod [on/off]"
          description="Enable/disable the use of MOD commands"
          example="mod on"
          role="Admin"
        />
        <Row
          command="notify [on/off]"
          description="Enable/disable the notifications in chat"
          example="notify off"
          role="Admin"
        />
        <Row
          command="autostop [on/off]"
          description="Enable/disable the auto stop feature when you host/raid"
          example="autostop on"
          role="Admin"
        />
        <Row
          command="noalbs [start/stop]"
          description="NOALBS start/stop switching scenes"
          example="noalbs start"
          role="Admin"
        />
        <Row
          command="noalbs instant"
          description="Toggle instant switching from offline scene"
          example="noalbs instant"
          role="Admin"
        />
      </Table.Body>
    </Table>
  );
}

interface RowProps {
  command: string;
  description: string;
  example: string;
  role: string;
}

function Row({ command, description, example, role }: RowProps) {
  return (
    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
      <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
        <code>!{command}</code>
      </Table.Cell>
      <Table.Cell>{description}</Table.Cell>
      <Table.Cell>
        <code>!{example}</code>
      </Table.Cell>
      <Table.Cell>{role}</Table.Cell>
    </Table.Row>
  );
}
