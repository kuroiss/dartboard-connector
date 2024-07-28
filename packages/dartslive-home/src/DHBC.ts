type DARTSLIVEHomeBluetoothConnector = {
  connect(): Promise<boolean>

  disconnect(): void

  /**
   * `value`:
   *    segment = Math.floor(value / 20)
   *      inner single: 0
   *      outer single: 1
   *      double: 2
   *      triple: 3
   *    area = value % 20
   *    single bull = 81
   *    double bull = 82
   *    change = 84
   *
   * Returns `unsubscribe` function.
   */
  subscribe(callback: (value: number) => void): Promise<() => void>

  /**
   * Connected or not.
   */
  isConnected: boolean
}

const uuid = "6e400001-b5a3-f393-e0a9-e50e24dcca9e"

export class DHBC implements DARTSLIVEHomeBluetoothConnector {
  private _server: BluetoothRemoteGATTServer | null = null

  async connect() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [uuid] }],
      })
      const { gatt } = device
      if (gatt == null) {
        return false
      }
      this._server = await gatt.connect()

      return true
    } catch (_error) {
      return false
    }
  }

  disconnect() {
    this._server?.disconnect()
    this._server = null
  }

  get isConnected() {
    return this._server?.connected ?? false
  }

  async subscribe(callback: (value: number) => void) {
    if (this._server == null) {
      throw new Error("No device has been connected. `connect` first.")
    }
    const services = await this._server.getPrimaryServices()
    if (services.length !== 1) {
      console.error(services)
      throw new Error("`getPrimaryServices` returns unexpected services. Please create issue with error logs.")
    }
    const [service] = services
    const characteristics = await service.getCharacteristics()
    const filtered = characteristics.filter((c) => c.properties.notify)
    if (filtered.length !== 1) {
      console.error(characteristics)
      throw new Error("`getCharacteristics` returns unexpected characteristics. Please create issue with error logs.")
    }
    const [characteristic] = filtered
    const handler: CharacteristicEventHandlers["oncharacteristicvaluechanged"] = (event) => {
      const target: any = event.target
      const dataview: DataView = target.value
      const value = dataview.getUint8(2)
      callback(value)
    }
    characteristic.addEventListener("characteristicvaluechanged", handler)
    await characteristic.startNotifications()
    return () => characteristic.removeEventListener("characteristicvaluechanged", handler)
  }
}
