import { io, Socket } from "socket.io-client";
import { Message } from "./messages";
import { Room } from "./rooms";

type EventCallback<T> = (data: T) => void;
type UnsubscribeFunction = () => void;

export class WsConnection {
  private socket: Socket;
  private messageSubs: Record<string, EventCallback<Message>[]> = {};
  private roomChangedSubs: EventCallback<Room>[] = [];

  constructor() {
    this.socket = io();
    this.socket.on("message", (msg) =>
      this.messageSubs[msg.room]?.forEach((cb) => cb(msg))
    );
    this.socket.on("roomChanged", (room) =>
      this.roomChangedSubs.forEach((cb) => cb(room))
    );
  }

  onMessage(
    room: string,
    callback: EventCallback<Message>
  ): UnsubscribeFunction {
    if (!this.messageSubs[room]) this.messageSubs[room] = [];
    this.messageSubs[room].push(callback);
    return () =>
      (this.messageSubs[room] = this.messageSubs[room].filter(
        (f) => f != callback
      ));
  }

  onRoomChanged(callback: EventCallback<Room>): UnsubscribeFunction {
    this.roomChangedSubs.push(callback);
    return () => {
      this.roomChangedSubs = this.roomChangedSubs.filter((f) => f != callback);
    };
  }
}
