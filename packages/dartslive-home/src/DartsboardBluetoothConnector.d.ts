export type DartsboardBluetoothConnector<T> = {
  connect(): Promise<boolean>

  disconnect(): void

  /**
   * Subscribes darts board event.
   * returns unsubscribe function.
   */
  subscribe(callback: (value: T) => void): Promise<() => void>

  /**
   * Connected or not.
   */
  isConnected: boolean
}
