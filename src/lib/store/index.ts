import { proxy, snapshot, useSnapshot } from 'valtio'
import { CoinType, WalletProtocol, WebAuthnApi, WebAuthnTestApi } from '../constant'
import { IDeviceData } from 'connect-did-sdk'
import { merge } from 'lodash-es'
import Axios from 'axios'

interface WalletState {
  protocol?: WalletProtocol
  address?: string
  coinType?: CoinType
  hardwareWalletTipsShow?: boolean
  deviceData?: IDeviceData
  ckbAddresses?: string[]
  enableAuthorize?: boolean
  isTestNet?: boolean
}

const WalletStateKey = 'WalletState'

const walletStateLocalStorage = localStorage.getItem(WalletStateKey)

const localWalletState = walletStateLocalStorage
  ? JSON.parse(walletStateLocalStorage)
  : {
      protocol: undefined,
      address: undefined,
      coinType: undefined,
      hardwareWalletTipsShow: true,
      deviceData: undefined,
      ckbAddresses: [],
      enableAuthorize: false,
      isTestNet: false,
    }

export const walletState = proxy<WalletState>(localWalletState)

async function getAuthorizeInfo(address: string) {
  const { isTestNet } = snapshot(walletState)
  const api = isTestNet ? WebAuthnTestApi : WebAuthnApi
  const res = await Axios.post(`${api}/v1/webauthn/authorize-info`, {
    ckb_address: address,
  })
  walletState.enableAuthorize = res.data.data.ckb_address.length > 1
}

export const setWalletState = ({
  protocol,
  address,
  coinType,
  hardwareWalletTipsShow,
  deviceData,
  ckbAddresses,
  enableAuthorize,
  isTestNet,
}: WalletState) => {
  if (protocol) {
    walletState.protocol = protocol
  }
  if (address) {
    walletState.address = address
    void getAuthorizeInfo(address)
  }
  if (coinType) {
    walletState.coinType = coinType
  }
  if (hardwareWalletTipsShow !== undefined) {
    walletState.hardwareWalletTipsShow = hardwareWalletTipsShow
  }
  if (deviceData) {
    walletState.deviceData = merge(walletState.deviceData, deviceData)
  }
  if (ckbAddresses) {
    walletState.ckbAddresses = ckbAddresses
  }
  if (isTestNet !== undefined) {
    walletState.isTestNet = isTestNet
  }
  localStorage.setItem(WalletStateKey, JSON.stringify(walletState))
}

export const resetWalletState = () => {
  walletState.protocol = undefined
  walletState.coinType = undefined
  walletState.address = undefined
  walletState.deviceData = undefined
  walletState.ckbAddresses = []
  walletState.enableAuthorize = false
  walletState.isTestNet = false
  localStorage.setItem(WalletStateKey, JSON.stringify(walletState))
}

export function useWalletState() {
  const walletSnap = useSnapshot(walletState)
  return { walletSnap }
}

export function getWalletState() {
  const walletSnap = snapshot(walletState)
  return { walletSnap }
}
