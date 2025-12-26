import { WalletProvider as UseWalletProvider, WalletId, WalletManager } from '@txnlab/use-wallet-react'
import { ReactNode, useMemo } from 'react'

interface Props {
  children: ReactNode
}

export default function WalletProvider({ children }: Props) {
  const walletManager = useMemo(() => {
    return new WalletManager({
      wallets: [
        WalletId.PERA,
        WalletId.DEFLY,
        WalletId.LUTE,
        WalletId.EXODUS,
        {
          id: WalletId.WALLETCONNECT,
          options: {
            projectId: '8da63ba913e2b4064fd01b167b385266'
          }
        }
      ],
      network: 'mainnet'
    })
  }, [])

  return (
    <UseWalletProvider manager={walletManager}>
      {children}
    </UseWalletProvider>
  )
}
