import { FC, useEffect, useState, useCallback, useRef } from 'react'
import { APP_NAME } from '@/lib/consts'
import ConnectWallet from '@/components/ConnectWallet'
import { BookOpenIcon, CodeIcon, ShareIcon } from '@heroicons/react/outline'
import ThemeSwitcher from '@/components/ThemeSwitcher'
import { ethers } from 'ethers'
import { descABI } from '../abi/descABI'
import { seedABI } from '../abi/seedABI'

const provider = new ethers.providers.JsonRpcProvider(
	`https://eth-mainnet.g.alchemy.com/v2/Vnazk5T1L5ETZuhbMjd1lSCJK4tWc2VU`
)
const Home: FC = () => {
	const [blockNumber, setBlockNumber] = useState<number | undefined>()
	const [nounsId, setNounsId] = useState<number | undefined>()
	const [url, setUrl] = useState<string>('')
	const idRef = useRef()
	const fetch = useCallback(async () => {
		provider.getBlockNumber().then(value => {
			setBlockNumber(value)
		})
		//@ts-ignore
		const id = idRef?.current?.value ? idRef.current.value : 1
		const seed = new ethers.Contract('0xCC8a0FB5ab3C7132c1b2A0109142Fb112c4Ce515', seedABI, provider)
		const seedRes = await seed.generateSeed(Number(id) + 1, '0x11fb55d9580CdBfB83DE3510fF5Ba74309800Ad1')
		console.log(seedRes)
		const desc = new ethers.Contract('0x11fb55d9580CdBfB83DE3510fF5Ba74309800Ad1', descABI, provider)
		const descRes = await desc.genericDataURI('', '', seedRes)
		console.log(descRes)
		const json = atob(descRes.substring(29))
		const result = JSON.parse(json)
		console.log(result)
		setUrl(result.image)
	}, [])
	useEffect(() => {
		fetch()
		setInterval(fetch, 5000)
	}, [fetch])
	return (
		<div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-gray-900">
			<div className="flex text-3xl font-mono font-bold pt-12 justify-center">Lil Nouns predict</div>
			<div className="flex flex-col w-[360px] p-6 mt-12 bg-white rounded dark:bg-gray-700">
				{' '}
				<div className="text-3l">
					<span className="font-bold">block number: </span>
					<span>{blockNumber}</span>
				</div>
				<div className="text-3l flex gap-2">
					<span className="font-bold">Input current lil noun id: </span>
					<input ref={idRef} className="w-14 bg-gray-100 dark:bg-gray-400 rounded"></input>{' '}
					{/* <button className="bg-gray-100 rounded text-sm px-4 w-14 flex justify-center" onClick={() => {}}>
						submit
					</button> */}
				</div>
				<img src={url} width={300} height={300}></img>
			</div>
			<div className="text-l mt-32">
				by{' '}
				<a href="https://twitter.com/d0d0d9real" className="decoration-1">
					{' '}
					harlan009.
				</a>
				<a href="https://github.com/beyond009/LilNouns-predict" className="decoration-1 pl-4">
					{' '}
					github
				</a>
			</div>
		</div>
	)
}

export default Home
