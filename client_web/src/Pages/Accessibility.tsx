import React from 'react';

const Accessibility: React.FC = () => {
    return (
        <div style={{
            minHeight: '100vh',
            padding: '2rem 1rem',
            backgroundColor: '#f5f5f5',
            position: 'relative',
            overflow: 'auto'
        }} role="main">
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                padding: 'clamp(1rem, 5vw, 3rem)',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}>
                <h1 style={{
                    fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                    marginBottom: '2rem',
                    color: '#1a1a1a'
                }}>Accessibility Statement</h1>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>Introduction</h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        This document provides an overview of the accessibility features implemented in the AREA Client Web
                        project. Accessibility is a crucial aspect of web development, ensuring that all users, including
                        those with disabilities, can access and interact with the website effectively.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>Importance of Accessibility</h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        Web accessibility is essential for creating an inclusive digital environment. It ensures that people
                        with disabilities can perceive, understand, navigate, and interact with the web. By making the
                        website accessible, we not only comply with legal requirements but also enhance the user experience
                        for everyone.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>Accessibility Features and Considerations</h2>
                    <ul style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333',
                        paddingLeft: '1.5rem'
                    }}>
                        <li><strong>Semantic HTML</strong>: The use of semantic HTML elements helps screen readers and other
                            assistive technologies understand the structure and content of the web pages.
                        </li>
                        <li><strong>Keyboard Navigation</strong>: All interactive elements are accessible via keyboard
                            navigation, allowing users who cannot use a mouse to navigate the site.
                        </li>
                        <li><strong>Color Contrast</strong>: The website ensures sufficient color contrast between text and
                            background, making it easier for users with visual impairments to read the content.
                        </li>
                        <li><strong>ARIA Attributes</strong>: ARIA (Accessible Rich Internet Applications) attributes are
                            used to enhance the accessibility of dynamic content and complex UI components.
                        </li>
                        <li><strong>Responsive Design</strong>: The site is designed to be responsive, ensuring
                            accessibility across various devices and screen sizes.
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>Compliance with Accessibility Norms</h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        The AREA Client Web project complies with several accessibility standards, including:
                    </p>
                    <ul style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333',
                        paddingLeft: '1.5rem'
                    }}>
                        <li><strong>WCAG 2.1 (Web Content Accessibility Guidelines)</strong>: The project adheres to the
                            guidelines set by WCAG 2.1, ensuring that the content is perceivable, operable, understandable,
                            and robust.
                        </li>
                        <li><strong>RGAA</strong> (Référentiel Général d'Amélioration de l'Accessibilité): This is the
                            French accessibility standard that aligns with WCAG 2.1 but includes additional requirements
                            specific to France.
                        </li>
                        <li><strong>EN 301 549</strong>: This is the European standard for accessibility requirements for
                            ICT products and services, which also aligns with WCAG 2.1.
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>Accessibility Scores</h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        The following are the accessibility scores for each page, as measured by Google Chrome Lighthouse:
                    </p>
                    <ul style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333',
                        paddingLeft: '1.5rem'
                    }}>
                        <li><strong>Home (/)</strong>: 95%</li>
                        <li><strong>Login (/login)</strong>: 100%</li>
                        <li><strong>Accessibility (/accessibility)</strong>: 100%</li>
                        <li><strong>Register (/register)</strong>: 100%</li>
                        <li><strong>Dashboard (/dashboard)</strong>: 96%</li>
                        <li><strong>Workflow Create/Update (/workflow/create & /workflow/update/{'{id}'})</strong>: 96%</li>
                        <li><strong>Account (/account/me)</strong>: 93%</li>
                    </ul>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        The mean accessibility score across all pages is 97, indicating a high level of accessibility
                        compliance.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>Conclusion</h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        The AREA Client Web project is committed to providing an accessible experience for all users. By
                        adhering to established accessibility standards and continuously evaluating our practices, we ensure
                        that our website is inclusive and user-friendly.
                    </p>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        For more information on accessibility practices and guidelines, please refer to the <a
                        href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer">W3C Web Accessibility
                        Initiative</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Accessibility;
