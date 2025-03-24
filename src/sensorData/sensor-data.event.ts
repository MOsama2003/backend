export class SensorDataEvent {
  constructor(
    public readonly deviceId: string,
    public readonly req: any,
  ) {}
}
