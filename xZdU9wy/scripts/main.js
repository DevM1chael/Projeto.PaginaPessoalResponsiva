import { initThreeScene } from './three_scene.js';
import { initScrollAnimations } from './scroll_animations.js';
import { initChatbot } from './chatbot.js';

document.addEventListener('DOMContentLoaded', () => {
    
    lucide.createIcons();
    
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    const threeObject = initThreeScene('webgl-container');
    if (!threeObject) {
        document.getElementById('webgl-container').style.display = 'none';
        const fallback = document.getElementById('webgl-fallback');
        fallback.style.display = 'flex';
        fallback.classList.remove('hidden');
    } else {
        initScrollAnimations(threeObject);
    }
    
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuIcon = mobileMenuButton.querySelector('i');
    
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('-translate-y-full');
        if (mobileMenu.classList.contains('-translate-y-full')) {
            mobileMenuIcon.setAttribute('data-lucide', 'menu');
        } else {
            mobileMenuIcon.setAttribute('data-lucide', 'x');
        }
        lucide.createIcons();
    });

    document.querySelectorAll('.nav-link-mobile').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('-translate-y-full');
            mobileMenuIcon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });
    
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (form.elements.honeypot.value) {
            console.log('Bot submission detected.');
            return;
        }

        if (!form.checkValidity()) {
            feedback.textContent = 'Por favor, preencha todos os campos corretamente.';
            feedback.style.color = '#D4AF37';
            setTimeout(() => { feedback.textContent = ''; }, 4000);
            return;
        }

        const submitButton = form.querySelector('button[type=\\\"submit\\\"]');
        submitButton.disabled = true;
        feedback.textContent = 'Enviando sua mensagem...';
        feedback.style.color = '#8892b0';
        
        const formData = new FormData(form);
        const formAction = 'https://formspree.io/f/xvgwrjyn';

        try {
            const response = await fetch(formAction, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                feedback.textContent = 'Obrigado! Sua mensagem foi enviada com sucesso.';
                feedback.style.color = '#32cd32';
                form.reset();
            } else {
                throw new Error('Houve um problema ao enviar o formulário.');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            feedback.textContent = 'Erro ao enviar. Tente novamente mais tarde.';
            feedback.style.color = '#ff4500';
        } finally {
            submitButton.disabled = false;
            setTimeout(() => { feedback.textContent = ''; }, 5000);
        }
    });

    const chatbotFab = document.getElementById('chatbot-fab');
    const chatbotWindow = document.getElementById('chatbot-window');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');

    if (chatbotFab && chatbotWindow && chatbotCloseBtn) {
        chatbotFab.addEventListener('click', () => {
            const isOpen = chatbotWindow.classList.toggle('open');
            if (isOpen) {
                lucide.createIcons();
            }
        });

        chatbotCloseBtn.addEventListener('click', () => {
            chatbotWindow.classList.remove('open');
        });
    }

    initChatbot();
});
