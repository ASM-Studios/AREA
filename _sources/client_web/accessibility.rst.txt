Accessibility Documentation
===========================

Introduction
------------
This document provides an overview of the accessibility features implemented in the AREA Client Web project. Accessibility is a crucial aspect of web development, ensuring that all users, including those with disabilities, can access and interact with the website effectively.

Importance of Accessibility
---------------------------
Web accessibility is essential for creating an inclusive digital environment. It ensures that people with disabilities can perceive, understand, navigate, and interact with the web. By making the website accessible, we not only comply with legal requirements but also enhance the user experience for everyone.

Accessibility Features and Considerations
-----------------------------------------
1. **Semantic HTML**: The use of semantic HTML elements helps screen readers and other assistive technologies understand the structure and content of the web pages.

2. **Keyboard Navigation**: All interactive elements are accessible via keyboard navigation, allowing users who cannot use a mouse to navigate the site.

3. **Color Contrast**: The website ensures sufficient color contrast between text and background, making it easier for users with visual impairments to read the content.

4. **ARIA Attributes**: ARIA (Accessible Rich Internet Applications) attributes are used to enhance the accessibility of dynamic content and complex UI components.

5. **Responsive Design**: The site is designed to be responsive, ensuring accessibility across various devices and screen sizes.

Compliance with Accessibility Norms
-----------------------------------
The AREA Client Web project complies with several accessibility standards, including:

- **WCAG 2.1 (Web Content Accessibility Guidelines)**: The project adheres to the guidelines set by WCAG 2.1, ensuring that the content is perceivable, operable, understandable, and robust.

- **RGAA** (Référentiel Général d'Amélioration de l'Accessibilité): This is the French accessibility standard that aligns with WCAG 2.1 but includes additional requirements specific to France.

- **EN 301 549** This is the European standard for accessibility requirements for ICT products and services, which also aligns with WCAG 2.1.

Accessibility Scores
--------------------
The following are the accessibility scores for each page, as measured by Google Chrome Lighthouse:

- **Home (/)**: 95%
- **Login (/login)**: 100%
- **Register (/register)**: 100%
- **Dashboard (/dashboard)**: 96%
- **Workflow Create/Update (/workflow/create & /workflow/update/{id})**: 96%
- **Account (/account/me)**: 93%

The mean accessibility score across all pages is 97, indicating a high level of accessibility compliance.

Conclusion
----------
The AREA Client Web project is committed to providing an accessible experience for all users. By adhering to established accessibility standards and continuously evaluating our practices, we ensure that our website is inclusive and user-friendly.

For more information on accessibility practices and guidelines, please refer to the [W3C Web Accessibility Initiative](https://www.w3.org/WAI/). 
