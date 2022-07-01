import React from "react"
import { ConnectButton } from "web3uikit"
import { useWeb3Contract } from "react-moralis"

const Header = () => {
    return (
        <div className="border-b-2 flex flex-row">
            <h1 className="py-4 px-4 font-blog text-3xl">Decentralized lottery</h1>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false}>Connect to wallet</ConnectButton>
            </div>
        </div>
    )
}

export default Header
