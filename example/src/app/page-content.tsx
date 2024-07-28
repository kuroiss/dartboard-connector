"use client"

import { DHBC } from "@minimalcorp/dartslive-home-bluetooth-connector"
import { useRef } from "react"

const dhbc = new DHBC()

export const Example = () => {
  const ref = useRef<(() => void) | null>(null)
  const subscribe = async () => {
    ref.current = await dhbc.subscribe((value) => console.log(value))
  }
  const unsubscribe = () => {
    ref.current?.()
    ref.current = null
  }

  return (
    <div>
      <h1>Darts Board Bluetooth Connector Example</h1>
      <div>
        <h2>DARTSLIVE Home</h2>
        <div>
          <button onClick={() => dhbc.connect()}>Connect</button>
          <button onClick={() => dhbc.disconnect()}>Disconnect</button>
          <button onClick={subscribe}>Subscribe</button>
          <button onClick={unsubscribe}>Unsubscribe</button>
          <button onClick={() => console.log(dhbc.isConnected)}>log status</button>
        </div>
      </div>
    </div>
  )
}
