import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { TProject } from '../types'
import './Topbar.css'

type TTopbarProps = {
  projects: TProject[]
  setProjects: Dispatch<SetStateAction<TProject[]>>
  setCurrentProject: Dispatch<SetStateAction<string | null>>
  currentProject: string | null
  saveProject: () => void
  autosaveChangeHandler: ((e: ChangeEvent<HTMLInputElement>) => void) | null
}

const Topbar = ({
  projects,
  setProjects,
  currentProject,
  setCurrentProject,
  saveProject,
  autosaveChangeHandler,
}: TTopbarProps) => {
  const [name, setName] = useState(currentProject)

  const validateProjectName = (name: string) => {
    if (name === null || name === '') return false
    return true
  }

  const onBlurHandler = () => {
    if (!validateProjectName) return
    const project = projects.find((p) => p.name === currentProject)
    if (!project) {
      console.log('project not found', currentProject)
      return
    }
    setProjects((projects) =>
      projects.map((project) =>
        project.name === currentProject ? { ...project, name: name! } : project
      )
    )
    setCurrentProject(name)
  }

  useEffect(() => {
    setName(currentProject)
  }, [currentProject])

  const current = projects.find((project) => project.name === currentProject)

  return (
    <div className='topbar'>
      <div>
        <input
          className='project-name'
          value={name || ''}
          onChange={(e) => setName(e.currentTarget.value)}
          type='text'
          onBlur={onBlurHandler}
        />
      </div>
      <div style={{ color: current?.upToDate ? 'green' : 'red' }}>
        {current?.upToDate ? (
          <>
            <i
              style={{ marginRight: '0.3rem' }}
              className='fa-solid fa-check'
            ></i>
            saved
          </>
        ) : (
          <>
            <i
              style={{ marginRight: '0.3rem' }}
              className='fa-solid fa-xmark'
            ></i>
            not saved
          </>
        )}
      </div>
      <button onClick={() => saveProject()}>Save</button>
      <span>
        <label htmlFor='autosave'>Autosave</label>
        <input
          id='autosave'
          checked={current?.autosave || false}
          onChange={(e) =>
            autosaveChangeHandler ? autosaveChangeHandler(e) : () => {}
          }
          type='checkbox'
        />
      </span>
    </div>
  )
}

export default Topbar
