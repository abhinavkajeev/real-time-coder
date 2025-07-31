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
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body, html {
          overflow: hidden;
        }

        .editor-container {
          width: 100vw;
          height: 100vh;
          font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%);
          color: #e2e8f0;
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          overflow: hidden;
        }

        .header-bar {
          background: rgba(15, 15, 35, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(64, 224, 255, 0.2);
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #40e0ff 0%, #00c9ff 50%, #92fe9d 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f0f23;
          box-shadow: 0 4px 16px rgba(64, 224, 255, 0.4);
        }

        .app-title {
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #40e0ff, #92fe9d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #94a3b8;
          font-size: 14px;
        }

        .username {
          color: #40e0ff;
          font-weight: 600;
        }

        .room-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .room-id {
          background: rgba(64, 224, 255, 0.1);
          border: 1px solid rgba(64, 224, 255, 0.3);
          color: #40e0ff;
          padding: 6px 12px;
          border-radius: 6px;
          font-family: 'SF Mono', 'Monaco', monospace;
          font-size: 12px;
          letter-spacing: 0.5px;
        }

        .copy-btn {
          background: linear-gradient(135deg, #40e0ff, #00c9ff);
          border: none;
          color: #0f0f23;
          padding: 6px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(64, 224, 255, 0.3);
        }

        .copy-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(64, 224, 255, 0.4);
        }

        .copy-btn.copied {
          background: linear-gradient(135deg, #92fe9d, #00f5a0);
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
          background: rgba(146, 254, 157, 0.15);
          border: 1px solid rgba(146, 254, 157, 0.3);
          color: #92fe9d;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
        }

        .leave-btn {
          background: rgba(239, 68, 68, 0.15);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #ef4444;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .leave-btn:hover {
          background: rgba(239, 68, 68, 0.25);
          transform: translateY(-1px);
        }

        .main-workspace {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .editor-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(64, 224, 255, 0.1);
        }

        .editor-header {
          background: rgba(26, 26, 46, 0.9);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(64, 224, 255, 0.2);
        }

        .editor-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .file-tabs {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .file-tab {
          background: rgba(64, 224, 255, 0.1);
          border: 1px solid rgba(64, 224, 255, 0.2);
          color: #40e0ff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .language-badge {
          background: linear-gradient(135deg, #92fe9d, #00f5a0);
          color: #0f0f23;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .run-controls {
          background: rgba(26, 26, 46, 0.95);
          padding: 12px 20px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid rgba(64, 224, 255, 0.1);
        }

        .run-btn {
          background: linear-gradient(135deg, #92fe9d, #00f5a0);
          border: none;
          color: #0f0f23;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(146, 254, 157, 0.3);
        }

        .run-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(146, 254, 157, 0.4);
        }

        .run-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .clear-btn {
          background: rgba(100, 116, 139, 0.2);
          border: 1px solid rgba(100, 116, 139, 0.3);
          color: #94a3b8;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .clear-btn:hover {
          background: rgba(100, 116, 139, 0.3);
          color: #e2e8f0;
        }

        .editor-wrapper {
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .output-panel {
          height: 200px;
          background: rgba(15, 15, 35, 0.95);
          border-top: 1px solid rgba(64, 224, 255, 0.2);
          display: flex;
          flex-direction: column;
        }

        .output-header {
          background: rgba(26, 26, 46, 0.9);
          padding: 10px 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid rgba(64, 224, 255, 0.1);
        }

        .output-title {
          color: #40e0ff;
          font-size: 13px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .output-content {
          flex: 1;
          padding: 16px 20px;
          font-family: 'SF Mono', 'Monaco', monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #e2e8f0;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow-y: auto;
          background: rgba(0, 0, 0, 0.2);
        }

        .output-empty {
          color: #64748b;
          font-style: italic;
        }

        .output-error {
          color: #fca5a5;
        }

        .output-running {
          color: #40e0ff;
        }

        .sidebar {
          width: 280px;
          background: rgba(15, 15, 35, 0.9);
          backdrop-filter: blur(15px);
          display: flex;
          flex-direction: column;
          border-left: 1px solid rgba(64, 224, 255, 0.1);
        }

        .sidebar-header {
          padding: 16px 20px;
          background: rgba(26, 26, 46, 0.8);
          border-bottom: 1px solid rgba(64, 224, 255, 0.2);
        }

        .sidebar-title {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #40e0ff;
          font-size: 14px;
          font-weight: 600;
        }

        .users-list {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .user-badge {
          background: rgba(64, 224, 255, 0.1);
          border: 1px solid rgba(64, 224, 255, 0.2);
          color: #40e0ff;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .user-badge.current {
          background: linear-gradient(135deg, rgba(146, 254, 157, 0.2), rgba(0, 245, 160, 0.1));
          border-color: rgba(146, 254, 157, 0.4);
          color: #92fe9d;
          box-shadow: 0 2px 8px rgba(146, 254, 157, 0.2);
        }

        .user-badge:hover {
          transform: translateY(-1px);
          background: rgba(64, 224, 255, 0.15);
        }

        /* CodeMirror Customizations */
        .editor-wrapper :global(.CodeMirror) {
          height: 100% !important;
          font-family: 'SF Mono', 'Monaco', 'Cascadia Code', monospace !important;
          font-size: 14px !important;
          line-height: 1.6 !important;
          background: rgba(15, 15, 35, 0.4) !important;
        }

        .editor-wrapper :global(.CodeMirror-scroll) {
          background: transparent !important;
        }

        .editor-wrapper :global(.CodeMirror-gutters) {
          background: rgba(26, 26, 46, 0.6) !important;
          border-right: 1px solid rgba(64, 224, 255, 0.2) !important;
        }

        .editor-wrapper :global(.CodeMirror-linenumber) {
          color: #64748b !important;
        }

        .editor-wrapper :global(.CodeMirror-cursor) {
          border-left: 2px solid #40e0ff !important;
        }

        .editor-wrapper :global(.CodeMirror-selected) {
          background: rgba(64, 224, 255, 0.2) !important;
        }

        @media (max-width: 768px) {
          .header-bar {
            padding: 8px 16px;
          }

          .header-info {
            gap: 16px;
          }

          .room-section {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .sidebar {
            display: none;
          }

          .output-panel {
            height: 150px;
          }
        }
      `}</style>

      {/* Header Bar */}
      <div className="header-bar">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-icon">
              <Code2 size={20} />
            </div>
            <div className="app-title">CodeSync Pro</div>
          </div>
          <div className="header-info">
            <div className="user-info">
              <Wifi size={14} />
              <span className="username">{username}</span>
            </div>
            <div className="room-section">
              <code className="room-id">{roomId}</code>
              <button 
                className={`copy-btn ${copied ? 'copied' : ''}`}
                onClick={copyRoomId}
              >
                <Copy size={12} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="status-badge">
            <Users size={14} />
            {users.length} {users.length === 1 ? 'user' : 'users'} online
          </div>
          <button className="leave-btn" onClick={handleLeaveRoom}>
            <LogOut size={14} />
            Leave Room
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="main-workspace">
        {/* Editor Section */}
        <div className="editor-section">
          <div className="editor-header">
            <div className="editor-info">
              <div className="file-tabs">
                <div className="file-tab">
                  <Terminal size={12} />
                  main.py
                </div>
              </div>
              <div className="language-badge">Python 3.x</div>
            </div>
          </div>

          <div className="run-controls">
            <button 
              className="run-btn" 
              onClick={runPythonCode}
              disabled={isRunning}
            >
              {isRunning ? <Square size={14} /> : <Play size={14} />}
              {isRunning ? 'Running...' : 'Execute'}
            </button>
            <button className="clear-btn" onClick={clearOutput}>
              Clear Output
            </button>
          </div>

          <div className="editor-wrapper">
            <textarea id="ds" style={{ display: 'none' }} />
          </div>

          <div className="output-panel">
            <div className="output-header">
              <div className="output-title">
                <Terminal size={14} />
                Console Output
              </div>
            </div>
            <div className="output-content">
              {!output ? (
                <div className="output-empty">Ready to execute Python code...</div>
              ) : (
                <div className={`${output.includes('Error:') ? 'output-error' : ''} ${output === 'Running...' ? 'output-running' : ''}`}>
                  {output}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {users.length > 0 && (
          <div className="sidebar">
            <div className="sidebar-header">
              <div className="sidebar-title">
                <Users size={16} />
                Active Collaborators
              </div>
            </div>
            <div className="users-list">
              {users.map((user, index) => (
                <div
                  key={index}
                  className={`user-badge ${user === username ? 'current' : ''}`}
                >
                  <span>{user}</span>
                  {user === username && <span>(You)</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RealTimeEditor