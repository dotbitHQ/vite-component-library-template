import { CopyIcon, DeviceIcon, DisconnectIcon, Header, QRCodeIcon, SwapChildProps, SwitchIcon } from '../../components'
import { CoinType, WalletProtocol } from '../../constant'
import { getAuthorizeInfo, getDotbitAlias, getMastersAddress, useWalletState } from '../../store'
import { ReactNode, useContext, useEffect, useState } from 'react'
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
import BscBg from './bg/bsc.svg'
import DeviceBg from './bg/device.svg'
import DogeBg from './bg/doge.svg'
import EthBg from './bg/eth.svg'
import PolygonBg from './bg/polygon.svg'
import TronBg from './bg/tron.svg'
import { LoggedInButton } from '../../components/LoggedInButton'
import clsx from 'clsx'

export const LoggedIn = ({ transitionRef, transitionStyle }: SwapChildProps) => {
  const { walletSnap } = useWalletState()
  const walletSDK = useContext(WalletSDKContext)!
  const { goTo, onClose } = useSimpleRouter()!
  const [disconnectLoading, setDisconnectLoading] = useState(false)

  const onSwitchAddress = () => {
    goTo('AddressList')
  }

  const onShowAddressQRCode = () => {
    goTo('AddressQRCode')
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

  const bgImage: Record<CoinType, ReactNode> = {
    [CoinType.btc]: <img className="absolute top-0" src={BscBg} alt="" />,
    [CoinType.ckb]: <img className="absolute top-0" src={DeviceBg} alt="" />,
    [CoinType.eth]: <img className="absolute top-0" src={EthBg} alt="" />,
    [CoinType.bsc]: <img className="absolute top-0" src={BscBg} alt="" />,
    [CoinType.matic]: <img className="absolute top-0" src={PolygonBg} alt="" />,
    [CoinType.trx]: <img className="absolute top-0" src={TronBg} alt="" />,
    [CoinType.doge]: <img className="absolute top-0" src={DogeBg} alt="" />,
  }

  const close = () => {
    onClose()
  }

  const disconnect = async () => {
    setDisconnectLoading(true)
    await walletSDK.disconnect()
    goTo('Connect')
    setDisconnectLoading(false)
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
    void getDotbitAlias()
  }, [])

  return (
    <div className={clsx('bg-[#F6F7F9]')}>
      {walletSnap.coinType && bgImage[walletSnap.coinType]}
      <Header
        onClose={close}
        className="relative z-10 w-full p-6 pb-0"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div className="relative w-full px-6 pb-6 pt-[52px]" ref={transitionRef} style={transitionStyle}>
        <div className="text-center">
          {walletSnap.protocol === WalletProtocol.webAuthn ? (
            <>
              {walletSnap.alias ? (
                <div>
                  <div className="break-all text-2xl font-extrabold leading-[normal] text-font-tips">
                    {walletSnap.alias}
                  </div>
                  <div className="mb-6 mt-2 text-base font-extrabold leading-[normal] text-[#31465C]">
                    {collapseString(walletSnap.address)}
                  </div>
                </div>
              ) : (
                <div className="mx-auto mb-6 w-[180px] break-all text-2xl font-extrabold leading-[normal] text-font-tips">
                  {collapseString(walletSnap.address, 26, 4)}
                </div>
              )}
              <div className="mb-8 flex flex-wrap gap-3">
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<CopyIcon className="h-5 w-5 text-[#5F6570]"></CopyIcon>}
                  onClick={() => {
                    walletSnap.address && onCopy(walletSnap.address)
                  }}
                >
                  Copy Address
                </LoggedInButton>
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<QRCodeIcon className="h-5 w-5 text-[#5F6570]"></QRCodeIcon>}
                  onClick={onShowAddressQRCode}
                >
                  QR Code
                </LoggedInButton>
                {walletSnap.ckbAddresses && walletSnap.ckbAddresses?.length > 0 ? (
                  <LoggedInButton
                    className="flex-loggedin-button"
                    icon={<SwitchIcon className="h-5 w-5 text-[#5F6570]"></SwitchIcon>}
                    onClick={onSwitchAddress}
                  >
                    Switch
                  </LoggedInButton>
                ) : null}
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<DisconnectIcon className="h-5 w-5 text-[#5F6570]"></DisconnectIcon>}
                  loading={disconnectLoading}
                  onClick={disconnect}
                >
                  Disconnect
                </LoggedInButton>
              </div>
            </>
          ) : (
            <>
              {walletSnap.coinType && icons[walletSnap.coinType]}
              {walletSnap.alias ? (
                <div>
                  <div className="mt-4 break-all text-[32px] font-extrabold leading-[normal] text-font-tips">
                    {walletSnap.alias}
                  </div>
                  <div className="mb-8 mt-2 text-base font-bold leading-[normal] text-[#31465C]">
                    {collapseString(walletSnap.address)}
                  </div>
                </div>
              ) : (
                <div className="mb-8 mt-4 text-[32px] font-extrabold leading-[normal] text-font-tips">
                  {collapseString(walletSnap.address)}
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<CopyIcon className="h-5 w-5 text-[#5F6570]"></CopyIcon>}
                  onClick={() => {
                    walletSnap.address && onCopy(walletSnap.address)
                  }}
                >
                  Copy Address
                </LoggedInButton>
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<QRCodeIcon className="h-5 w-5 text-[#5F6570]"></QRCodeIcon>}
                  onClick={onShowAddressQRCode}
                >
                  QR Code
                </LoggedInButton>
                <LoggedInButton
                  className="flex-loggedin-button"
                  icon={<DisconnectIcon className="h-5 w-5 text-[#5F6570]"></DisconnectIcon>}
                  loading={disconnectLoading}
                  onClick={disconnect}
                >
                  Disconnect
                </LoggedInButton>
              </div>
            </>
          )}
        </div>
        {walletSnap.protocol === WalletProtocol.webAuthn && walletSnap.canAddDevice ? (
          walletSnap.deviceList && walletSnap.deviceList.length > 0 ? (
            <DeviceList onShowQRCode={onShowQRCode} onDisconnect={disconnect}></DeviceList>
          ) : (
            <BackupTips onShowQRCode={onShowQRCode}></BackupTips>
          )
        ) : null}
      </div>
    </div>
  )
}
