import { useEffect, useRef } from 'react'
import * as THREE from 'three'

type ThreeSceneProps = {
  background?: number
  pixelRatio?: number
}

function ThreeScene({ background = 0x111111, pixelRatio }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const cubeRef = useRef<THREE.Mesh | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth || container.offsetWidth || 800
    const height = container.clientHeight || container.offsetHeight || 450

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(background)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000)
    camera.position.set(2, 2, 3)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(pixelRatio ?? Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: 0x61dafb })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    cubeRef.current = cube

    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(3, 3, 5)
    scene.add(light)

    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate)
      if (cubeRef.current) {
        cubeRef.current.rotation.x += 0.01
        cubeRef.current.rotation.y += 0.012
      }
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = container.clientWidth || container.offsetWidth || width
      const h = container.clientHeight || container.offsetHeight || height
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', onResize)
      if (rendererRef.current) {
        rendererRef.current.dispose()
        const canvas = rendererRef.current.domElement
        if (canvas && canvas.parentElement === container) {
          container.removeChild(canvas)
        }
      }
      if (sceneRef.current) {
        sceneRef.current.traverse(obj => {
          if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh
            mesh.geometry.dispose()
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach(m => m.dispose())
            } else if (mesh.material) {
              mesh.material.dispose()
            }
          }
        })
      }
      rendererRef.current = null
      sceneRef.current = null
      cameraRef.current = null
      cubeRef.current = null
    }
  }, [background, pixelRatio])

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '400px', display: 'block' }}
    />
  )
}

export default ThreeScene


