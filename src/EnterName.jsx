import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Plus, Code2, Globe, Check, AlertCircle, ArrowLeft } from 'lucide-react'
import { useMutation } from 'react-query'
import { useStore } from './store'
import axios from 'axios'

const EnterName = ({ onBackToLanding }) => {
  const inputRef = useRef()
  const joinNameRef = useRef()
  const roomIdRef = useRef()
  const [toasts, setToasts] = useState([])
  const [isCreating, setIsCreating] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  
  const { setUsername, setRoomId } = useStore(({ setUsername, setRoomId }) => ({
    setUsername,
    setRoomId,
  }))

  const showToast = (toast) => {
    const id = Date.now()
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration || 4000)
  }

  const { mutateAsync } = useMutation(({ username, roomId, uri }) => {
    return axios.post(`http://localhost:3002/${uri}`, {
      username,
      roomId,
    })
  })

  const createRoom = async () => {
    const value = inputRef.current?.value

    if (!value) {
      showToast({
        title: 'Please enter your username',
        status: 'error',
        duration: 4000,
      })
      return
    }
    
    setIsCreating(true)
    
    try {
      const response = await mutateAsync({ username: value, uri: 'create-room-with-user' })
      console.log('Room creation response:', response)
      
      if (response && response.data && response.data.roomId) {
        setRoomId(response.data.roomId)
        showToast({
          title: 'Room created successfully!',
          description: `Room ID: ${response.data.roomId}`,
          status: 'success',
          duration: 6000,
        })
        setUsername(value)
      } else {
        showToast({
          title: 'Room created but no room ID received',
          status: 'error',
          duration: 4000,
        })
      }
    } catch (error) {
      console.error('Error creating room:', error)
      showToast({
        title: 'Failed to create room',
        description: error.message || 'Please try again',
        status: 'error',
        duration: 4000,
      })
    } finally {
      setIsCreating(false)
    }
  }

  const enterRoom = async () => {
    const value = joinNameRef.current?.value
    const roomIdValue = roomIdRef.current?.value

    if (!value || !roomIdValue) {
      showToast({
        title: 'Please enter text in both inputs',
        status: 'error',
        duration: 4000,
      })
      return
    }
    
    setIsJoining(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setRoomId(roomIdValue)
      setUsername(value)
      showToast({
        title: 'Joining room...',
        status: 'success',
        duration: 3000,
      })
    } finally {
      setIsJoining(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    loading: {
      scale: [1, 1.1, 1],
      transition: { repeat: Infinity, duration: 1 }
    }
  }

  const toastVariants = {
    hidden: { 
      opacity: 0, 
      x: 300, 
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      x: 300, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%)',
      margin: 0,
      padding: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'auto'
    }}>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          overflow-x: hidden;
        }
        
        body {
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%) !important;
        }
      `}</style>
      <style jsx>{`
        .container {
          max-width: 480px;
          margin: 0 auto;
          padding: 80px 20px 40px 20px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        body {
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%);
          min-height: 100vh;
        }

        .back-button {
          position: fixed;
          top: 20px;
          left: 20px;
          background: rgba(15, 15, 35, 0.9);
          border: 1px solid rgba(64, 224, 255, 0.3);
          color: #40e0ff;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
          z-index: 100;
        }

        .back-button:hover {
          background: rgba(15, 15, 35, 1);
          border-color: #40e0ff;
          transform: translateX(-2px);
          box-shadow: 0 4px 12px rgba(64, 224, 255, 0.2);
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0 0 12px 0;
          background: linear-gradient(135deg, #40e0ff 0%, #92fe9d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.1rem;
          color: #94a3b8;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .card {
          background: rgba(15, 15, 35, 0.8);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(64, 224, 255, 0.2);
          backdrop-filter: blur(20px);
        }

        .section {
          margin-bottom: 32px;
        }

        .section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0 0 16px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .input-group {
          position: relative;
          margin-bottom: 16px;
        }

        .input {
          width: 100%;
          padding: 16px 20px;
          font-size: 1rem;
          border: 2px solid rgba(64, 224, 255, 0.3);
          color: #e2e8f0;
          border-radius: 12px;
          background: rgba(26, 26, 46, 0.8);
          transition: all 0.2s ease;
          outline: none;
          box-sizing: border-box;
        }

        .input::placeholder {
          color: #94a3b8;
          opacity: 1;
        }

        .input:hover {
          border-color: rgba(64, 224, 255, 0.5);
          background: rgba(26, 26, 46, 0.9);
        }

        .input:focus {
          border-color: #40e0ff;
          background: rgba(26, 26, 46, 1);
          box-shadow: 0 0 0 3px rgba(64, 224, 255, 0.1);
        }

        .input-with-button {
          padding-right: 100px;
        }

        .input-button {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          padding: 8px 16px;
          background: linear-gradient(135deg, #40e0ff 0%, #00c9ff 100%);
          color: #0f0f23;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 80px;
          justify-content: center;
        }

        .input-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .input-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #00c9ff 0%, #40e0ff 100%);
          box-shadow: 0 4px 12px rgba(64, 224, 255, 0.3);
        }

        .input-button.green {
          background: linear-gradient(135deg, #92fe9d 0%, #00f5a0 100%);
        }

        .input-button.green:hover:not(:disabled) {
          background: linear-gradient(135deg, #00f5a0 0%, #92fe9d 100%);
          box-shadow: 0 4px 12px rgba(146, 254, 157, 0.3);
        }

        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(64, 224, 255, 0.3), transparent);
          margin: 32px 0;
          position: relative;
        }

        .divider::after {
          content: 'OR';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(15, 15, 35, 0.8);
          padding: 0 16px;
          font-size: 0.75rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 1px;
        }

        .join-inputs {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .toast {
          background: rgba(15, 15, 35, 0.95);
          border-radius: 12px;
          padding: 16px 20px;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
          border-left: 4px solid;
          max-width: 400px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(64, 224, 255, 0.2);
        }

        .toast.success {
          border-left-color: #92fe9d;
        }

        .toast.error {
          border-left-color: #ef4444;
        }

        .toast-content {
          flex: 1;
        }

        .toast-title {
          font-weight: 600;
          color: #e2e8f0;
          margin: 0 0 4px 0;
          font-size: 0.875rem;
        }

        .toast-description {
          color: #94a3b8;
          font-size: 0.8rem;
          margin: 0;
        }

        .toast-icon {
          margin-top: 2px;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(15, 15, 35, 0.3);
          border-top: 2px solid #0f0f23;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 600px) {
          .container {
            padding: 60px 16px 40px 16px;
          }

          .title {
            font-size: 2rem;
          }

          .card {
            padding: 24px;
          }

          .toast-container {
            left: 16px;
            right: 16px;
          }

          .toast {
            max-width: none;
          }

          .back-button {
            top: 16px;
            left: 16px;
          }
        }
      `}</style>

      {onBackToLanding && (
        <motion.button 
          className="back-button" 
          onClick={onBackToLanding}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ x: -2 }}
        >
          <ArrowLeft size={16} />
          Back to Landing
        </motion.button>
      )}

      <motion.div 
        className="container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="header" variants={itemVariants}>
          <motion.h1 
            className="title"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: 0.2 
            }}
          >
            CodeSync
          </motion.h1>
          <motion.p 
            className="subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <Globe size={20} />
            </motion.div>
            Collaborate with others in real-time
          </motion.p>
        </motion.div>

        <motion.div 
          className="card"
          variants={itemVariants}
          whileHover={{ y: -5, boxShadow: "0 25px 30px -5px rgba(0, 0, 0, 0.15)" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div 
            className="section"
            variants={itemVariants}
          >
            <motion.h2 
              className="section-title"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Plus size={18} />
              </motion.div>
              Create a new room
            </motion.h2>
            <motion.div 
              className="input-group"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.input
                className="input input-with-button"
                placeholder="Enter your name"
                ref={inputRef}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.button 
                className="input-button"
                onClick={createRoom}
                disabled={isCreating}
                variants={buttonVariants}
                initial="idle"
                whileHover="hover"
                whileTap="tap"
                animate={isCreating ? "loading" : "idle"}
              >
                {isCreating ? (
                  <div className="loading-spinner" />
                ) : (
                  <Plus size={16} />
                )}
                {isCreating ? 'Creating...' : 'Create'}
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          />

          <motion.div 
            className="section"
            variants={itemVariants}
          >
            <motion.h2 
              className="section-title"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Users size={18} />
              </motion.div>
              Join existing room
            </motion.h2>
            <div className="join-inputs">
              <motion.input
                className="input"
                placeholder="Enter your name"
                ref={joinNameRef}
                whileFocus={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <motion.div 
                className="input-group"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.input
                  className="input input-with-button"
                  placeholder="Enter your room ID"
                  ref={roomIdRef}
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <motion.button 
                  className="input-button green"
                  onClick={enterRoom}
                  disabled={isJoining}
                  variants={buttonVariants}
                  initial="idle"
                  whileHover="hover"
                  whileTap="tap"
                  animate={isJoining ? "loading" : "idle"}
                >
                  {isJoining ? (
                    <div className="loading-spinner" />
                  ) : (
                    <Users size={16} />
                  )}
                  {isJoining ? 'Joining...' : 'Join'}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`toast ${toast.status}`}
              variants={toastVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
            >
              <div className="toast-icon">
                {toast.status === 'success' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <Check size={18} color="#92fe9d" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <AlertCircle size={18} color="#f56565" />
                  </motion.div>
                )}
              </div>
              <div className="toast-content">
                <div className="toast-title">{toast.title}</div>
                {toast.description && (
                  <div className="toast-description">{toast.description}</div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default EnterName