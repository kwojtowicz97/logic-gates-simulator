import React from 'react'
import './Description.css'

type TDescriptionProps = {
  name: string
  description: string
}

const Description = ({ name, description }: TDescriptionProps) => {
  return (
    <div className='description-container'>
      <h1>{name}</h1>
      <div>{description}</div>
    </div>
  )
}

export default Description
