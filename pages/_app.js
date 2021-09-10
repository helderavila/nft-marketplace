import { ChakraProvider, Box, Text, Link, HStack } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Box
        as='header'
        my='0'
        mx='auto'
        w='1200px'
        display='flex'
        alignItems='center'
        justifyContent='center'
        py='16px'
      >
        <HStack spacing='8'>
          <Link href='/'>
            <Text>Home</Text>
          </Link>
          <Link href='/create-item'>
            <Text>Sell</Text>
          </Link>
          <Link href='/my-assets'>
            <Text>My NFTs</Text>
          </Link>
          <Link href='/creator-dashboard'>
            <Text>Creator</Text>
          </Link>
        </HStack>
      </Box>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
