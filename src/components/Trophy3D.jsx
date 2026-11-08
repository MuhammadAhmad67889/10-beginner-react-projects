import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  createRenderer,
  createSceneWithCamera,
  disposeRenderer,
  prefersReducedMotion,
} from '../lib/threeSetup'

// A gold star inside a gold ring, shown on the quiz results screen.
// The star is a flat 5-point shape extruded so it has thickness.
function makeStarGeometry() {
  const shape = new THREE.Shape()
  const points = 5
  const outerRadius = 1
  const innerRadius = 0.42
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 0.25,
    bevelEnabled: false,
  })
  geometry.center()
  return geometry
}

export default function Trophy3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const renderer = createRenderer(mount)
    if (!renderer) return undefined

    const { scene, camera } = createSceneWithCamera(mount)
    camera.position.z = 5

    const gold = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.7,
      roughness: 0.3,
    })

    const star = new THREE.Mesh(makeStarGeometry(), gold)
    scene.add(star)

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.12, 16, 64), gold)
    scene.add(ring)

    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const light = new THREE.DirectionalLight(0xffffff, 1.5)
    light.position.set(3, 4, 5)
    scene.add(light)

    function drawFrame() {
      renderer.render(scene, camera)
    }

    if (prefersReducedMotion()) {
      drawFrame()
    } else {
      let frameId
      function animate() {
        frameId = requestAnimationFrame(animate)
        star.rotation.y += 0.01
        ring.rotation.x += 0.004
        ring.rotation.y += 0.006
        drawFrame()
      }
      animate()
      return () => {
        cancelAnimationFrame(frameId)
        disposeRenderer(renderer, scene)
      }
    }

    return () => disposeRenderer(renderer, scene)
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} aria-hidden="true" />
}
