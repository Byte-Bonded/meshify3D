import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import { RotateCcw, ZoomIn, ZoomOut, Download, Layers, Eye, EyeOff, Box } from 'lucide-react';
import * as THREE from 'three';
import './Viewer.css';

// 3D Brain/Organ Model Component
const OrganModel = ({ wireframe, color }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  // Create a more complex geometry to simulate organ
  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
    >
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={0.3}
        metalness={0.6}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  );
};

// Loading component for 3D scene
const Loader = () => (
  <Html center>
    <div className="viewer-loader">
      <div className="loader-spinner"></div>
      <p>Loading 3D Model...</p>
    </div>
  </Html>
);

const Viewer = () => {
  const [meshData, setMeshData] = useState(null);
  const [wireframe, setWireframe] = useState(false);
  const [showLayers, setShowLayers] = useState(true);
  const [modelColor, setModelColor] = useState('#6366f1');
  const controlsRef = useRef();

  useEffect(() => {
    // Get uploaded data from localStorage
    const data = localStorage.getItem('meshifyData');
    if (data) {
      setMeshData(JSON.parse(data));
    }
  }, []);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleDownload = () => {
    // Demo download - in production this would download actual mesh
    const objContent = `# Meshify3D Generated Model
# Generated: ${new Date().toISOString()}
# Job ID: ${meshData?.jobId || 'demo'}

# Vertices
v 0 0 0
v 1 0 0
v 1 1 0
v 0 1 0
v 0 0 1
v 1 0 1
v 1 1 1
v 0 1 1

# Faces
f 1 2 3 4
f 5 6 7 8
f 1 2 6 5
f 2 3 7 6
f 3 4 8 7
f 4 1 5 8
`;
    const blob = new Blob([objContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meshify3d_model.obj';
    a.click();
    URL.revokeObjectURL(url);
  };

  const colorOptions = [
    { color: '#6366f1', name: 'Purple' },
    { color: '#06b6d4', name: 'Cyan' },
    { color: '#10b981', name: 'Green' },
    { color: '#f59e0b', name: 'Orange' },
    { color: '#ef4444', name: 'Red' },
    { color: '#ec4899', name: 'Pink' },
  ];

  return (
    <div className="viewer-page">
      <div className="viewer-container">
        {/* Sidebar Controls */}
        <motion.aside 
          className="viewer-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <Box size={18} />
              Model Info
            </h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Job ID</span>
                <span className="info-value">{meshData?.jobId?.slice(0, 12) || 'demo'}...</span>
              </div>
              <div className="info-item">
                <span className="info-label">Files</span>
                <span className="info-value">{meshData?.files?.length || 1}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Vertices</span>
                <span className="info-value">12,847</span>
              </div>
              <div className="info-item">
                <span className="info-label">Faces</span>
                <span className="info-value">25,694</span>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">
              <Layers size={18} />
              Display Options
            </h3>
            <div className="option-group">
              <button 
                className={`option-btn ${wireframe ? 'active' : ''}`}
                onClick={() => setWireframe(!wireframe)}
              >
                {wireframe ? <Eye size={18} /> : <EyeOff size={18} />}
                {wireframe ? 'Solid View' : 'Wireframe'}
              </button>
              <button 
                className={`option-btn ${showLayers ? 'active' : ''}`}
                onClick={() => setShowLayers(!showLayers)}
              >
                <Layers size={18} />
                Layers
              </button>
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Color</h3>
            <div className="color-options">
              {colorOptions.map((opt) => (
                <button
                  key={opt.color}
                  className={`color-btn ${modelColor === opt.color ? 'active' : ''}`}
                  style={{ background: opt.color }}
                  onClick={() => setModelColor(opt.color)}
                  title={opt.name}
                />
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="sidebar-title">Actions</h3>
            <div className="action-buttons">
              <button className="action-btn" onClick={resetCamera}>
                <RotateCcw size={18} />
                Reset View
              </button>
              <button className="action-btn primary" onClick={handleDownload}>
                <Download size={18} />
                Download OBJ
              </button>
            </div>
          </div>
        </motion.aside>

        {/* 3D Viewer */}
        <motion.div 
          className="viewer-canvas-container"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={<Loader />}>
              <ambientLight intensity={0.4} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
              <spotLight
                position={[0, 10, 0]}
                angle={0.3}
                penumbra={1}
                intensity={0.5}
                castShadow
              />
              
              <OrganModel wireframe={wireframe} color={modelColor} />
              
              <ContactShadows
                position={[0, -2, 0]}
                opacity={0.4}
                scale={10}
                blur={2}
                far={4}
              />
              
              <Environment preset="city" />
              
              <OrbitControls
                ref={controlsRef}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={2}
                maxDistance={10}
              />
            </Suspense>
          </Canvas>

          {/* Canvas Controls Overlay */}
          <div className="canvas-controls">
            <button className="canvas-btn" onClick={() => controlsRef.current?.dollyIn(1.2)}>
              <ZoomIn size={20} />
            </button>
            <button className="canvas-btn" onClick={() => controlsRef.current?.dollyOut(1.2)}>
              <ZoomOut size={20} />
            </button>
            <button className="canvas-btn" onClick={resetCamera}>
              <RotateCcw size={20} />
            </button>
          </div>

          {/* Viewer Header */}
          <div className="viewer-header">
            <h2>3D Visualization</h2>
            <span className="viewer-badge">Interactive</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Viewer;
