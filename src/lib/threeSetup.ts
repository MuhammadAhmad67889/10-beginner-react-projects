import * as THREE from 'three'

// Every Three.js component in this app follows the same pattern:
// try to create a renderer, and if the browser has no WebGL the
// component simply renders nothing instead of crashing the page.
export function createRenderer(
  container: HTMLElement
): THREE.WebGLRenderer | null {
  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)
    return renderer
  } catch {
    // No WebGL on this device. Returning null means "show nothing",
    // which the components treat as a normal, quiet fallback.
    return null
  }
}

export function createSceneWithCamera(container: HTMLElement): {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
} {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  )
  camera.position.z = 6
  return { scene, camera }
}

// Run this in the useEffect cleanup. A renderer that is never
// disposed keeps its GPU memory and its animation loop alive,
// which is the most common Three.js leak in React apps.
export function disposeRenderer(
  renderer: THREE.WebGLRenderer | null,
  scene?: THREE.Scene | null
): void {
  if (!renderer) return
  if (scene) {
    scene.traverse((object) => {
      const mesh = object as THREE.Mesh
      if (mesh.geometry) mesh.geometry.dispose()
      if (mesh.material) {
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]
        materials.forEach((material) => material.dispose())
      }
    })
  }
  renderer.dispose()
  if (renderer.domElement.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement)
  }
}

// Reduced motion means one still frame instead of a loop.
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
