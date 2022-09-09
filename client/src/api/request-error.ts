export class RequestRejectedError extends Error {
  status: number;

  constructor(resp: Response) {
    super(resp.status + " " + resp.statusText);
    this.name = "RequestRejectedError";
    this.status = resp.status;
  }
}
