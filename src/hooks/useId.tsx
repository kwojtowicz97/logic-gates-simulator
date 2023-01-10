import React from 'react'
import { useLocalStorage } from './useLocalStorage'

import { useState } from 'react'

function useId() {
  const [counter, setCounter] = useLocalStorage('lgsId', 0)
  const getId = () => {
    let returnValue = 0
    setCounter((counter) => {
      returnValue = counter
      return counter + 1
    })
    console.log(returnValue)
    return returnValue
  }
  return getId
}

// let id = 0

export default useId
