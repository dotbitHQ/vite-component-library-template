import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import {
  Button,
  ButtonShape,
  ButtonSize,
  Header,
  LoadingIcon,
  PasteIcon,
  ScanIcon,
  SwapChildProps,
  WarningOutlineIcon,
} from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import clsx from 'clsx'
import { getCamera } from '../../components/QrCodeScanner'
import { ConnectDID } from 'connect-did-sdk'
import { setBackupDeviceData, setMediaStream, setQrCodeData, useWebAuthnState } from '../../store/webAuthnState'
import { useWalletState } from '../../store'

function exceptionToMessage(err: DOMException) {
  if (err.name === 'NotAllowedError') {
    return {
      title: 'No Camera Permission',
      desc: 'Scanning QR code requires access to the camera. Please enable camera permission.',
    }
  } else if (err.name === 'NotFoundError') {
    return {
      title: 'No Camera Found',
      desc: 'No available camera was found to scan QR code. Please try pasting the data directly.',
    }
  } else {
    return {
      title: 'Unknown Error',
      desc: 'Unknown error happened. Please try again or paste the data directly.',
    }
  }
}

function DomException({ err, className }: { err: DOMException; className?: string }) {
  const { title, desc } = exceptionToMessage(err)
  return (
    <div
      className={clsx(
        'flex w-full flex-row items-start justify-start gap-2 rounded-xl border border-amber-300/40 bg-amber-300/5 p-3',
        className,
      )}
    >
      <WarningOutlineIcon className="h-5 w-5 flex-none text-yellow-500" />

      <div className="flex-1">
        <div className="text-[16px] leading-[20px] text-yellow-700">{title}</div>
        <div className="shrink grow basis-0 text-[14px] font-normal text-yellow-700">{desc}</div>
      </div>
    </div>
  )
}

function verifyData(data: string, isTestNet?: boolean) {
  const connectDID = new ConnectDID(isTestNet)
  let result = true
  try {
    connectDID.decodeQRCode(data)
  } catch (err) {
    result = false
  }
  return result
}

export function InputSignature({ transitionRef, transitionStyle }: SwapChildProps) {
  const { goNext, goBack, goTo, onClose } = useSimpleRouter()!
  const { walletSnap } = useWalletState()
  const connectDID = useMemo(() => new ConnectDID(walletSnap.isTestNet), [walletSnap.isTestNet])
  // const [data, setData] = useState('')
  const [permissionError, setPermissionError] = useState<DOMException | undefined>(undefined)
  const [requiringPermission, setRequiringPermission] = useState(false)
  const { qrCodeData: data } = useWebAuthnState()
  const onChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setQrCodeData(e.target.value)
  }, [])

  const onPaste = useCallback(() => {
    navigator.clipboard.readText().then(setQrCodeData, console.error)
  }, [])

  const onClickScan = useCallback(async () => {
    try {
      setRequiringPermission(true)
      const media = await getCamera({ video: { facingMode: 'environment' } })
      setMediaStream(media)
      goTo('ShowScanner')
    } catch (err) {
      if (err instanceof DOMException) {
        setPermissionError(err)
      } else {
        console.error(err)
      }
    } finally {
      setRequiringPermission(false)
    }
  }, [setPermissionError, setRequiringPermission, goTo])

  const isValidData = verifyData(data, walletSnap.isTestNet)

  return (
    <>
      <Header
        title="Add Trusted Device"
        goBack={goBack}
        onClose={onClose}
        className="bg-blur z-10 w-full bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div
        className={'flex w-full flex-col items-center justify-start px-6 pb-6 pt-[76px]'}
        ref={transitionRef}
        style={transitionStyle}
      >
        <div className="text-center text-[14px] leading-tight text-neutral-700">
          Scan the QR code generated by your another device using this device, or paste the data here.
        </div>
        <div className="relative mt-6 w-full">
          <textarea
            className="block h-[146px] w-full resize-none rounded-xl border border-stone-300/20 bg-neutral-100 py-3 pl-4 pr-3 text-[16px] text-neutral-700 focus:border-emerald-400 focus:bg-white focus:outline-offset-1 focus:outline-emerald-400/20 focus:ring-0"
            placeholder="Paste data or scan QR code"
            value={data}
            onChange={onChange}
          />
          <div className="absolute bottom-0 right-0 p-3 align-middle">
            <div className="inline-flex h-[30px] w-[30px] items-center justify-center  rounded-lg border border-slate-600/10 bg-white">
              <PasteIcon onClick={onPaste} className="w-[16px] cursor-pointer" />
            </div>
            {requiringPermission ? (
              <div className="ml-4 inline-flex h-[30px] w-[30px] items-center justify-center  rounded-lg border border-slate-600/10 bg-white">
                <LoadingIcon className="animation-rotate-360-deg w-[18px] cursor-pointer" />
              </div>
            ) : (
              <div className="ml-4 inline-flex h-[30px] w-[30px] items-center justify-center  rounded-lg border border-slate-600/10 bg-white">
                <ScanIcon onClick={onClickScan} className="w-[18px] cursor-pointer" />
              </div>
            )}
          </div>
        </div>
        {data.length > 0 && !isValidData && (
          <div className="mt-1 w-full text-[14px] font-normal text-red-400">Incorrect data</div>
        )}
        {permissionError != null && <DomException className="mt-6" err={permissionError} />}
        <Button
          disabled={data.length === 0 || !isValidData}
          className="mt-6 w-full"
          size={ButtonSize.middle}
          shape={ButtonShape.round}
          onClick={() => {
            setBackupDeviceData(connectDID.decodeQRCode(data))
            goNext?.()
          }}
        >
          Next
        </Button>
      </div>
    </>
  )
}
