import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  createRenderer,
  createSceneWithCamera,
  disposeRenderer,
  prefersReducedMotion,
} from '../lib/threeSetup'

// A slow wireframe icosahedron with a cloud of particles behind it.
// It sits in the landing page hero, purely decorative.
export default function ThreeHero() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const renderer = createRenderer(mount)
    // No WebGL on this device: the hero simply shows its text.
    if (!renderer) return undefined

    const { scene, camera } = createSceneWithCamera(mount)

    // The icosahedron: a wireframe so the hero text stays readable.
    const shape = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.6, 0),
      new THREE.MeshBasicMaterial({ color: 0x2563eb, wireframe: true })
    )
    scene.add(shape)

    // The particles: 180 points scattered in a sphere around it.
    const particleCount = 180
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 3
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    )
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({ color: 0x7c3aed, size: 0.06 })
    )
    scene.add(particles)

    function drawFrame() {
      renderer.render(scene, camera)
    }

    // Reduced motion means one still frame, no loop.
    if (prefersReducedMotion()) {
      drawFrame()
    } else {
      let frameId
      function animate() {
        frameId = requestAnimationFrame(animate)
        shape.rotation.y += 0.003
        shape.rotation.x += 0.001
        particles.rotation.y -= 0.0008
        drawFrame()
      }
      animate()

      // Keep the scene fitted if the hero changes size.
      const resizeObserver = new ResizeObserver(() => {
        camera.aspect = mount.clientWidth / mount.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(mount.clientWidth, mount.clientHeight)
      })
      resizeObserver.observe(mount)

      return () => {
        cancelAnimationFrame(frameId)
        resizeObserver.disconnect()
        disposeRenderer(renderer, scene)
      }
    }

    return () => disposeRenderer(renderer, scene)
  }, [])

  return <div className="hero-canvas" ref={mountRef} aria-hidden="true" />
}
