import '../VaporWave/styles/projects.css';

const ProjectsSection = () => {
    return (
        <div className="content-section projects-section">
            <h2>My Projects</h2>
            <div className="projects-grid">
                <div className="project-card">
                    <div className="project-image">
                        <img src="/images/portfolio.png" alt="Project 1" />
                    </div>
                    <h3>Project Title 1</h3>
                    <p>My portfolio made in react with vite</p>
                    <div className="project-links">
                        <a href="dawidgaleczka.com" className="project-link">Demo</a>
                        <a href="https://github.com/Dawidgaleczka/hackerman-portfolio" className="project-link">GitHub</a>
                    </div>
                </div>
                <div className="project-card">
                    <div className="project-image">
                        <img src="/images/littlestarsstudio.png" alt="Project 2" />
                    </div>
                    <h3>Littlestarsstudio</h3>
                    <p>A website for a photographer</p>
                    <div className="project-links">
                        <a href="https://littlestarsstudios.nl/" className="project-link">Demo</a>
                        <a href="https://github.com/Dawidgaleczka" className="project-link">GitHub</a>
                    </div>
                </div>
                <div className="project-card">
                    <div className="project-image">
                        <img src="/images/F1pulse.jpg" alt="Project 3" />
                    </div>
                    <h3>F1Pulse</h3>
                    <p>Fotmob for F1 fans (still in work)</p>
                    <div className="project-links">
                        <a href="http://f1pulse.net/" className="project-link">Demo</a>
                        <a href="https://github.com/Dawidgaleczka/F1Pulse" className="project-link">GitHub</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectsSection;