import TransportStream from 'winston-transport'

export default class DatadogWinston extends TransportStream {
  public log(): void {
    /* intentionally empty */
  }
}
