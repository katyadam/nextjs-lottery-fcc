import React, { useEffect, useState } from "react"
import { abi, contractAddresses } from "../constance"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

const LotteryEntrance = () => {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const dispatch = useNotification()

    const handleNewNotification = () => {
        dispatch({ type: "info", message: "Transaction completed", title: "Tx notification", icon: "bell", position: "bottomL" })
    }

    async function updateUi() {
        const entranceFeeFromContract = (await getEntranceFee()).toString()
        const numPlayersFromContract = (await getNumberOfPlayers()).toNumber()
        const recentWinnerFromContract = await getRecentWinner()

        console.log(numPlayersFromContract)
        console.log(entranceFeeFromContract)
        console.log(recentWinnerFromContract)

        setEntranceFee(entranceFeeFromContract)
        setNumPlayers(numPlayersFromContract)
        setRecentWinner(recentWinnerFromContract)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUi()
    }

    return (
        <div className="p-5">
            {raffleAddress ? (
                <div>
                    <div className="pb-4">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                            onClick={async () => {
                                await enterRaffle({
                                    onSuccess: handleSuccess,
                                    onError: (error) => {
                                        console.log(error)
                                    },
                                })
                            }}
                            disabled={isLoading || isFetching}
                        >
                            {isFetching || isLoading ? <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div> : <div>Enter Raffle</div>}
                        </button>
                    </div>

                    <div className="flex flex-row mg">
                        <div className="mr-5">Entrance fee is: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                        <div className="mr-5">Number of players: {numPlayers}</div>
                        <div className="mr-5">Recent winner: {recentWinner}</div>
                    </div>
                </div>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default LotteryEntrance
