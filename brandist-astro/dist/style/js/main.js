document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Mobile Toggle
    const hamburger = document.querySelector('.navbar-hamburger .hamburger');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (hamburger && navbarCollapse) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            navbarCollapse.classList.toggle('show');
            hamburger.classList.toggle('is-active');
        });
    }

    // 2. Mobile Dropdown Toggle
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            if (window.innerWidth < 1200) {
                e.preventDefault();
                e.stopPropagation();

                // Close other dropdowns on the same level
                const parentLi = this.parentElement;
                const siblings = parentLi.parentElement.children;
                for (let i = 0; i < siblings.length; i++) {
                    if (siblings[i] !== parentLi && siblings[i].classList.contains('dropdown')) {
                        const siblingToggle = siblings[i].querySelector('.dropdown-toggle');
                        const siblingMenu = siblings[i].querySelector('.dropdown-menu');
                        if (siblingToggle) siblingToggle.classList.remove('show');
                        if (siblingMenu) siblingMenu.classList.remove('show');
                    }
                }

                this.classList.toggle('show');
                const nextMenu = this.nextElementSibling;
                if (nextMenu && nextMenu.classList.contains('dropdown-menu')) {
                    nextMenu.classList.toggle('show');
                }
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            if (!navbarCollapse.contains(e.target) && !hamburger.contains(e.target)) {
                navbarCollapse.classList.remove('show');
                hamburger.classList.remove('is-active');
            }
        }
    });

    // 3. Sticky Navbar & Progress on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('nav-sticky', 'fixed-top');
            navbar?.classList.remove('transparent');
        } else {
            navbar?.classList.remove('nav-sticky', 'fixed-top');
            navbar?.classList.add('transparent');
        }
    });

    // 4. Scroll to top button (if exists)
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });
    }

    // 5. Initialize Tooltips natively if any exist (Optional)
    // Using title attribute is native. Since we removed BS tooltips, we don't need init.

    // 6. Intersection Observer for simple scroll animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => observer.observe(el));
    }

    // 7. Vanilla JS Accordion (Replacing Bootstrap Collapse)
    const collapseToggles = document.querySelectorAll('[data-toggle="collapse"]');
    collapseToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const targetSelector = toggle.getAttribute('data-target');
            if (!targetSelector) return;

            const targetEl = document.querySelector(targetSelector);
            if (targetEl) {
                const parentSelector = targetEl.getAttribute('data-parent');
                if (parentSelector && !targetEl.classList.contains('show')) {
                    const parentEl = document.querySelector(parentSelector);
                    if (parentEl) {
                        const openSiblings = parentEl.querySelectorAll('.collapse.show');
                        openSiblings.forEach(sib => {
                            sib.classList.remove('show');
                            const sibToggle = parentEl.querySelector(`[data-target="#${sib.id}"]`);
                            if (sibToggle) sibToggle.classList.add('collapsed');
                        });
                    }
                }

                if (targetEl.classList.contains('show')) {
                    targetEl.classList.remove('show');
                    toggle.classList.add('collapsed');
                } else {
                    targetEl.classList.add('show');
                    toggle.classList.remove('collapsed');
                }
            }
        });
    });

    // 8. Desktop Dropdown Hover State
    if (window.innerWidth >= 1200) {
        document.querySelectorAll('.navbar .dropdown').forEach(dropdown => {
            dropdown.addEventListener('mouseenter', function () {
                const menu = this.querySelector('.dropdown-menu');
                if (menu) {
                    menu.classList.add('show');
                    menu.style.display = 'block';
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                }
            });
            dropdown.addEventListener('mouseleave', function () {
                const menu = this.querySelector('.dropdown-menu');
                if (menu) {
                    menu.classList.remove('show');
                    menu.style.display = '';
                    menu.style.opacity = '';
                    menu.style.visibility = '';
                }
            });
        });
    }

});
