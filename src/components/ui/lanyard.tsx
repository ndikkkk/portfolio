import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./lanyard.css";

interface LanyardProps {
  frontImage?: string;
  backImage?: string;
  size?: number;
  anchor?: "left" | "center" | "right";
  strapColor?: string;
  cardColor?: string;
  finish?: "glossy" | "matte" | "holographic" | "metallic";
  breeze?: number;
  interactive?: boolean;
  className?: string;
}

const anchors = { left: -0.42, center: 0, right: 0.42 };

export function Lanyard({
  frontImage,
  backImage,
  size = 0.6,
  anchor = "center",
  strapColor = "#111111",
  cardColor = "#ffffff",
  finish = "glossy",
  breeze = 0.5,
  interactive = true,
  className = "",
}: LanyardProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 8);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x55505a, 2));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-3, 5, 6);
    scene.add(light);

    const card = new THREE.Group();
    scene.add(card);
    const material = new THREE.MeshPhysicalMaterial({
      color: cardColor,
      roughness: finish === "matte" ? 0.86 : finish === "metallic" ? 0.3 : 0.4,
      metalness: finish === "metallic" ? 0.65 : 0,
      clearcoat: finish === "glossy" || finish === "holographic" ? 0.8 : 0,
    });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.76, 0.055), material);
    card.add(body);

    const textureLoader = new THREE.TextureLoader();
    const faceMaterials: THREE.Mesh[] = [];
    const loadFace = (url: string | undefined, side: number) => {
      if (!url) return;
      textureLoader.load(url, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        const face = new THREE.Mesh(
          new THREE.PlaneGeometry(1.2, 1.7),
          new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide }),
        );
        face.position.z = side * 0.031;
        if (side < 0) face.rotation.y = Math.PI;
        card.add(face);
        faceMaterials.push(face);
      });
    };
    loadFace(frontImage, 1);
    loadFace(backImage || frontImage, -1);

    const strapMaterial = new THREE.MeshStandardMaterial({ color: strapColor, roughness: 0.78 });
    const strap = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 2.15), strapMaterial);
    strap.position.set(0, 1.65, 0);
    scene.add(strap);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.105, 0.025, 12, 32),
      new THREE.MeshStandardMaterial({ color: "#d9dce2", metalness: 0.85, roughness: 0.2 }),
    );
    ring.position.y = 0.91;
    card.add(ring);

    let frame = 0;
    let start = performance.now();
    let dragging = false;
    let pointerX = 0;
    const render = (now: number) => {
      const elapsed = (now - start) / 1000;
      if (!dragging) {
        card.rotation.z = Math.sin(elapsed * 1.2) * breeze * 0.09;
        card.rotation.y = Math.sin(elapsed * 0.7) * 0.14;
        card.position.x += (anchors[anchor] - card.position.x) * 0.04;
      }
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.position.z = Math.max(6.4, 8 / Math.min(1, width / height));
      camera.updateProjectionMatrix();
      card.scale.setScalar(Math.max(0.4, Math.min(1.1, (height / 560) * (size / 0.6))));
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!interactive) return;
      dragging = true;
      pointerX = event.clientX;
      renderer.domElement.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      card.rotation.y += (event.clientX - pointerX) * 0.012;
      pointerX = event.clientX;
    };
    const onPointerUp = () => { dragging = false; };
    renderer.domElement.className = "lanyard-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((item) => {
            if (item instanceof THREE.MeshBasicMaterial && item.map) item.map.dispose();
            item.dispose();
          });
        }
      });
      faceMaterials.length = 0;
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [anchor, backImage, breeze, cardColor, finish, frontImage, interactive, size, strapColor]);

  return <div ref={hostRef} className={`lanyard ${className}`.trim()} />;
}