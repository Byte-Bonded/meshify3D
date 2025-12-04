import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Heart, Code, Cpu, Database, Globe } from 'lucide-react';
import './About.css';

const About = () => {
  const team = [
    {
      name: 'Byte-Bonded Team',
      role: 'Development Team',
      image: '👨‍💻',
      github: 'https://github.com/Byte-Bonded'
    }
  ];

  const techStack = [
    { icon: <Code size={24} />, name: 'React', description: 'Frontend Framework' },
    { icon: <Cpu size={24} />, name: 'Python', description: 'Backend & ML' },
    { icon: <Database size={24} />, name: 'Azure Functions', description: 'Serverless Backend' },
    { icon: <Globe size={24} />, name: 'Three.js', description: '3D Visualization' },
  ];

  return (
    <div className="about-page">
      <div className="container">
        {/* Hero */}
        <motion.section 
          className="about-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="about-title">
            About <span className="gradient-text">Meshify3D</span>
          </h1>
          <p className="about-subtitle">
            Transforming medical imaging with the power of deep learning and 3D visualization
          </p>
        </motion.section>

        {/* Mission */}
        <motion.section 
          className="about-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="mission-card">
            <h2>Our Mission</h2>
            <p>
              Meshify3D was created with a simple yet powerful goal: to make 3D medical 
              visualization accessible to everyone. By leveraging cutting-edge deep learning 
              algorithms, we transform 2D medical scans into detailed, interactive 3D models 
              that can aid in diagnosis, surgical planning, and medical education.
            </p>
            <p>
              Our platform supports various medical imaging formats including CT scans, MRI, 
              X-rays, and more. We believe that better visualization leads to better 
              understanding, and better understanding leads to better patient outcomes.
            </p>
          </div>
        </motion.section>

        {/* How It Works */}
        <motion.section 
          className="about-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Upload</h3>
              <p>Upload your medical scan images in supported formats (DICOM, NIfTI, PNG, JPEG)</p>
            </div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Process</h3>
              <p>Our AI analyzes the images, extracts features, and estimates depth information</p>
            </div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Generate</h3>
              <p>A detailed 3D mesh is generated with accurate geometry and texture mapping</p>
            </div>
            <div className="step-card">
              <div className="step-number">04</div>
              <h3>Visualize</h3>
              <p>Interact with your 3D model - rotate, zoom, slice, and export in various formats</p>
            </div>
          </div>
        </motion.section>

        {/* Tech Stack */}
        <motion.section 
          className="about-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Technology Stack</h2>
          <div className="tech-grid">
            {techStack.map((tech, index) => (
              <motion.div 
                key={index}
                className="tech-card"
                whileHover={{ y: -5 }}
              >
                <div className="tech-icon">{tech.icon}</div>
                <h3>{tech.name}</h3>
                <p>{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Team */}
        <motion.section 
          className="about-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Our Team</h2>
          <div className="team-grid">
            {team.map((member, index) => (
              <motion.div 
                key={index}
                className="team-card"
                whileHover={{ y: -5 }}
              >
                <div className="team-avatar">{member.image}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
                <div className="team-links">
                  <a href={member.github} target="_blank" rel="noopener noreferrer">
                    <Github size={20} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section 
          className="about-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="contact-card">
            <h2>Get In Touch</h2>
            <p>
              Have questions, feedback, or want to collaborate? We'd love to hear from you!
            </p>
            <div className="contact-links">
              <a href="https://github.com/Byte-Bonded/meshify3D" target="_blank" rel="noopener noreferrer" className="contact-btn">
                <Github size={20} />
                GitHub
              </a>
              <a href="mailto:contact@meshify3d.com" className="contact-btn">
                <Mail size={20} />
                Email Us
              </a>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="about-footer">
          <p>
            Made with <Heart size={16} className="heart-icon" /> by Byte-Bonded Team
          </p>
          <p>© 2025 Meshify3D. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default About;
