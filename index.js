// --- 1. Custom Mouse Cursor Tracker ---
const cursor = document.querySelector('.custom-cursor');
const cursorDot = document.querySelector('.custom-cursor-dot');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Immediately update dot position
  cursorDot.style.left = `${mouseX}px`;
  cursorDot.style.top = `${mouseY}px`;
});

// Animate the outer ring with trailing delay (interpolation)
function animateCursor() {
  const dx = mouseX - cursorX;
  const dy = mouseY - cursorY;
  
  // Interpolation speed (adjust for more/less inertia)
  cursorX += dx * 0.15;
  cursorY += dy * 0.15;
  
  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Mouse hover target animations
document.querySelectorAll('.hover-target').forEach(el => {
  el.addEventListener('mouseenter', () => {
    document.body.classList.add('cursor-hover');
  });
  el.addEventListener('mouseleave', () => {
    document.body.classList.remove('cursor-hover');
  });
});


// --- 2. Interactive Canvas Particles System ---
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let maxParticles = 80;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // Decrease density on smaller mobile viewports
  if (window.innerWidth < 768) {
    maxParticles = 35;
  } else {
    maxParticles = 80;
  }
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
    this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(139, 92, 246, 0.4)';
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Bounce or wrap edges
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    
    // Mouse interaction attraction
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      this.x += dx * 0.01;
      this.y += dy * 0.01;
    }
  }
  
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

// Populate system
function initParticles() {
  particles = [];
  for (let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
}
initParticles();

// Animation loop
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Render connections
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        const alpha = (1 - dist / 120) * 0.15;
        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();


// --- 3. 3D Card Tilt Effect ---
const tiltCards = document.querySelectorAll('.tilt-card-wrapper');

tiltCards.forEach(wrapper => {
  const card = wrapper.querySelector('.project-card');
  
  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate within wrapper
    const y = e.clientY - rect.top;  // y coordinate within wrapper
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Map mouse position to rotation angle (-10 to 10 degrees)
    const rotateX = ((centerY - y) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });
  
  wrapper.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
  });
  
  wrapper.addEventListener('mouseenter', () => {
    card.style.transition = 'none'; // Disable transition during tracking
  });
});





// --- 5. Projects Category Filtering Logic ---
const filterButtons = document.querySelectorAll('.filter-tab');
const projectsGrid = document.getElementById('projects-grid');

filterButtons.forEach(button => {
  button.addEventListener('click', function() {
    // Set active tab class
    filterButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    
    const filterValue = this.getAttribute('data-filter');
    const projectCards = projectsGrid.querySelectorAll('.tilt-card-wrapper');
    
    projectCards.forEach(card => {
      const category = card.getAttribute('data-category');
      
      // Card fade animations
      card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      if (filterValue === 'all' || category === filterValue) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 10);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});


// --- 6. Form Submission Animation Handler ---
const contactForm = document.getElementById('portfolio-contact-form');
const formStatus = document.getElementById('form-status-message');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const origText = submitBtn.innerHTML;
    
    // Set sending state styling
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';
    formStatus.style.color = 'var(--accent-cyan)';
    formStatus.innerText = 'Transmitting data across packet routes...';
    
    setTimeout(() => {
      // Transition to success state
      submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Dispatched!';
      formStatus.style.color = 'var(--accent-emerald)';
      formStatus.innerHTML = '<i class="fa-solid fa-circle-check"></i> Connection established! I will read your message soon.';
      
      // Reset after a delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = origText;
        contactForm.reset();
        formStatus.innerText = '';
      }, 5000);
    }, 2200);
  });
}


// --- 7. Floating Navbar Active Link Styling on Scroll ---
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.addEventListener('scroll', () => {
  let currentSecId = 'home';
  const scrollPos = window.scrollY + 180; // offset header padding
  
  sections.forEach(sec => {
    const secTop = sec.offsetTop;
    const secHeight = sec.clientHeight;
    
    if (scrollPos >= secTop && scrollPos < secTop + secHeight) {
      currentSecId = sec.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSecId}`) {
      link.classList.add('active');
    }
  });
});

// --- 8. Theme Switcher Logic ---
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  const themeIcon = themeToggle.querySelector('i');

  // Check saved theme or system preference
  if (localStorage.getItem('portfolio-theme') === 'light') {
    document.body.classList.add('light-theme');
    themeIcon.className = 'fa-solid fa-moon';
  } else {
    document.body.classList.remove('light-theme');
    themeIcon.className = 'fa-solid fa-sun';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    
    if (isLight) {
      themeIcon.className = 'fa-solid fa-moon';
      localStorage.setItem('portfolio-theme', 'light');
    } else {
      themeIcon.className = 'fa-solid fa-sun';
      localStorage.setItem('portfolio-theme', 'dark');
    }
  });
}
