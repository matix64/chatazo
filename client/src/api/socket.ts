import { io, Socket } from "socket.io-client";
import { Message } from "./messages";

type MessageCallback = (msg: Message) => void;
type UnsubscribeFunction = () => void;

export class WsConnection {
  private socket: Socket;
  private messageSubs: Record<string, MessageCallback[]> = {};

  constructor() {
    this.socket = io();
    this.socket.on("message", (msg) =>
      this.messageSubs[msg.room]?.forEach((cb) => cb(msg))
    );
  }

  onMessage(room: string, callback: MessageCallback): UnsubscribeFunction {
    if (!this.messageSubs[room]) this.messageSubs[room] = [];
    this.messageSubs[room].push(callback);
    return () =>
      (this.messageSubs[room] = this.messageSubs[room].filter(
        (f) => f != callback
      ));
  }
}
