import axios, { AxiosResponse } from 'axios'
import { CreateDraftRequest, CreateDraftResponse, DraftPlayerRequest, GetDraftResponse, UserDraft } from '../models/draft'
import { Player, PlayerPosition, Version } from '../models/player'
import { UpdateRanksRequest } from '../models/ranks'

const client = axios.create({
  headers: {
    'User-Id': 'christianxcv'
  }
})

export const getDrafts = (): Promise<AxiosResponse<UserDraft[]>> => {
  return client.get<UserDraft[]>('/drafts')
}

export const getDraftDetails = (draftId: string): Promise<AxiosResponse<GetDraftResponse>> => {
  return client.get<GetDraftResponse>(`/drafts/${draftId}`)
}

export const getRanks = (position: PlayerPosition, version?: Version | null): Promise<AxiosResponse<Player[]>> => {
  return client.get<Player[]>(`/ranks/positions/${position}`, { params: { version } })
}

export const saveRanks = (position: PlayerPosition, ranks: UpdateRanksRequest): Promise<AxiosResponse> => {
  return client.put(`/ranks/positions/${position}`, ranks)
}

export const createDraft = (draftConfig: CreateDraftRequest): Promise<AxiosResponse<CreateDraftResponse>> => {
  return client.post<CreateDraftResponse>('/drafts', draftConfig)
}

export const draftPlayer = (
  playerId: string,
  draftId: string,
  pickNumber: number
): Promise<AxiosResponse> => {
  const request: DraftPlayerRequest = {
    playerId,
    pickNumber
  }
  return client.post(`/drafts/${draftId}/picks`, request)
}