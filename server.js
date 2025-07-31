import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3003", // Updated to match your frontend port
    methods: ["GET", "POST"]
  }
})

app.use(cors())
app.use(express.json())

// Store room data
const rooms = new Map()

// Clean up temporary files older than 1 hour
const cleanupTempFiles = () => {
  const tempDir = path.join(__dirname, 'temp')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir)
    return
  }

  fs.readdir(tempDir, (err, files) => {
    if (err) return
    
    files.forEach(file => {
      const filePath = path.join(tempDir, file)
      fs.stat(filePath, (err, stats) => {
        if (err) return
        
        const now = new Date().getTime()
        const fileTime = new Date(stats.mtime).getTime()
        
        // Delete files older than 1 hour
        if (now - fileTime > 3600000) {
          fs.unlink(filePath, () => {})
        }
      })
    })
  })
}

// Run cleanup every 30 minutes
setInterval(cleanupTempFiles, 1800000)

// Basic route for creating room
app.get('/', (req, res) => {
  res.send({ msg: 'Python-enabled collaborative code editor server' })
})

app.post('/create-room-with-user', async (req, res) => {
  const { username } = req.body
  const roomId = uuidv4()

  console.log(`Creating room ${roomId} for user ${username}`)
  
  res.status(201).send({ roomId })
})

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('CONNECTED_TO_ROOM', ({ roomId, username }) => {
    socket.join(roomId)
    
    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set())
    }
    
    rooms.get(roomId).add(username)
    
    // Emit updated user list to all users in the room
    const userList = Array.from(rooms.get(roomId))
    io.to(roomId).emit('ROOM:CONNECTION', userList)
    
    console.log(`${username} joined room ${roomId}`)
  })

  socket.on('DISSCONNECT_FROM_ROOM', ({ roomId, username }) => {
    socket.leave(roomId)
    
    if (rooms.has(roomId)) {
      rooms.get(roomId).delete(username)
      
      if (rooms.get(roomId).size === 0) {
        rooms.delete(roomId)
      } else {
        const userList = Array.from(rooms.get(roomId))
        io.to(roomId).emit('ROOM:CONNECTION', userList)
      }
    }
    
    console.log(`${username} left room ${roomId}`)
  })

  socket.on('CODE_CHANGED', (code) => {
    // Get room ID from socket data if available
    const rooms = Array.from(socket.rooms)
    const roomId = rooms.find(room => room !== socket.id)
    
    if (roomId) {
      socket.to(roomId).emit('CODE_CHANGED', code)
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
    
    // Clean up user from rooms
    rooms.forEach((users, roomId) => {
      // This is a simplified cleanup - in production you'd want to track socket to user mapping
      const userList = Array.from(users)
      io.to(roomId).emit('ROOM:CONNECTION', userList)
    })
  })
})

// Python code execution endpoint
app.post('/run-python', async (req, res) => {
  const { code, roomId, username } = req.body

  if (!code || !code.trim()) {
    return res.json({ success: false, error: 'No code provided' })
  }

  try {
    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, 'temp')
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir)
    }

    // Create a unique filename for this execution
    const filename = `${uuidv4()}.py`
    const filepath = path.join(tempDir, filename)

    // Write code to temporary file
    fs.writeFileSync(filepath, code)

    // Execute Python code with security restrictions
    const pythonProcess = spawn('python3', [filepath], {
      cwd: tempDir,
      timeout: 10000, // 10 second timeout
      env: {
        ...process.env,
        PYTHONPATH: tempDir, // Restrict Python path
      }
    })

    let output = ''
    let errorOutput = ''

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString()
    })

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString()
    })

    pythonProcess.on('close', (code) => {
      // Clean up the temporary file
      fs.unlink(filepath, () => {})

      const result = {
        success: code === 0,
        output: code === 0 ? output : errorOutput,
        error: code !== 0 ? errorOutput : null
      }

      // Send result back to client
      res.json(result)

      // Also broadcast to all users in the room via socket
      if (roomId) {
        io.to(roomId).emit('PYTHON_OUTPUT', {
          roomId,
          username,
          output: result.success ? result.output : `Error: ${result.error}`,
          success: result.success
        })
      }
    })

    pythonProcess.on('error', (error) => {
      // Clean up the temporary file
      fs.unlink(filepath, () => {})
      
      res.json({ 
        success: false, 
        error: `Failed to execute Python: ${error.message}` 
      })
    })

  } catch (error) {
    console.error('Python execution error:', error)
    res.json({ 
      success: false, 
      error: `Server error: ${error.message}` 
    })
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', rooms: rooms.size })
})

server.listen(3002, () => {
  console.log('Server running on port 3002')
  console.log('Python execution endpoint: POST /run-python')
  cleanupTempFiles() // Initial cleanup
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Server closed')
    process.exit(0)
  })
})
