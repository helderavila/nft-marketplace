import { useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import Web3Modal from "web3modal";
import { Text, Box, Grid, Button } from "@chakra-ui/react";
import Image from "next/image";

import { nftAddress, nftmarketAddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState("not-loaded");

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider();
    const tokenContract = new ethers.Contract(nftAddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketAddress,
      Market.abi,
      provider
    );

    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(i.price.toString(), "ether");
        const item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };

        return item;
      })
    );

    setNfts(items);
    setLoading("loaded");
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await Web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketAddress, Market.abi, signer);

    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    const transaction = await contract.createMarketSale(
      nftAddress,
      nft.tokenId,
      {
        value: price,
      }
    );

    await transaction.wait();
    loadNFTs();
  }

  useEffect(() => {
    loadNFTs();
  }, []);

  if (loading === "loaded" && !nfts.length)
    return (
      <Box maxWidth='1200px' mx='auto'>
        <Text textAlign="center">No items in marketplace</Text>
      </Box>
    );

  return (
    <Box maxWidth='1200px' mx='auto'>
      <Grid templateColumns='repeat(5, 1fr)' gap={6}>
        {nfts.map((nft, i) => (
          <Box key={i}>
            <Image src={nft.image} alt={nft.name} height="350" width="350" />
            <Box>
              <Text>{nft.name}</Text>
              <Text>{nft.description}</Text>
              <Button onClick={() => buyNft(nft)}>
                {nft.price}
                Buy
              </Button>
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
