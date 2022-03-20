import { ethers } from 'ethers';
import { get, writable } from 'svelte/store';

declare var window: any

// A Signer is a class which (usually) in some way directly or indirectly has access to a private key,
// which can sign messages and transactions to authorize the network to charge your account
// ether to perform operations.
const signer = writable<ethers.providers.JsonRpcSigner>();

// A Provider (in ethers) is a class which provides an abstraction for a connection
// to the Ethereum Network. It provides read-only access to the Blockchain and its status.
const provider = writable<ethers.providers.Web3Provider>();

function fetchProvider() {
	provider.set(new ethers.providers.Web3Provider(window.ethereum))
}

function getCurrentSigner() {
	const currentProvider = get(provider)

	try {
		const currentSigner = currentProvider.getSigner();
		signer.set(currentSigner);
	} catch (err) {
		console.error({ err })
	}

}

async function requestSigner() {
	const currentProvider = get(provider)
	// MetaMask requires requesting permission to connect users accounts
	await currentProvider.send('eth_requestAccounts', []);
	const currentSigner = currentProvider.getSigner();
	signer.set(currentSigner);
}

export default function useEthers() {
	return {
		signer,
		provider,
		async onMount() {
			fetchProvider()
			await getCurrentSigner()
		},
		requestSigner
	};
}
