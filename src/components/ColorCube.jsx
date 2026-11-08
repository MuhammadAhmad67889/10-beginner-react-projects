import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import {
  createRenderer,
  createSceneWithCamera,
  disposeRenderer,
  prefersReducedMotion,
} from '../lib/threeSetup'

// A cube that shows the same color the user just flipped to.
// The material color updates when the `color` prop changes,
// so the cube and the swatch never disagree.
export default function ColorCube({ color }) {
  const mountRef = useRef(null)
  const materialRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const renderer = createRenderer(mount)
    if (!renderer) return undefined

    const { scene, camera } = createSceneWithCamera(mount)
    camera.position.z = 5
    sceneRef.current = { renderer, scene, camera }

    const material = new THREE.MeshStandardMaterial({ color })
    materialRef.current = material
    const cube = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.8, 1.8), material)
    scene.add(cube)

    // Two lights so the cube faces have depth instead of flat color.
    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const light = new THREE.DirectionalLight(0xffffff, 1.2)
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
        cube.rotation.y += 0.01
        cube.rotation.x += 0.005
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

  // A new flipped color only changes the material, not the scene.
  // The extra render matters in reduced-motion mode, where there
  // is no animation loop to pick the change up.
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.color.set(color)
    }
    if (sceneRef.current) {
      const { renderer, scene, camera } = sceneRef.current
      renderer.render(scene, camera)
    }
  }, [color])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} aria-hidden="true" />
}
