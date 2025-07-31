import React from 'react'
import { Box } from '@chakra-ui/react'
import EnterName from './EnterName'
import RealTimeEditor from './RealTimeEditor'
import './App.css'
import { useStore } from './store'

const App = () => {
  const username = useStore(({ username }) => username)

  return (
    <Box minH="100vh" bg="gray.50" px={8} py={8}>
      <Box maxW="1200px" mx="auto">
        {username ? <RealTimeEditor /> : <EnterName />}
      </Box>
    </Box>
  )
}

export default App
