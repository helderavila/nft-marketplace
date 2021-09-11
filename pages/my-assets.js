import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from "web3modal"
import { Text, Box, Grid, Button } from "@chakra-ui/react";
import Image from 'next/image'

import {
  nftmarketAddress, nftAddress
} from '../config'

import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'

export default function MyAssets() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
      
    const marketContract = new ethers.Contract(nftmarketAddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider)
    const data = await marketContract.fetchMyNFTs()
    
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await tokenContract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }

  if (loadingState === "loaded" && !nfts.length)
  return (
    <Box maxWidth='1200px' mx='auto'>
      <Text textAlign="center">No assets owned</Text>
    </Box>
  );

  return (
    <Box maxWidth='1200px' mx='auto'>
    <Grid templateColumns='repeat(5, 1fr)' gap={6}>
      {nfts.map((nft, i) => (
        <Box key={i}>
          <Image src={nft.image} alt={nft.name} height="350" width="350" />
          <Box>
            <Text>{nft.price}</Text>
          </Box>
        </Box>
      ))}
    </Grid>
  </Box>
  )
}