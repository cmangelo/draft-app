export type RankItem = {
  key: string
  position: string
  rank: number
  tier: number
}

export type UpdateRanksRequest = {
  ranks: RankItem[]
}