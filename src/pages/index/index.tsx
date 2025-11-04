import './index.css'
import * as THREE from 'three'
import { useRef , useEffect } from 'react'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

function ElysianCanvas() {

  // 优先获取canvas元素
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // 创建透视相机(PerspectiveCamera)。透视相机模拟人眼的视角，能够产生透视效果。
  const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5)
  camera.position.z = 2

  // 创建场景(Scene)。场景是所有物体的容器，所有物体都需要添加到场景中。
  const scene = new THREE.Scene()

  const color = 0xFFFFFF;
  const intensity = 3;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);

  // 导入一个obj模型
  const objLoader = new OBJLoader()
  const mtlLoader = new MTLLoader()
  mtlLoader.load('/assets/obj/elysian.mtl', (materials) => {
    materials.preload()
    objLoader.setMaterials(materials)
    objLoader.load('/assets/obj/elysian.obj', (object) => {
      scene.add(object)
    })
  })

  // 初始化后获取页面宽高进行设置WebGL渲染器的宽高
  // WebGL渲染器(WebGLRenderer)。渲染器负责将你提供的所有数据渲染绘制到canvas上。
  useEffect(() => {
    setTimeout(() => {
      if (canvasRef.current) {
        const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvasRef.current as HTMLCanvasElement })
        renderer.setSize(window.innerWidth/2, window.innerHeight/2)
        renderer.render(scene, camera)
      }
    }, 5000)
  }, [])


  


  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  )
}

export default function Index() {
  return (
    <div className="index-page">
      <h1>欢迎来到 Elysian Realm Word</h1>
      <p>这是您的主页</p>
      <ElysianCanvas />
    </div>
  )
}




