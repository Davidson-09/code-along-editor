import React, { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import cancelIcon from '../assets/icons/cancel.svg'

export default function TerminalComponent({setTerminalIsVisible, terminalIsVisible}) {

  const [termHeight, setTermHeight] = useState('0')

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

  useEffect(()=>{
    const currentHeight = terminalIsVisible? 'h-1/2' : 'h-0'
    setTermHeight(currentHeight)
  }, [terminalIsVisible])

  return (
    <div className={`absolute z-20 w-full bg-black bottom-0 ${termHeight}`}>
      <div className='w-full bg-gray-200 flex justify-end p-1 absolute top-0'>
        <div className='hover:bg-slate-300 p-2 rounded-full' onClick={()=>setTerminalIsVisible(false)}>
          <img src={cancelIcon} alt='close' className='w-5'/>
        </div>
      </div>
      <div className='w-full bg-black p-4 pt-7 overflow-auto'>
        <div id='terminal'></div>
      </div>
    </div>
  )
}
