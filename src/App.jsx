import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import LandingPage from './LandingPage'
import EnterName from './EnterName'
import RealTimeEditor from './RealTimeEditor'
import './App.css'
import { useStore } from './store'

const App = () => {
  const [showLanding, setShowLanding] = useState(true)
  const username = useStore(({ username }) => username)

  const handleGetStarted = () => {
    setShowLanding(false)
  }

  const handleBackToLanding = () => {
    setShowLanding(true)
  }

  if (showLanding) {
    return <LandingPage onGetStarted={handleGetStarted} />
  }

  return (
    <Box minH="100vh" bg="gray.50" px={8} py={8}>
      <Box maxW="1200px" mx="auto">
        {username ? <RealTimeEditor /> : <EnterName onBackToLanding={handleBackToLanding} />}
      </Box>
    </Box>
  )
}

export default App
