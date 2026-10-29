import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Reactive particle wave behind the hero text.
export default function HeroCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const cv = ref.current
    const hero = cv.parentElement
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true })
    } catch {
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(55, 1, 0.1, 100)
    cam.position.set(0, 3.2, 9)
    cam.lookAt(0, 0, 0)

    const X = 90, Z = 50, N = X * Z
    const pos = new Float32Array(N * 3)
    const col = new Float32Array(N * 3)
    const a = new THREE.Color('#5b3fa0'), b = new THREE.Color('#70AA26'), c = new THREE.Color('#B4F03C')
    for (let i = 0, k = 0; i < X; i++)
      for (let j = 0; j < Z; j++, k++) {
        pos[k * 3] = (i / X - 0.5) * 24
        pos[k * 3 + 2] = (j / Z - 0.5) * 14
        const t = i / X
        const m = a.clone().lerp(t > 0.55 ? b : a, Math.min(1, Math.abs(t - 0.35) * 2)).lerp(c, Math.max(0, t - 0.85) * 4)
        col[k * 3] = m.r; col[k * 3 + 1] = m.g; col[k * 3 + 2] = m.b
      }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('color', new THREE.BufferAttribute(col, 3))
    const mat = new THREE.PointsMaterial({ size: 0.07, vertexColors: true, transparent: true, opacity: 0.85 })
    const pts = new THREE.Points(g, mat)
    pts.position.set(3, 0.5, 0)
    scene.add(pts)

    const mouse = { x: 0, y: 0 }
    const onMove = (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5 }
    window.addEventListener('mousemove', onMove)

    const resize = () => {
      const w = hero.clientWidth, h = hero.clientHeight
      renderer.setSize(w, h, false)
      cam.aspect = w / h
      cam.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    let visible = true
    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting))
    io.observe(hero)

    const still = matchMedia('(prefers-reduced-motion:reduce)').matches
    let raf
    const frame = (t) => {
      raf = requestAnimationFrame(frame)
      if (!visible) return
      t *= 0.0006
      const p = g.attributes.position
      for (let k = 0; k < N; k++) {
        const x = pos[k * 3], z = pos[k * 3 + 2]
        pos[k * 3 + 1] = Math.sin(x * 0.5 + t) * 0.6 + Math.cos(z * 0.6 + t * 1.2) * 0.5
      }
      p.needsUpdate = true
      cam.position.x += (mouse.x * 3 - cam.position.x) * 0.04
      cam.position.y += (3.2 - mouse.y * 2 - cam.position.y) * 0.04
      cam.lookAt(0, 0, 0)
      renderer.render(scene, cam)
    }
    if (still) frame(0)
    else raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      io.disconnect()
      g.dispose(); mat.dispose(); renderer.dispose()
    }
  }, [])

  return <canvas id="gl" ref={ref} aria-hidden="true" />
}
