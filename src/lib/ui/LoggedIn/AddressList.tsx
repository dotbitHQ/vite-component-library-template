import { Header } from '../../components'
import { useWalletState, setWalletState } from '../../store'
import { AddressItem } from '../../components/AddressItem'
import { collapseString } from '../../utils'
import { useSimpleRouter } from '../../components/SimpleRouter'

export const AddressList = () => {
  const router = useSimpleRouter()!
  const { goBack, onClose, prevRouteName: fromOldComponent } = router
  const { walletSnap } = useWalletState()

  const back = () => {
    if (fromOldComponent === 'ChainList') {
      onClose()
    } else {
      goBack?.()
    }
  }

  const onSwitchAddress = (address: string) => {
    setWalletState({ address })
    back()
  }

  return (
    <>
      <Header className="p-6" title="Switch Address" goBack={back} onClose={onClose} />
      <div className="scrollbar-hide mx-6 my-0 max-h-dialog-list-max-height overflow-y-auto">
        <label className="mb-2 block text-[13px] text-[#5F6570]">Generated by this device</label>
        <ul className="mb-3">
          <AddressItem
            address={collapseString(walletSnap.deviceData?.ckbAddr, 8, 4)}
            isCurrent={walletSnap.deviceData?.ckbAddr === walletSnap.address}
            onClick={() => {
              onSwitchAddress(walletSnap.deviceData?.ckbAddr as string)
            }}
          ></AddressItem>
        </ul>
        {walletSnap.ckbAddresses && walletSnap.ckbAddresses?.length > 0 ? (
          <label className="mb-2 block text-[13px] text-[#5F6570]">Associated with this device</label>
        ) : null}
        <ul className="mb-6">
          {walletSnap.ckbAddresses?.map((address) => {
            return (
              <AddressItem
                key={address}
                className="mb-2"
                address={collapseString(address, 8, 4)}
                isCurrent={address === walletSnap.address}
                onClick={() => {
                  onSwitchAddress(address)
                }}
              ></AddressItem>
            )
          })}
        </ul>
      </div>
    </>
  )
}
