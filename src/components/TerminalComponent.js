import React, { useEffect, useRef } from 'react'
import { Terminal } from 'xterm'

export default function TerminalComponent() {

  useEffect(()=>{
    // eslint-disable-next-line no-undef
    var term = new Terminal()
    term.open(document.getElementById('terminal'))
    
    window.electronApi.terminalApi.onIncomingTerminalData((data)=>{
      term.write(data)
    })

    term.onData(data=>{
      window.electronApi.terminalApi.writeToTerminal(data)
    })
  }, [])

  return (
    <div className='absolute z-20 w-full bg-black bottom-0 h-1/2 overflow-auto p-4'>
      <div id='terminal' className='h-full'></div>
    </div>
  )
}
