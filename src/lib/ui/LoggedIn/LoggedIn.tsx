import {
  DeviceIcon,
  DisconnectIcon,
  Header,
  SwitchIcon,
  SwapChildProps,
  Button,
  ButtonSize,
  ButtonVariant,
} from '../../components'
import { WalletProtocol, CoinType } from '../../constant'
import { getAuthorizeInfo, getMastersAddress, useWalletState } from '../../store'
import { ReactNode, useContext, useEffect } from 'react'
import { collapseString, copyText } from '../../utils'
import { WalletSDKContext } from '../ConnectWallet'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { createToast } from '../../components/Toast'
import { BackupTips } from './BackupTips'
import { DeviceList } from './DeviceList'
import EthIcon from '../Login/icon/eth-icon.svg'
import BscIcon from '../Login/icon/bsc-icon.svg'
import PolygonIcon from '../Login/icon/polygon-icon.svg'
import TronIcon from '../Login/icon/tron-icon.svg'
import DogecoinIcon from '../Login/icon/dogecoin-icon.svg'

export const LoggedIn = ({ transitionRef, transitionStyle }: SwapChildProps) => {
  const { walletSnap } = useWalletState()
  const walletSDK = useContext(WalletSDKContext)!
  const { goTo, onClose } = useSimpleRouter()!
  const onDisconnect = () => {
    goTo('ChainList')
  }
  const onSwitchAddress = () => {
    goTo('AddressList')
  }
  const onShowQRCode = () => {
    goTo('ShowQRCode')
  }

  const icons: Record<CoinType, ReactNode> = {
    [CoinType.btc]: <DeviceIcon className="inline-flex h-[68px] w-[68px]"></DeviceIcon>,
    [CoinType.ckb]: <DeviceIcon className="inline-flex h-[68px] w-[68px]"></DeviceIcon>,
    [CoinType.eth]: <img className="inline-flex h-[68px] w-[68px]" src={EthIcon} alt="ETH" />,
    [CoinType.bsc]: <img className="inline-flex h-[68px] w-[68px]" src={BscIcon} alt="BSC" />,
    [CoinType.matic]: <img className="inline-flex h-[68px] w-[68px]" src={PolygonIcon} alt="Polygon" />,
    [CoinType.trx]: <img className="inline-flex h-[68px] w-[68px]" src={TronIcon} alt="Tron" />,
    [CoinType.doge]: <img className="inline-flex h-[68px] w-[68px]" src={DogecoinIcon} alt="Dogecoin" />,
  }

  const close = () => {
    onClose()
  }

  const disconnect = () => {
    onDisconnect()
    void walletSDK.disconnect()
  }

  const onSwitch = () => {
    onSwitchAddress()
  }

  const onCopy = (text: string) => {
    void copyText(text).then(() => {
      createToast({
        message: '👌 Copied',
      })
    })
  }

  useEffect(() => {
    void getMastersAddress()
    void getAuthorizeInfo()
  }, [])

  return (
    <>
      <Header
        onClose={close}
        className="bg-blur z-10 w-full bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div className="w-full px-6 pb-6 pt-[76px]" ref={transitionRef} style={transitionStyle}>
        <div className="mb-10 text-center">
          {walletSnap.coinType && icons[walletSnap.coinType]}
          <h2 className="mb-1.5 mt-2 text-2xl font-extrabold leading-7">
            {walletSnap.protocol === WalletProtocol.webAuthn ? null : collapseString(walletSnap.address)}
          </h2>
          {walletSnap.protocol === WalletProtocol.webAuthn ? (
            <div className="flex items-center justify-center">
              <span
                className="cursor-pointer text-base font-medium leading-[normal] text-font-secondary"
                onClick={() => {
                  walletSnap.address && onCopy(walletSnap.address)
                }}
              >
                {collapseString(walletSnap.address, 8, 4)}
              </span>
              {walletSnap.ckbAddresses && walletSnap.ckbAddresses?.length > 0 ? (
                <SwitchIcon
                  onClick={onSwitch}
                  className="ml-3 h-4 w-4 cursor-pointer text-font-secondary hover:text-[#5F6570]"
                ></SwitchIcon>
              ) : null}
            </div>
          ) : null}
        </div>
        {walletSnap.protocol === WalletProtocol.webAuthn && walletSnap.canAddDevice ? (
          walletSnap.deviceList && walletSnap.deviceList.length > 0 ? (
            <DeviceList onShowQRCode={onShowQRCode} onDisconnect={disconnect}></DeviceList>
          ) : (
            <BackupTips onShowQRCode={onShowQRCode}></BackupTips>
          )
        ) : null}
        <Button className="mt-6 w-full" size={ButtonSize.large} variant={ButtonVariant.secondary} onClick={disconnect}>
          <DisconnectIcon className="mr-2 h-4 w-4 text-font-secondary"></DisconnectIcon>Disconnect
        </Button>
      </div>
    </>
  )
}
