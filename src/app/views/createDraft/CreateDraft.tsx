import { FC, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CreateDraftRequest } from '../../../models/draft'
import { createDraftThunk } from '../../../store/slices/draftArenaSlice'

type CreateDraftParamsField = {
  value: number
  name: string
  min?: number
  max?: () => number
}

type CreateDraftParams = {
  quarterback: CreateDraftParamsField
  runningback: CreateDraftParamsField
  wideReceiver: CreateDraftParamsField
  tightEnd: CreateDraftParamsField
  flex: CreateDraftParamsField
  superflex: CreateDraftParamsField
  bench: CreateDraftParamsField
  defense: CreateDraftParamsField
  kicker: CreateDraftParamsField
  numDrafters: CreateDraftParamsField
  draftPosition: CreateDraftParamsField
}

export const CreateDraft: FC = () => {
  const dispatch = useDispatch()
  const [draftConfig, setDraftConfig] = useState<CreateDraftParams>({
    quarterback: { value: 1, name: 'QB' },
    runningback: { value: 2, name: 'RB' },
    wideReceiver: { value: 2, name: 'WR' },
    tightEnd: { value: 1, name: 'TE' },
    flex: { value: 1, name: 'Flex' },
    superflex: { value: 0, name: 'Superflex' },
    bench: { value: 6, name: 'Bench' },
    defense: { value: 1, name: 'DST' },
    kicker: { value: 1, name: 'K' },
    numDrafters: { 
      value: 12, 
      name: 'Teams',
      min: 1
    },
    draftPosition: { 
      value: 1, 
      name: 'Draft Position',
      min: 1,
      max: (): number => draftConfig.numDrafters.value 
    }
  })

  const onChange = (e: any, key: keyof CreateDraftParams) => {
    const value = parseInt(e.target.value)
    if (isNaN(value)) return
    const min = draftConfig[key].min || 0
    const max = draftConfig[key].max ? (draftConfig[key].max as (() => number))() : Number.MAX_VALUE

    if (value < min || value > max) return 

    setDraftConfig({
      ...draftConfig,
      [key]: {
          ...draftConfig[key],
          value: e.target.value
      }
    });
  }

  const decrement = (key: keyof CreateDraftParams) => {
    const min = draftConfig[key].min || 0
    if (draftConfig[key].value === min) return

    // If decreasing numDrafters and draftPosition == numDrafters, also decrease draftPosition
    let newDraftPosition = draftConfig.draftPosition.value
    if (key === 'numDrafters' && draftConfig.draftPosition.value === draftConfig.numDrafters.value) 
      newDraftPosition -= 1

    setDraftConfig({
      ...draftConfig,
      draftPosition: {
        ...draftConfig.draftPosition,
        value: newDraftPosition
      },
      [key]: {
        ...draftConfig[key],
        value: draftConfig[key].value - 1
      },
    });
  }

  const increment = (key: keyof CreateDraftParams) => {
    if (key === 'draftPosition' && draftConfig.numDrafters.value === draftConfig.draftPosition.value) return

    const max = draftConfig[key].max ? (draftConfig[key].max as (() => number))() : Number.MAX_VALUE
    if (draftConfig[key].value === max) return

    setDraftConfig({
      ...draftConfig,
      [key]: {
        ...draftConfig[key],
        value: draftConfig[key].value + 1
      }
    });
  }

  const renderDraftOptions = () => {
    return Object.keys(draftConfig)
      .map((key: string) => ({ key, value: draftConfig[key as keyof CreateDraftParams] }))
      .map(option => {
        return (
          <div className="draft-option" key={option.key}>
            <span className="name">{option.value.name}</span>
            <div className="incrementer">
              <div onClick={() => decrement(option.key as keyof CreateDraftParams)}>-</div>
              <input type="number" value={option.value.value} onChange={(e) => onChange(e, option.key as keyof CreateDraftParams)} />
              <div onClick={() => increment(option.key  as keyof CreateDraftParams)}>+</div>
            </div>
          </div>
        );
      });
  }

  const createDraft = () => {
    console.log('creating draft')
    const req: CreateDraftRequest = {
      draftConfig: {
        playerCount: {
          quarterback: draftConfig.quarterback.value,
          runningback: draftConfig.runningback.value,
          wideReceiver: draftConfig.wideReceiver.value,
          tightEnd: draftConfig.tightEnd.value,
          flex: draftConfig.flex.value,
          superflex: draftConfig.superflex.value,
          bench: draftConfig.bench.value,
          defense: draftConfig.defense.value,
          kicker: draftConfig.kicker.value
        },
        draftName: `${draftConfig.numDrafters.value} Person Draft`,
        numDrafters: draftConfig.numDrafters.value,
        owner: '',
      },
      ownerDraftPosition: draftConfig.draftPosition.value
    }
    dispatch(createDraftThunk(req))
  }


  return (
    <div className="CreateDraft">
      <h1>Create a Draft</h1>
      <div className="card">
          {renderDraftOptions()}
      </div>
      <div className="button-container">
          <button onClick={createDraft}>Create Draft</button>
      </div>
    </div>
  )
}