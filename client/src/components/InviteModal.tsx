import { Loader, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { createInvite } from "../api/invites";
import { Room } from "../api/rooms";
import { ClickToCopy } from "./misc/ClickToCopy";

interface InviteModalProps {
  room: Room;
}

export function InviteModal({ room }: InviteModalProps) {
  const [inviteLink, setInviteLink] = useState<string | Error | undefined>();

  useEffect(() => {
    createInvite(room.id)
      .then((invite) => setInviteLink(invite.getUrl()))
      .catch(setInviteLink);
  }, []);

  if (typeof inviteLink == "string") {
    return (
      <div>
        <Text mb="sm">Send this link:</Text>
        <ClickToCopy value={inviteLink} />
      </div>
    );
  } else if (inviteLink instanceof Error) {
    return <div>Sorry, we couldn't create the invitation</div>;
  } else {
    return (
      <div style={{ display: "grid", placeItems: "center", width: "100%" }}>
        <Loader color="gray" variant="dots" />
      </div>
    );
  }
}
