import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { ArrowRight, Upload, Box, Scan, Zap, Shield, Layers } from 'lucide-react';
import './Home.css';

const AnimatedSphere = () => {
  return (
    <Sphere args={[1, 100, 200]} scale={2.2}>
      <MeshDistortMaterial
        color="#6366f1"
        attach="material"
        distort={0.4}
        speed={1.5}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
};

const Home = () => {
  const features = [
    {
      icon: <Scan size={32} />,
      title: 'Medical Scan Support',
      description: 'Upload CT, MRI, X-Ray and other medical imaging formats for accurate 3D reconstruction.'
    },
    {
      icon: <Box size={32} />,
      title: '3D Visualization',
      description: 'Interactive 3D models with rotation, zoom, and cross-section viewing capabilities.'
    },
    {
      icon: <Zap size={32} />,
      title: 'Fast Processing',
      description: 'AI-powered mesh generation delivers results in seconds, not hours.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure & Private',
      description: 'Your medical data is encrypted and never stored on our servers.'
    },
    {
      icon: <Layers size={32} />,
      title: 'Multiple Formats',
      description: 'Export your 3D models in OBJ, STL, GLTF and other popular formats.'
    },
    {
      icon: <Upload size={32} />,
      title: 'Easy Upload',
      description: 'Drag and drop interface with support for batch processing.'
    }
  ];

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Medical Imaging Revolution
            </div>
            <h1 className="hero-title">
              Transform Medical Scans into
              <span className="gradient-text"> 3D Visualizations</span>
            </h1>
            <p className="hero-description">
              Meshify3D uses advanced deep learning to convert 2D medical images 
              into detailed, interactive 3D models. Perfect for diagnosis, 
              surgical planning, and medical education.
            </p>
            <div className="hero-actions">
              <Link to="/upload" className="btn-primary">
                Start Scanning
                <ArrowRight size={20} />
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">99.2%</span>
                <span className="stat-label">Accuracy</span>
              </div>
              <div className="stat">
                <span className="stat-value">&lt;30s</span>
                <span className="stat-label">Processing</span>
              </div>
              <div className="stat">
                <span className="stat-value">HIPAA</span>
                <span className="stat-label">Compliant</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="sphere-container">
              <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
                <AnimatedSphere />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
              </Canvas>
            </div>
            <div className="sphere-glow"></div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-description">
              Everything you need to transform medical imaging into actionable 3D insights
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Ready to Visualize Your Data?</h2>
            <p className="cta-description">
              Upload your medical scan and see the magic happen in real-time.
            </p>
            <Link to="/upload" className="btn-primary btn-large">
              Upload Your First Scan
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
