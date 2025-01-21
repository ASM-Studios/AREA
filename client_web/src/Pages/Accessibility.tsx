import React from 'react';
import { useUser } from "@/Context/ContextHooks";

const Accessibility: React.FC = () => {
    const { translations } = useUser();

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
                }}>{translations?.accessibility?.title}</h1>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>{translations?.accessibility?.introduction?.title}</h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        {translations?.accessibility?.introduction?.content}
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>{translations?.accessibility?.importance?.title}</h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        {translations?.accessibility?.importance?.content}
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>{translations?.accessibility?.features?.title}</h2>
                    <ul style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333',
                        paddingLeft: '1.5rem'
                    }}>
                        <li><strong>{translations?.accessibility?.features?.items?.semantic}</strong>: The use of semantic HTML elements helps screen readers and other
                            assistive technologies understand the structure and content of the web pages.
                        </li>
                        <li><strong>{translations?.accessibility?.features?.items?.keyboard}</strong>: All interactive elements are accessible via keyboard
                            navigation, allowing users who cannot use a mouse to navigate the site.
                        </li>
                        <li><strong>{translations?.accessibility?.features?.items?.contrast}</strong>: The website ensures sufficient color contrast between text and
                            background, making it easier for users with visual impairments to read the content.
                        </li>
                        <li><strong>{translations?.accessibility?.features?.items?.aria}</strong>: ARIA (Accessible Rich Internet Applications) attributes are
                            used to enhance the accessibility of dynamic content and complex UI components.
                        </li>
                        <li><strong>{translations?.accessibility?.features?.items?.responsive}</strong>: The site is designed to be responsive, ensuring
                            accessibility across various devices and screen sizes.
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>{translations?.accessibility?.compliance?.title}</h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        {translations?.accessibility?.compliance?.intro}
                    </p>
                    <ul style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333',
                        paddingLeft: '1.5rem'
                    }}>
                        <li><strong>{translations?.accessibility?.compliance?.standards?.wcag}</strong>: The project adheres to the
                            guidelines set by WCAG 2.1, ensuring that the content is perceivable, operable, understandable,
                            and robust.
                        </li>
                        <li><strong>{translations?.accessibility?.compliance?.standards?.rgaa}</strong> (Référentiel Général d'Amélioration de l'Accessibilité): This is the
                            French accessibility standard that aligns with WCAG 2.1 but includes additional requirements
                            specific to France.
                        </li>
                        <li><strong>{translations?.accessibility?.compliance?.standards?.en301}</strong>: This is the European standard for accessibility requirements for
                            ICT products and services, which also aligns with WCAG 2.1.
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>{translations?.accessibility?.scores?.title}</h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        {translations?.accessibility?.scores?.intro}
                    </p>
                    <ul style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333',
                        paddingLeft: '1.5rem'
                    }}>
                        <li><strong>Home (/)</strong>: 95%</li>
                        <li><strong>Login (/login)</strong>: 100%</li>
                        <li><strong>Register (/register)</strong>: 100%</li>
                        <li><strong>2FA (/2fa)</strong>: 100%</li>
                        <li><strong>Accessibility (/accessibility)</strong>: 100%</li>
                        <li><strong>Download (/download)</strong>: 100%</li>
                        <li><strong>Dashboard (/dashboard)</strong>: 96%</li>
                        <li><strong>Workflow Create/Update (/workflow/create & /workflow/update/{'{id}'})</strong>: 96%</li>
                        <li><strong>Account (/account/me)</strong>: 93%</li>
                    </ul>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        {translations?.accessibility?.scores?.mean}
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: 'clamp(1.25rem, 3vw, 2rem)',
                        marginBottom: '1rem',
                        color: '#1a1a1a'
                    }}>{translations?.accessibility?.conclusion?.title}</h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        {translations?.accessibility?.conclusion?.content}
                    </p>
                    <p style={{
                        fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                        lineHeight: '1.6',
                        color: '#333333'
                    }}>
                        {translations?.accessibility?.conclusion?.learnMore} <a
                        href="https://www.w3.org/WAI/" target="_blank" rel="noopener noreferrer">W3C Web Accessibility
                        Initiative</a>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Accessibility;
