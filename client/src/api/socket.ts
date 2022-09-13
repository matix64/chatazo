import { io, Socket } from "socket.io-client";
import { Message } from "./messages";
import { Room } from "./rooms";
import { addToUserCache, User } from "./users";

type EventCallback<T> = (data: T) => void;
type UnsubscribeFunction = () => void;

export class WsConnection {
  private socket: Socket;
  private messageSubs: Record<string, EventCallback<Message>[]> = {};
  private roomChangedSubs: EventCallback<Room>[] = [];
  private userChangedSubs: Record<string, EventCallback<User>[]> = {};

  constructor() {
    this.socket = io();
    this.socket.on("message", (msg) =>
      this.messageSubs[msg.room]?.forEach((cb) => cb(msg))
    );
    this.socket.on("roomChanged", (room) =>
      this.roomChangedSubs.forEach((cb) => cb(room))
    );
    this.socket.on("userChanged", (user) => {
      addToUserCache(user);
      this.userChangedSubs[user.id]?.forEach((cb) => cb(user));
    });
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

  onUserChanged(
    userId: string,
    callback: EventCallback<User>
  ): UnsubscribeFunction {
    if (!this.userChangedSubs[userId]) this.userChangedSubs[userId] = [];
    if (this.userChangedSubs[userId].length == 0)
      this.socket.emit("obsUser", { userId });
    this.userChangedSubs[userId].push(callback);
    return () => {
      this.userChangedSubs[userId] = this.userChangedSubs[userId].filter(
        (f) => f != callback
      );
      if (this.userChangedSubs[userId].length == 0)
        this.socket.emit("unobsUser", { userId });
    };
  }
}
