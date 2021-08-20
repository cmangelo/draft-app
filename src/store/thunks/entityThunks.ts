import { createAsyncThunk } from '@reduxjs/toolkit'
import { AxiosResponse } from 'axios'
import { getRanks } from '../../clients/proxyClient'
import { Player, RankingsVersions } from '../../models/player'

