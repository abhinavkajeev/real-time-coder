import React, { useEffect, useState } from 'react'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material-ocean.css'
import 'codemirror/mode/python/python'
import 'codemirror/keymap/sublime'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/matchbrackets'
import CodeMirror from 'codemirror'
import io from 'socket.io-client'
import { Users, LogOut, Copy, Code2, Wifi, Play, Square, Terminal } from 'lucide-react'
import { useStore } from './store'

const RealTimeEditor = () => {
  const [users, setUsers] = useState([])
  const [copied, setCopied] = useState(false)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [editor, setEditor] = useState(null)
  const { username, roomId, setUsername, setRoomId } = useStore(({ username, roomId, setUsername, setRoomId }) => ({
    username,
    roomId,
    setUsername,
    setRoomId,
  }))

  const handleLeaveRoom = () => {
    setUsername('')
    setRoomId('')
  }

  const runPythonCode = async () => {
    if (!editor || isRunning) return
    
    const code = editor.getValue()
    if (!code.trim()) {
      setOutput('No code to execute.')
      return
    }

    setIsRunning(true)
    setOutput('Running...')

    try {
      const response = await fetch('http://localhost:3002/run-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          code,
          roomId,
          username 
        }),
      })

      const result = await response.json()
      
      if (result.success) {
        setOutput(result.output || 'Code executed successfully (no output)')
      } else {
        setOutput(`Error: ${result.error}`)
      }
    } catch (error) {
      setOutput(`Connection Error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const clearOutput = () => {
    setOutput('')
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const editorInstance = CodeMirror.fromTextArea(document.getElementById('ds'), {
      lineNumbers: true,
      keyMap: 'sublime',
      theme: 'material-ocean',
      mode: 'python',
      lineWrapping: true,
      autoCloseBrackets: true,
      matchBrackets: true,
      indentWithTabs: false,
      indentUnit: 4,
      tabSize: 4,
    })

    setEditor(editorInstance)

    const widget = document.createElement('span')
    widget.textContent = 'hmmm?'
    widget.style.cssText =
      'background: #F37381; padding: 0px 3px; color: #F3F5F1; cursor: pointer;'

    const socket = io('http://localhost:3002/', {
      transports: ['websocket'],
    })

    socket.on('CODE_CHANGED', (code) => {
      console.log(code)
      editorInstance.setValue(code)
    })

    socket.on('PYTHON_OUTPUT', (data) => {
      if (data.roomId === roomId) {
        setOutput(data.output)
        setIsRunning(false)
      }
    })

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`)
    })

    socket.on('connect', () => {
      socket.emit('CONNECTED_TO_ROOM', { roomId, username })
    })

    socket.on('disconnect', () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username })
    })

    socket.on('ROOM:CONNECTION', (users) => {
      setUsers(users)
      console.log(users)
    })

    editorInstance.on('change', (instance, changes) => {
      const { origin } = changes
      if (origin !== 'setValue') {
        socket.emit('CODE_CHANGED', instance.getValue())
      }
    })

    editorInstance.on('cursorActivity', (instance) => {
      // console.log(instance.cursorCoords())
    })

    return () => {
      socket.emit('DISSCONNECT_FROM_ROOM', { roomId, username })
    }
  }, [])

  return (
    <div className="editor-container">
      <style jsx>{`
        .editor-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .header-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .logo-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .header-info h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          letter-spacing: -0.5px;
        }

        .header-meta {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #718096;
          font-size: 14px;
        }

        .username {
          font-weight: 600;
          color: #667eea;
        }

        .room-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .room-id {
          background: #f7fafc;
          padding: 6px 12px;
          border-radius: 8px;
          font-family: 'Monaco', 'Menlo', monospace;
          font-size: 13px;
          color: #2d3748;
          border: 1px solid #e2e8f0;
        }

        .copy-btn {
          background: #667eea;
          border: none;
          color: white;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .copy-btn:hover {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .copy-btn.copied {
          background: #48bb78;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          padding: 10px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
        }

        .leave-btn {
          background: #ffffff;
          border: 2px solid #e53e3e;
          color: #e53e3e;
          padding: 10px 20px;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .leave-btn:hover {
          background: #e53e3e;
          color: white;
          transform: translateY(-1px);
        }

        .editor-card {
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          margin-bottom: 24px;
        }

        .run-controls {
          background: linear-gradient(90deg, #2d3748, #4a5568);
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #37474f;
        }

        .run-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .run-btn {
          background: linear-gradient(135deg, #48bb78, #38a169);
          border: none;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .run-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #38a169, #2f855a);
          transform: translateY(-1px);
        }

        .run-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .clear-btn {
          background: #4a5568;
          border: none;
          color: #e2e8f0;
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: #2d3748;
        }

        .language-badge {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(102, 126, 234, 0.2);
        }

        .editor-dots {
          display: flex;
          gap: 8px;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot.red { background: #ef4444; }
        .dot.yellow { background: #f59e0b; }
        .editor-header {
          background: linear-gradient(90deg, #2d3748, #4a5568);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #37474f;
        }

        .output-panel {
          background: #1a202c;
          border-top: 1px solid #2d3748;
          min-height: 200px;
          max-height: 400px;
          overflow-y: auto;
        }

        .output-header {
          background: #2d3748;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #4a5568;
        }

        .output-title {
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .output-content {
          padding: 16px 24px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 13px;
          line-height: 1.5;
          color: #e2e8f0;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .output-empty {
          color: #718096;
          font-style: italic;
        }

        .output-error {
          color: #fc8181;
        }

        .output-running {
          color: #63b3ed;
        }

        .dot.green { background: #10b981; }

        .editor-title {
          color: #e2e8f0;
          font-size: 14px;
          font-weight: 500;
          margin-left: 12px;
        }

        .editor-wrapper {
          position: relative;
        }

        .users-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .users-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .users-icon {
          width: 24px;
          height: 24px;
          color: #667eea;
        }

        .users-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .users-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .user-badge {
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          color: #4a5568;
          padding: 8px 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .user-badge.current {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .user-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        /* CodeMirror Customizations */
        .editor-wrapper :global(.CodeMirror) {
          height: 500px !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
        }

        .editor-wrapper :global(.CodeMirror-scroll) {
          border-radius: 0 !important;
        }

        .editor-wrapper :global(.CodeMirror-gutters) {
          background: #263238 !important;
          border-right: 1px solid #37474f !important;
        }

        .editor-wrapper :global(.CodeMirror-linenumber) {
          color: #546e7a !important;
        }

        @media (max-width: 768px) {
          .editor-container {
            padding: 16px;
          }

          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 20px;
          }

          .header-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .header-right {
            justify-content: space-between;
          }

          .users-list {
            gap: 8px;
          }
        }
      `}</style>

      {/* Header */}
      <div className="header-card">
        <div className="header-content">
          <div className="header-left">
            <div className="logo-icon">
              <Code2 size={24} />
            </div>
            <div className="header-info">
              <h1>CodeSync Studio</h1>
              <div className="header-meta">
                <div className="user-info">
                  <Wifi size={16} />
                  Welcome, <span className="username">{username}</span>
                </div>
                <div className="room-info">
                  <span>Room:</span>
                  <code className="room-id">{roomId}</code>
                  <button 
                    className={`copy-btn ${copied ? 'copied' : ''}`}
                    onClick={copyRoomId}
                  >
                    <Copy size={14} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="header-right">
            <div className="status-badge">
              <Users size={16} />
              {users.length} {users.length === 1 ? 'user' : 'users'} online
            </div>
            <button className="leave-btn" onClick={handleLeaveRoom}>
              <LogOut size={16} />
              Leave Room
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="editor-card">
        <div className="editor-header">
          <div className="editor-dots">
            <div className="dot red"></div>
            <div className="dot yellow"></div>
            <div className="dot green"></div>
          </div>
          <div className="editor-title">
            main.py - Python Collaborative Environment
          </div>
          <div className="language-badge">Python 3.x</div>
        </div>
        <div className="run-controls">
          <div className="run-left">
            <button 
              className="run-btn" 
              onClick={runPythonCode}
              disabled={isRunning}
            >
              {isRunning ? <Square size={16} /> : <Play size={16} />}
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            <button className="clear-btn" onClick={clearOutput}>
              Clear Output
            </button>
          </div>
        </div>
        <div className="editor-wrapper">
          <textarea id="ds" style={{ display: 'none' }} />
        </div>
        <div className="output-panel">
          <div className="output-header">
            <div className="output-title">
              <Terminal size={16} />
              Output
            </div>
          </div>
          <div className="output-content">
            {!output ? (
              <div className="output-empty">No output yet. Run your Python code to see results here.</div>
            ) : (
              <div className={`${output.includes('Error:') ? 'output-error' : ''} ${output === 'Running...' ? 'output-running' : ''}`}>
                {output}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connected Users */}
      {users.length > 0 && (
        <div className="users-card">
          <div className="users-header">
            <Users className="users-icon" />
            <h3 className="users-title">Active Collaborators</h3>
          </div>
          <div className="users-list">
            {users.map((user, index) => (
              <div
                key={index}
                className={`user-badge ${user === username ? 'current' : ''}`}
              >
                {user} {user === username && "(You)"}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default RealTimeEditor