<script lang="ts">
	import { ethers } from 'ethers';
	import { onMount } from 'svelte';
	import useEthers from '$lib/useEthers';
	import HelloWorldContract from '$contracts/HelloWorld.sol/HelloWorld.json';

	const { signer, provider, requestSigner, onMount: ethersOnMount } = useEthers();

	let signerBalance: ethers.BigNumberish;
	let signerAddress = '';
	$: signerEthBalance = signerBalance && ethers.utils.formatEther(signerBalance);

	const HELLO_WORLD_CONTRACT_DEPLOYED_ADDRESS = '0xa39913BE7118E7B637d7A0491A1bF785980d721f';

	let helloWorldContractMessage = '';

	onMount(async () => {
		await ethersOnMount();
		onFetchSigner();
		const helloWorldContract = new ethers.Contract(
			HELLO_WORLD_CONTRACT_DEPLOYED_ADDRESS,
			HelloWorldContract.abi,
			$provider
		);
		helloWorldContractMessage = await helloWorldContract.message();
	});

	async function getSigner() {
		await requestSigner();
		onFetchSigner();
	}

	async function onFetchSigner() {
		if ($signer) {
			signerBalance = await $signer.getBalance();
			signerAddress = await $signer.getAddress();
		}
	}

	let messageInput = '';

	async function updateMessage() {
		if (messageInput.length === 0) {
			return;
		}

		const helloWorldContract = new ethers.Contract(
			HELLO_WORLD_CONTRACT_DEPLOYED_ADDRESS,
			HelloWorldContract.abi,
			$signer
		);

		const tx = await helloWorldContract.update(messageInput);
		console.log({ tx });

		messageInput = '';
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div>
	<h2>My Wallet</h2>
	{#if $signer}
		{#if signerAddress}
			<div>
				Address: <a href={`https://ropsten.etherscan.io/address/${signerAddress}`} target="_blank">
					{signerAddress}
				</a>
			</div>
		{/if}
		{#if signerEthBalance}
			<p>Balance: {signerEthBalance} ETH</p>
		{/if}
	{:else}
		<button on:click={getSigner}> Connect to wallet </button>
	{/if}
</div>

{#if $signer}
	<div>
		<a
			href={`https://ropsten.etherscan.io/address/${HELLO_WORLD_CONTRACT_DEPLOYED_ADDRESS}`}
			target="_blank"
		>
			<h2>Contract Hello world</h2>
		</a>
		<div>
			{#if helloWorldContractMessage}
				Contract Message: "{helloWorldContractMessage}"
			{/if}
		</div>
		<input bind:value={messageInput} />
		<button on:click={updateMessage}>Update contract message</button>
	</div>
{/if}
