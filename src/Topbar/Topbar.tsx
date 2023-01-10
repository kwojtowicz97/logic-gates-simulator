import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { TProject } from '../App'

type TTopbarProps = {
  projects: TProject[]
  setProjects: Dispatch<SetStateAction<TProject[]>>
  setCurrentProject: Dispatch<SetStateAction<string | null>>
  currentProject: string | null
}

const Topbar = ({
  projects,
  setProjects,
  currentProject,
  setCurrentProject,
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
      console.log('project not found')
      return
    }
    setProjects((projects) =>
      projects.map((project) =>
        project.name === currentProject ? { ...project, name: name! } : project
      )
    )
    setCurrentProject(name)
  }

  const autosaveChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setProjects(
      projects.map((project) =>
        project.name === currentProject
          ? { ...project, autosave: e.target.checked }
          : project
      )
    )
  }

  useEffect(() => {
    setName(currentProject)
  }, [currentProject])

  const current = projects.find((project) => project.name === currentProject)

  return (
    <div
      style={{
        width: '100%',
        height: '50px',
        background: '#ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0px 10px',
        boxSizing: 'border-box',
      }}
    >
      <div>
        <input
          value={name || ''}
          onChange={(e) => setName(e.currentTarget.value)}
          type='text'
          onBlur={onBlurHandler}
        />
      </div>
      <div style={{ display: 'flex' }}>
        <div>{current?.upToDate ? 'saved' : 'not saved'}</div>
        <button style={{ marginRight: '20px' }}>Save</button>
        <label htmlFor='autosave'>Autosave</label>
        <input
          id='autosave'
          checked={current?.autosave || false}
          onChange={autosaveChangeHandler}
          type='checkbox'
        />
      </div>
    </div>
  )
}

export default Topbar
