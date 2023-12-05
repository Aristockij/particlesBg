
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const gradient = ctx.createLinearGradient(0,0, canvas.width, canvas.height);
gradient.addColorStop(0,'white')
gradient.addColorStop(1,'blue')

ctx.fillStyle = gradient;
ctx.strokeStyle = 'white';

class Particle{
    constructor(effect, index) {
        this.effect = effect;
        this.radius = Math.floor(Math.random() * 10 + 1);
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
        this.vx = Math.random() * 0.2 - 0.1;
        this.vy = Math.random() * 0.2 - 0.1;

        this.maxRadius = this.radius * 5;
    }
    draw(context){
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fill();
        context.stroke();

        context.fillStyle = 'white'
        context.beginPath();
        context.arc(this.x - this.radius * 0.2, this.y- this.radius * 0.3, this.radius * 0.6, 0, Math.PI * 2);
        context.fill();
        context.stroke();

    }
    update(){
        const dx = this.x - this.effect.mouse.x;
        const dy = this.y - this.effect.mouse.y;
        const distance = Math.hypot(dx, dy);
        const force = (this.effect.mouse.radius/distance);

        if(distance < this.effect.mouse.radius && this.radius < this.maxRadius){
            const angle = Math.atan2(dy, dx);
            this.pushX += Math.cos(angle) * force;
            this.pushY += Math.sin(angle) * force;

            this.x += dx * 0.03;
            this.y += dy * 0.03;
        }

        this.x +=  this.vx;
        this.y +=  this.vy;
    }
    reset(){
        this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2);
        this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2);
    }
}

class Effect{
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 500;
        this.createParticles();

        this.mouse ={
            x: 0,
            y: 0,
            radius: 100,
        }

        window.addEventListener('resize', e => {
            this.resize(e.target.window.innerWidth, e.target.window.innerHeight)
        })
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        })
    }
    createParticles(){
        for(let i = 0; i < this.numberOfParticles; i++){
            this.particles.push(new Particle(this, i))
        }
    }
    handleParticles(context){
        this.connectionParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
        });
    }
    connectionParticles(context){
        const maxDistance = 100;
        for(let a = 0; a < this.particles.length; a++){
            for(let b = a; b < this.particles.length; b++){
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if(distance < maxDistance){
                    context.save();
                    const opacity = 1 - (distance/maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    }
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;

        const gradient = this.context.createLinearGradient(0,0, width, height);
        gradient.addColorStop(0,'white')
        gradient.addColorStop(0.5,'magenta')
        gradient.addColorStop(1,'blue')

        this.context.fillStyle = gradient;
        this.context.strokeStyle = 'white';

        this.particles.forEach(particle => {
            particle.reset();
        })
    }
}

const effect = new Effect(canvas, ctx);

function animation(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    effect.handleParticles(ctx);
    requestAnimationFrame(animation);
}
animation()
