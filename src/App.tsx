import { useState, useEffect, useRef, useCallback } from 'react'
import './App.css'

const VALENTINE_NAME = import.meta.env.VITE_VALENTINE_NAME || ' Yashmi '
const LANGUAGE = import.meta.env.VITE_LANGUAGE || 'EN'

const translations = {
  EN: {
    willYouBeMyValentine: () => `Will you be my Valentine?`,
    areYouSure: "You sure about that? 🙂",
    prettyPlease: "Okay… just checking once more 💖",
    wontGiveUp: "Still standing by my question 💖",
    tooShy: "That NO button seems a little shy 😜",
    justSayYes: "Just say YES already na 💘",
    yes: "YES 💕",
    no: "No",
    yay: "YAY!",
    knewYoudSayYes: (name: string) => `Shukriya for the YES ❤️ ${name}!`,
    happiestPerson: "Next time say 'Qubool hai' <3 Anyways Thank you for making my day... Gonna be spending all my life making it up to you  🎀",
  },
}

const t = translations[LANGUAGE as keyof typeof translations] || translations.EN

interface Heart {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
}

function App() {
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 })
  const [initialized, setInitialized] = useState(false)
  const [hearts, setHearts] = useState<Heart[]>([])
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [yesClicked, setYesClicked] = useState(false)
  const [noAttempts, setNoAttempts] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)

  const yesButtonRef = useRef<HTMLButtonElement>(null)
  const noButtonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null) // White card (envelope) container
  const sparkleId = useRef(0)

  const CARD_PADDING = 16 // Padding from white card edges so button stays inside

  // Generate floating hearts
  useEffect(() => {
    const newHearts: Heart[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 15 + Math.random() * 35,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 5,
      opacity: 0.3 + Math.random() * 0.4,
    }))
    setHearts(newHearts)
  }, [])

  // Sparkle trail effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.7) {
        const newSparkle: Sparkle = {
          id: sparkleId.current++,
          x: e.clientX,
          y: e.clientY,
          size: 5 + Math.random() * 15,
        }
        setSparkles(prev => [...prev.slice(-20), newSparkle])
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Remove old sparkles
  useEffect(() => {
    const interval = setInterval(() => {
      setSparkles(prev => prev.slice(1))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Initialize No button position inside white card, next to Yes button
  useEffect(() => {
    if (!initialized) {
      const timer = setTimeout(() => {
        if (yesButtonRef.current && contentRef.current && noButtonRef.current) {
          const contentRect = contentRef.current.getBoundingClientRect()
          const yesRect = yesButtonRef.current.getBoundingClientRect()
          const noRect = noButtonRef.current.getBoundingClientRect()
          const noWidth = noRect.width || 80
          const noHeight = noRect.height || 44
          const padding = CARD_PADDING
          const maxX = contentRect.width - noWidth - padding
          const maxY = contentRect.height - noHeight - padding

          // Start just to the right of Yes button, clamped to card bounds
          let x = yesRect.right - contentRect.left + 20
          let y = yesRect.top - contentRect.top
          x = Math.max(padding, Math.min(maxX, x))
          y = Math.max(padding, Math.min(maxY, y))
          setNoButtonPos({ x, y })
          setInitialized(true)
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [initialized])

  // Random position strictly inside the white card (content), avoiding the Yes button
  const getRandomPosition = useCallback((currentMouseX?: number, currentMouseY?: number) => {
    if (!contentRef.current || !yesButtonRef.current || !noButtonRef.current) {
      return noButtonPos
    }

    const contentRect = contentRef.current.getBoundingClientRect()
    const yesRect = yesButtonRef.current.getBoundingClientRect()
    const noRect = noButtonRef.current.getBoundingClientRect()

    const padding = CARD_PADDING
    const noWidth = noRect.width || 80
    const noHeight = noRect.height || 44

    // Bounds: white card only (content = envelope), button fully inside
    const minX = padding
    const minY = padding
    const maxX = contentRect.width - noWidth - padding
    const maxY = contentRect.height - noHeight - padding

    if (maxX <= minX || maxY <= minY) return noButtonPos

    // Yes button in content-relative coordinates
    const yesLeft = yesRect.left - contentRect.left - 20
    const yesRight = yesRect.right - contentRect.left + 20
    const yesTop = yesRect.top - contentRect.top - 20
    const yesBottom = yesRect.bottom - contentRect.top + 20

    let attempts = 0
    let newX: number, newY: number

    do {
      newX = minX + Math.random() * (maxX - minX)
      newY = minY + Math.random() * (maxY - minY)
      attempts++

      const noLeft = newX
      const noRight = newX + noWidth
      const noTop = newY
      const noBottom = newY + noHeight
      const overlapsYes = !(noRight < yesLeft || noLeft > yesRight || noBottom < yesTop || noTop > yesBottom)

      let tooCloseToMouse = false
      if (currentMouseX !== undefined && currentMouseY !== undefined) {
        const newCenterX = newX + noWidth / 2
        const newCenterY = newY + noHeight / 2
        const mouseRelX = currentMouseX - contentRect.left
        const mouseRelY = currentMouseY - contentRect.top
        const dist = Math.sqrt(
          Math.pow(newCenterX - mouseRelX, 2) + Math.pow(newCenterY - mouseRelY, 2)
        )
        tooCloseToMouse = dist < 100
      }

      if (!overlapsYes && !tooCloseToMouse) break
    } while (attempts < 100)

    newX = Math.max(minX, Math.min(maxX, newX))
    newY = Math.max(minY, Math.min(maxY, newY))
    return { x: newX, y: newY }
  }, [noButtonPos])

  const handleNoHover = useCallback(
    (e: React.MouseEvent) => {
      if (yesClicked) return
      setNoAttempts(prev => prev + 1)
      setNoButtonPos(getRandomPosition(e.clientX, e.clientY))
    },
    [yesClicked, getRandomPosition]
  )

  const handleYesClick = () => {
    setYesClicked(true)
    setShowConfetti(true)
  }

  const getMessage = () => {
    if (noAttempts === 0) return t.willYouBeMyValentine(VALENTINE_NAME)
    if (noAttempts < 3) return t.areYouSure
    if (noAttempts < 6) return t.prettyPlease
    if (noAttempts < 10) return t.wontGiveUp
    if (noAttempts < 15) return t.tooShy
    return t.justSayYes
  }

  if (yesClicked) {
    return (
      <div className="celebration-container" ref={containerRef}>
        {showConfetti && (
          <div className="confetti-container">
            {Array.from({ length: 100 }).map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#ff4d6d', '#ff8fa3', '#ffb3c1', '#ffd700', '#ff69b4', '#ff1493'][Math.floor(Math.random() * 6)],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        )}

        <div className="celebration-content">
          <div className="big-heart">💖</div>
          <h1 className="celebration-title">{t.yay}</h1>
          <p className="celebration-text">
            {t.knewYoudSayYes(VALENTINE_NAME)}
          </p>
          <p className="celebration-subtext">
            {t.happiestPerson}
          </p>
          <div className="heart-burst">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="burst-heart"
                style={{
                  '--angle': `${i * 30}deg`,
                  '--delay': `${i * 0.1}s`,
                } as React.CSSProperties}
              >
                💗
              </span>
            ))}
          </div>
        </div>

        {hearts.map(heart => (
          <div
            key={heart.id}
            className="floating-heart celebration-heart"
            style={{
              left: `${heart.x}%`,
              top: `${heart.y}%`,
              fontSize: `${heart.size}px`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
              opacity: heart.opacity,
            }}
          >
            💖
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="container" ref={containerRef}>
      {/* Floating hearts background */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            opacity: heart.opacity,
          }}
        >
          {['💕', '💗', '💖', '💘', '❤️'][heart.id % 5]}
        </div>
      ))}

      {/* Sparkle trail */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
          }}
        />
      ))}

      {/* Main content (white card container) */}
      <div className="content" ref={contentRef}>
        <div className="envelope">
          <div className="envelope-flap"></div>
          <div className="letter">
            <div className="letter-decoration">✨ 💌 ✨</div>
            <h1 className="title">
              <span className="name">{VALENTINE_NAME}</span>
              <br />
              <span className="question">{getMessage()}</span>
            </h1>

            <div className="buttons-container">
              <button
                ref={yesButtonRef}
                className="btn btn-yes"
                onClick={handleYesClick}
              >
                {t.yes}
              </button>
            </div>
          </div>
        </div>

        {/* Runaway No button - moves only within white card, on hover */}
        <button
          ref={noButtonRef}
          className="btn btn-no"
          style={{
            position: 'absolute',
            left: noButtonPos.x,
            top: noButtonPos.y,
            transition: 'all 0.25s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            opacity: initialized ? 1 : 0,
          }}
          onMouseEnter={handleNoHover}
          onTouchStart={() => {
            setNoAttempts(prev => prev + 1)
            setNoButtonPos(getRandomPosition())
          }}
        >
          {t.no} {noAttempts > 5 ? '😈' : '😢'}
        </button>
      </div>

      {/* Decorative corner hearts */}
      <div className="corner-decoration top-left">💕</div>
      <div className="corner-decoration top-right">💕</div>
      <div className="corner-decoration bottom-left">💕</div>
      <div className="corner-decoration bottom-right">💕</div>
    </div>
  )
}

export default App
