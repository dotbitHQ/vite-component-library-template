import { useContext, useMemo, useState } from 'react'
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query'
import { Button, ButtonShape, ButtonSize, Header } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWalletState } from '../../store'
import { Emoji } from '../ChooseEmoji'
import { ConnectDID } from 'connect-did-sdk'
import { collapseString } from '../../utils'
import { WalletSDKContext } from '../ConnectWallet'
import { CoinType, WalletProtocol } from '../../constant'
import { setPendingTx, useWebAuthnState } from '../../store/webAuthnState'

export function FinalConfirm() {
  const { goNext, goBack, onClose } = useSimpleRouter()!
  const { walletSnap } = useWalletState()
  const webAuthnState = useWebAuthnState()
  const [checked, setChecked] = useState(false)
  const walletSDK = useContext(WalletSDKContext)

  const signDataQuery = useQuery({
    queryKey: ['FetchSignData', { master: walletSnap.address, slave: webAuthnState.backupDeviceData?.ckbAddr }],
    enabled: false,
    retry: false,
    queryFn: async () => {
      if (walletSnap.address === undefined || webAuthnState.backupDeviceData?.ckbAddr === undefined)
        throw new Error('unreachable')
      const res = await fetch('https://test-webauthn-api.did.id/v1/webauthn/authorize', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          master_ckb_address: walletSnap.address!,
          slave_ckb_address: webAuthnState.backupDeviceData.ckbAddr!,
          operation: 'add',
        }),
      }).then((res) => res.json())
      if (res.err_no !== 0) throw new Error(res.err_msg)
      return res.data
    },
  })

  const sendTransactionMutation = useMutation({
    retry: false,
    mutationFn: async (signData: any) => {
      // const signature = await walletSDK?.signData(signData.sign_list[0].sign_msg)
      const signature = await new ConnectDID(true).requestSignData(signData.sign_list[0].sign_msg.replace('0x', ''))
      const res = await fetch('https://test-webauthn-api.did.id/transaction/send', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sign_key: signData.sign_key,
          sign_list: [
            {
              sign_type: 8,
              sign_msg: signature,
            },
          ],
          sign_address: walletSnap.address,
        }),
      }).then((res) => res.json())
      if (res.err_no !== 0) throw new Error(res.err_msg)
      return res.data
    },
  })

  return (
    <>
      <Header className="p-6" title="Add Device" onClose={onClose} goBack={goBack} />
      <div className="relative flex w-full flex-col items-center justify-start p-6">
        <div className="w-full text-center text-[16px] leading-normal text-neutral-700">
          You are associating the following devices with {collapseString(walletSnap.address, 6, 3)}
        </div>
        <div className="mt-6 flex w-full items-stretch justify-between gap-4 rounded-2xl border border-slate-300 border-opacity-40 bg-gray-50 p-6">
          <div className="h-[44px] flex-none text-center text-[44px] leading-[44px] text-neutral-700">
            <Emoji name={webAuthnState.selectedEmoji!} className="w-8" />
          </div>
          <div className="flex flex-auto flex-col items-start justify-between gap-2">
            <div className="h-[19px] text-[16px] font-semibold leading-[19px] text-neutral-700">
              {webAuthnState.backupDeviceData?.name}
            </div>
            <div className="h-[18px] rounded-md bg-amber-500 bg-opacity-10 px-1 py-0.5 text-[12px] leading-[18px] text-yellow-600">
              New device
            </div>
          </div>
        </div>
        <div className="mt-16 inline-flex w-full items-center justify-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 cursor-pointer rounded-md border-2 border-slate-300 border-opacity-40 text-emerald-400 focus:ring-transparent"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <div className="text-[14px] text-neutral-700">I Trust This Device.</div>
        </div>
        <Button
          disabled={!checked}
          className="m-6 w-full px-5"
          size={ButtonSize.middle}
          shape={ButtonShape.round}
          loading={signDataQuery.isInitialLoading || sendTransactionMutation.isLoading}
          onClick={async () => {
            let signData = signDataQuery.data || (await signDataQuery.refetch()).data
            await sendTransactionMutation.mutateAsync(signData)
            if (sendTransactionMutation.data) {
              setPendingTx(sendTransactionMutation.data.hash)
              goNext && goNext()
            }
          }}
        >
          Next
        </Button>
      </div>
    </>
  )
}
