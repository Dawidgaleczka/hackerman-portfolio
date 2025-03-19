import '../VaporWave/styles/projects.css';

const ProjectsSection = () => {
    return (
        <div className="content-section projects-section">
            <h2>My Projects</h2>
            <div className="projects-grid">
                <div className="project-card">
                    <div className="project-image">
                        <img src="/images/project1.jpg" alt="Project 1" />
                    </div>
                    <h3>Project Title 1</h3>
                    <p>A brief description of the project and the technologies used.</p>
                    <div className="project-links">
                        <a href="#" className="project-link">Demo</a>
                        <a href="#" className="project-link">GitHub</a>
                    </div>
                </div>
                <div className="project-card">
                    <div className="project-image">
                        <img src="/images/project2.jpg" alt="Project 2" />
                    </div>
                    <h3>Project Title 2</h3>
                    <p>A brief description of the project and the technologies used.</p>
                    <div className="project-links">
                        <a href="#" className="project-link">Demo</a>
                        <a href="#" className="project-link">GitHub</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsSection;