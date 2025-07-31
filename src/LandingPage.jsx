import React from 'react'
import { motion } from 'framer-motion'
import { Code2, Users, Zap, Globe, ArrowRight, Cpu, Terminal, Play } from 'lucide-react'

const LandingPage = ({ onGetStarted }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="landing-container">
      <style jsx>{`
        .landing-container {
          width: 100vw;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%);
          color: #e2e8f0;
          overflow-x: hidden;
          position: relative;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        .background-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.08;
          background-image: 
            radial-gradient(circle at 20% 20%, #40e0ff 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, #92fe9d 0%, transparent 50%);
          animation: drift 25s ease-in-out infinite;
        }

        @keyframes drift {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(-30px, -30px) rotate(1deg); }
          66% { transform: translate(30px, -20px) rotate(-1deg); }
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: center;
          padding: 60px 20px 40px 20px;
        }

        .hero-section {
          max-width: 800px;
          margin-bottom: 60px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
        }

        .logo-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #40e0ff 0%, #00c9ff 50%, #92fe9d 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f0f23;
          box-shadow: 0 10px 40px rgba(64, 224, 255, 0.4);
          position: relative;
          overflow: hidden;
        }

        .logo-icon::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
          100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
        }

        .app-title {
          font-size: 64px;
          font-weight: 900;
          background: linear-gradient(135deg, #40e0ff, #92fe9d);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -3px;
          margin: 0;
          animation: gradientShift 4s ease-in-out infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .tagline {
          font-size: 20px;
          color: #94a3b8;
          margin: 24px 0 40px 0;
          line-height: 1.6;
          font-weight: 400;
        }

        .highlight {
          background: linear-gradient(135deg, #40e0ff, #92fe9d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
        }

        .cta-button {
          background: linear-gradient(135deg, #40e0ff, #00c9ff);
          border: none;
          color: #0f0f23;
          padding: 20px 40px;
          border-radius: 50px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 800;
          transition: all 0.4s ease;
          box-shadow: 0 10px 40px rgba(64, 224, 255, 0.4);
          text-decoration: none;
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.6s;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 50px rgba(64, 224, 255, 0.5);
          background: linear-gradient(135deg, #00c9ff, #40e0ff);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 32px;
          max-width: 1000px;
          margin-top: 80px;
        }

        .feature-card {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(64, 224, 255, 0.2);
          border-radius: 20px;
          padding: 40px;
          text-align: center;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(64, 224, 255, 0.4);
          box-shadow: 0 20px 60px rgba(64, 224, 255, 0.15);
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #40e0ff, #92fe9d);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0f0f23;
          margin: 0 auto 20px auto;
          box-shadow: 0 4px 16px rgba(64, 224, 255, 0.3);
        }

        .feature-title {
          font-size: 20px;
          font-weight: 600;
          color: #40e0ff;
          margin-bottom: 12px;
        }

        .feature-description {
          color: #94a3b8;
          line-height: 1.6;
          font-size: 14px;
        }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-code {
          position: absolute;
          background: rgba(64, 224, 255, 0.1);
          border: 1px solid rgba(64, 224, 255, 0.2);
          border-radius: 8px;
          padding: 8px 12px;
          font-family: 'Monaco', monospace;
          font-size: 12px;
          color: #40e0ff;
          backdrop-filter: blur(10px);
        }

        .floating-code:nth-child(1) {
          top: 10%;
          left: 10%;
          animation: float1 15s infinite;
        }

        .floating-code:nth-child(2) {
          top: 20%;
          right: 15%;
          animation: float2 18s infinite;
        }

        .floating-code:nth-child(3) {
          bottom: 20%;
          left: 20%;
          animation: float3 20s infinite;
        }

        .floating-code:nth-child(4) {
          bottom: 15%;
          right: 10%;
          animation: float4 16s infinite;
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(20px, -30px) rotate(2deg); }
          50% { transform: translate(-10px, -20px) rotate(-1deg); }
          75% { transform: translate(30px, 10px) rotate(1deg); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-25px, 20px) rotate(-2deg); }
          50% { transform: translate(15px, -15px) rotate(1deg); }
          75% { transform: translate(-20px, -10px) rotate(-1deg); }
        }

        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(15px, -25px) rotate(1deg); }
          50% { transform: translate(-20px, -5px) rotate(-2deg); }
          75% { transform: translate(25px, 15px) rotate(1deg); }
        }

        @keyframes float4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-15px, -20px) rotate(-1deg); }
          50% { transform: translate(20px, 10px) rotate(2deg); }
          75% { transform: translate(-10px, 25px) rotate(-1deg); }
        }

        .stats-section {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin-top: 60px;
          flex-wrap: wrap;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 700;
          background: linear-gradient(135deg, #40e0ff, #92fe9d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 8px;
          display: block;
        }

        .stat-label {
          color: #94a3b8;
          font-size: 14px;
          font-weight: 500;
        }

        /* How It Works Section */
        .how-it-works-section {
          margin-top: 100px;
          max-width: 1000px;
        }

        .section-title {
          font-size: 42px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 60px;
          color: #e2e8f0;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 40px;
          margin-top: 60px;
        }

        .step-card {
          text-align: center;
          padding: 40px 20px;
        }

        .step-number {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #40e0ff, #92fe9d);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          color: #0f0f23;
          margin: 0 auto 24px auto;
          box-shadow: 0 8px 32px rgba(64, 224, 255, 0.3);
        }

        .step-title {
          font-size: 24px;
          font-weight: 600;
          color: #40e0ff;
          margin-bottom: 16px;
        }

        .step-description {
          color: #94a3b8;
          line-height: 1.6;
          font-size: 16px;
        }

        /* Demo Section */
        .demo-section {
          margin-top: 100px;
          max-width: 1000px;
        }

        .demo-container {
          margin-top: 60px;
        }

        .demo-editor {
          background: rgba(15, 15, 35, 0.8);
          border: 1px solid rgba(64, 224, 255, 0.2);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 64px rgba(0, 0, 0, 0.3);
        }

        .demo-header {
          background: rgba(26, 26, 46, 0.9);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(64, 224, 255, 0.2);
        }

        .demo-dots {
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
        .dot.green { background: #10b981; }

        .demo-title {
          color: #e2e8f0;
          font-family: 'Monaco', monospace;
          font-size: 14px;
        }

        .demo-users {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .user-dot.alice { background: #40e0ff; }
        .user-dot.bob { background: #92fe9d; }

        .user-text {
          color: #94a3b8;
          font-size: 12px;
        }

        .demo-code {
          padding: 24px;
          font-family: 'Monaco', monospace;
          font-size: 14px;
          line-height: 1.6;
        }

        .code-line {
          margin-bottom: 4px;
          position: relative;
        }

        .code-line.cursor-bob::after {
          content: '';
          position: absolute;
          right: -2px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #92fe9d;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .comment { color: #64748b; }
        .keyword { color: #40e0ff; }
        .function { color: #92fe9d; }
        .param { color: #fbbf24; }
        .number { color: #f87171; }
        .string { color: #34d399; }

        /* Testimonials Section */
        .testimonials-section {
          margin-top: 100px;
          max-width: 1000px;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 32px;
          margin-top: 60px;
        }

        .testimonial-card {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(64, 224, 255, 0.2);
          border-radius: 16px;
          padding: 32px;
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-8px);
          border-color: rgba(64, 224, 255, 0.4);
          box-shadow: 0 16px 64px rgba(64, 224, 255, 0.1);
        }

        .testimonial-content {
          color: #e2e8f0;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 24px;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #40e0ff, #92fe9d);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #0f0f23;
          font-size: 16px;
        }

        .author-name {
          color: #40e0ff;
          font-weight: 600;
          font-size: 16px;
        }

        .author-title {
          color: #94a3b8;
          font-size: 14px;
        }

        /* Final CTA Section */
        .final-cta-section {
          margin-top: 100px;
          text-align: center;
          padding: 60px 0;
          background: rgba(15, 15, 35, 0.8);
          border-radius: 24px;
          border: 1px solid rgba(64, 224, 255, 0.2);
        }

        .cta-title {
          font-size: 42px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #e2e8f0;
        }

        .cta-subtitle {
          font-size: 18px;
          color: #94a3b8;
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .cta-button.primary {
          background: linear-gradient(135deg, #40e0ff, #00c9ff);
          color: #0f0f23;
        }

        .cta-button.secondary {
          background: transparent;
          border: 2px solid rgba(64, 224, 255, 0.5);
          color: #40e0ff;
        }

        .cta-button.secondary:hover {
          background: rgba(64, 224, 255, 0.1);
          border-color: #40e0ff;
        }

        @media (max-width: 768px) {
          .app-title {
            font-size: 36px;
          }

          .tagline {
            font-size: 18px;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 24px;
            margin-top: 60px;
          }

          .stats-section {
            gap: 32px;
          }

          .floating-code {
            display: none;
          }

          .section-title {
            font-size: 32px;
          }

          .cta-title {
            font-size: 32px;
          }

          .steps-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }

          .testimonials-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
          }

          .demo-header {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          .demo-code {
            font-size: 12px;
            padding: 16px;
          }
        }
      `}</style>

      <div className="background-pattern"></div>
      
      <div className="floating-elements">
        <div className="floating-code">print("Hello World")</div>
        <div className="floating-code">def collaborate():</div>
        <div className="floating-code">import asyncio</div>
        <div className="floating-code">users.append(new_user)</div>
      </div>

      <motion.div 
        className="content-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-section" variants={itemVariants}>
          <motion.div className="logo-section" variants={itemVariants}>
            <motion.div 
              className="logo-icon"
              variants={floatingVariants}
              animate="animate"
            >
              <Code2 size={32} />
            </motion.div>
            <h1 className="app-title">CodeSync Pro</h1>
          </motion.div>

          <motion.p className="tagline" variants={itemVariants}>
            The future of <span className="highlight">collaborative coding</span> is here.
            <br />
            Write, execute, and share Python code in real-time with your team.
          </motion.p>

          <motion.button 
            className="cta-button"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
          >
            Start Coding Together
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>

        <motion.div className="features-grid" variants={itemVariants}>
          <motion.div className="feature-card" variants={itemVariants}>
            <div className="feature-icon">
              <Users size={24} />
            </div>
            <h3 className="feature-title">Real-time Collaboration</h3>
            <p className="feature-description">
              Code together with your team in real-time. See changes instantly as others type, with seamless synchronization across all devices.
            </p>
          </motion.div>

          <motion.div className="feature-card" variants={itemVariants}>
            <div className="feature-icon">
              <Play size={24} />
            </div>
            <h3 className="feature-title">Instant Python Execution</h3>
            <p className="feature-description">
              Execute Python code directly in the browser. No setup required - just write your code and run it with a single click.
            </p>
          </motion.div>

          <motion.div className="feature-card" variants={itemVariants}>
            <div className="feature-icon">
              <Terminal size={24} />
            </div>
            <h3 className="feature-title">Professional IDE Experience</h3>
            <p className="feature-description">
              Full-featured code editor with syntax highlighting, auto-completion, and a professional dark theme optimized for productivity.
            </p>
          </motion.div>
        </motion.div>

        <motion.div className="stats-section" variants={itemVariants}>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Real-time Sync</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0ms</span>
            <span className="stat-label">Setup Time</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">∞</span>
            <span className="stat-label">Possibilities</span>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div className="how-it-works-section" variants={itemVariants}>
          <motion.h2 className="section-title" variants={itemVariants}>
            How It <span className="highlight">Works</span>
          </motion.h2>
          <motion.div className="steps-grid" variants={itemVariants}>
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Create Room</h3>
              <p className="step-description">Start a new coding session or join an existing room with a simple room ID.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Invite Team</h3>
              <p className="step-description">Share the room ID with your teammates and start collaborating instantly.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Code Together</h3>
              <p className="step-description">Write, edit, and execute Python code in real-time with live cursors and updates.</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Code Demo Section */}
        <motion.div className="demo-section" variants={itemVariants}>
          <motion.h2 className="section-title" variants={itemVariants}>
            See It In <span className="highlight">Action</span>
          </motion.h2>
          <motion.div className="demo-container" variants={itemVariants}>
            <div className="demo-editor">
              <div className="demo-header">
                <div className="demo-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="demo-title">collaborative_session.py</div>
                <div className="demo-users">
                  <span className="user-dot alice"></span>
                  <span className="user-dot bob"></span>
                  <span className="user-text">2 users online</span>
                </div>
              </div>
              <div className="demo-code">
                <div className="code-line"><span className="comment"># Alice is typing...</span></div>
                <div className="code-line"><span className="keyword">def</span> <span className="function">fibonacci</span>(<span className="param">n</span>):</div>
                <div className="code-line">    <span className="keyword">if</span> n &lt;= <span className="number">1</span>:</div>
                <div className="code-line">        <span className="keyword">return</span> n</div>
                <div className="code-line">    <span className="keyword">return</span> <span className="function">fibonacci</span>(n-<span className="number">1</span>) + <span className="function">fibonacci</span>(n-<span className="number">2</span>)</div>
                <div className="code-line"></div>
                <div className="code-line cursor-bob"><span className="comment"># Bob added this</span></div>
                <div className="code-line"><span className="keyword">print</span>(<span className="string">"Result:"</span>, <span className="function">fibonacci</span>(<span className="number">10</span>))</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div className="testimonials-section" variants={itemVariants}>
          <motion.h2 className="section-title" variants={itemVariants}>
            What Developers <span className="highlight">Say</span>
          </motion.h2>
          <motion.div className="testimonials-grid" variants={itemVariants}>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "CodeSync Pro has revolutionized our pair programming sessions. The real-time collaboration is seamless!"
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SF</div>
                <div className="author-info">
                  <div className="author-name">Sarah Foster</div>
                  <div className="author-title">Senior Developer</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "Finally, a collaborative coding tool that actually works. No lag, no conflicts, just pure productivity."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">MJ</div>
                <div className="author-info">
                  <div className="author-name">Mike Johnson</div>
                  <div className="author-title">Tech Lead</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                "The instant Python execution feature is a game-changer for our remote team's coding interviews."
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">AL</div>
                <div className="author-info">
                  <div className="author-name">Alex Liu</div>
                  <div className="author-title">Engineering Manager</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div className="final-cta-section" variants={itemVariants}>
          <motion.h2 className="cta-title" variants={itemVariants}>
            Ready to Transform Your <span className="highlight">Coding Workflow</span>?
          </motion.h2>
          <motion.p className="cta-subtitle" variants={itemVariants}>
            Join thousands of developers who are already building better software together.
          </motion.p>
          <motion.div className="cta-buttons" variants={itemVariants}>
            <button 
              className="cta-button primary"
              onClick={onGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Coding Now
              <ArrowRight size={20} />
            </button>
            <button className="cta-button secondary">
              <Play size={20} />
              Watch Demo
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default LandingPage
